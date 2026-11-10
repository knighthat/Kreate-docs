/**
 * Client for `/api/verify`: looks up the VirusTotal verdict of an official release by its SHA-256.
 * Only the hash is sent. See api-verify.md for the contract this follows.
 *
 * The site and the API share an origin, so a relative URL works without CORS.
 */

const ENDPOINT = '/api/verify'
const MAX_ATTEMPTS = 10
const CACHE_PREFIX = 'kreate:vt:'

export interface ScanVerdict {
  status: 'clean' | 'flagged'
  sha256: string
  name: string
  checkedAt: string
  malicious: number
  suspicious: number
  engines: number
  link: string
}

export type ScanResult =
  | ScanVerdict
  /** VirusTotal hasn't finished; `retryIn` is null once we've stopped asking. */
  | { status: 'scanning'; name?: string; retryIn: number | null }
  /** The upload to VirusTotal failed, so there is no verdict. */
  | { status: 'error'; name?: string }
  /** No scanned release has this hash. */
  | { status: 'unknown' }
  /** The API couldn't be reached or kept failing. */
  | { status: 'unavailable' }
  /** The API rejected our request (a bug on our side). */
  | { status: 'failed' }


/* ------------------------------------------------------------------ */
/* Cache of final verdicts (clean/flagged never change)                */
/* ------------------------------------------------------------------ */

function readCache(sha256: string): ScanVerdict | undefined {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + sha256)
    return raw ? parseVerdict(JSON.parse(raw), sha256) : undefined
  } catch {
    return undefined
  }
}

function writeCache(verdict: ScanVerdict): void {
  try {
    localStorage.setItem(CACHE_PREFIX + verdict.sha256, JSON.stringify(verdict))
  } catch {
    // Storage unavailable (private mode, blocked site data): just don't cache.
  }
}


/* ------------------------------------------------------------------ */
/* Response validation                                                 */
/* ------------------------------------------------------------------ */

const isCount = (v: unknown): v is number => typeof v === 'number' && Number.isInteger(v) && v >= 0
const str = (v: unknown): string | undefined => typeof v === 'string' ? v : undefined

/** The VirusTotal report URL for a hash, which the API's `link` must match exactly. */
export const reportUrl = (sha256: string) => `https://www.virustotal.com/gui/file/${sha256}`

function parseVerdict(body: Record<string, unknown>, sha256: string): ScanVerdict | undefined {
  if (body.status !== 'clean' && body.status !== 'flagged') return undefined
  if (body.sha256 !== sha256) return undefined
  if (!isCount(body.malicious) || !isCount(body.suspicious) || !isCount(body.engines)) return undefined
  return {
    status: body.status,
    sha256,
    name: str(body.name) ?? '',
    checkedAt: str(body.checkedAt) ?? '',
    malicious: body.malicious,
    suspicious: body.suspicious,
    engines: body.engines,
    // Never link anywhere but VirusTotal's report for this exact hash.
    link: reportUrl(sha256),
  }
}


/* ------------------------------------------------------------------ */
/* Request loop                                                        */
/* ------------------------------------------------------------------ */

function sleep(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) return reject(signal.reason)
    const t = setTimeout(() => { signal.removeEventListener('abort', onAbort); resolve() }, ms)
    const onAbort = () => { clearTimeout(t); reject(signal.reason) }
    signal.addEventListener('abort', onAbort, { once: true })
  })
}

type Attempt =
  | { kind: 'done'; result: ScanResult }
  | { kind: 'wait'; seconds: number; name?: string }
  | { kind: 'transient' }

async function attempt(sha256: string, signal: AbortSignal): Promise<Attempt> {
  let res: Response
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sha256 }),
      cache: 'no-store',
      // AbortSignal.any is missing in older browsers; then only the caller can cancel.
      signal: typeof AbortSignal.any === 'function' ? AbortSignal.any([signal, AbortSignal.timeout(15_000)]) : signal,
    })
  } catch (e) {
    if (signal.aborted) throw e
    return { kind: 'transient' } // network error or timeout
  }

  // 5xx (possibly a non-JSON page from Cloudflare): check the status before parsing.
  if (res.status >= 500) return { kind: 'transient' }

  let body: Record<string, unknown>
  try {
    body = await res.json()
    if (typeof body !== 'object' || body === null) throw new Error('Not an object')
  } catch {
    // A non-JSON 4xx isn't our API answering (e.g. a dev server without the endpoint).
    return { kind: 'done', result: { status: 'unavailable' } }
  }

  if (res.status === 404 && body.error === 'unknown') return { kind: 'done', result: { status: 'unknown' } }
  if (res.status === 400 || res.status === 405) {
    console.error('/api/verify rejected the request:', res.status, body)
    return { kind: 'done', result: { status: 'failed' } }
  }
  if (res.status !== 200) return { kind: 'done', result: { status: 'unavailable' } }

  const name = str(body.name)
  switch (body.status) {
    case 'clean':
    case 'flagged': {
      const verdict = parseVerdict(body, sha256)
      if (!verdict) {
        console.error('/api/verify returned an unexpected verdict:', body)
        return { kind: 'done', result: { status: 'failed' } }
      }
      writeCache(verdict)
      return { kind: 'done', result: verdict }
    }
    case 'pending':
    case 'checking': {
      const header = Number(res.headers.get('Retry-After'))
      const raw = typeof body.retryAfter === 'number' ? body.retryAfter : header
      const seconds = Number.isFinite(raw) && raw > 0 ? Math.min(raw, 300) : 30
      return { kind: 'wait', seconds, name }
    }
    case 'error':
      return { kind: 'done', result: { status: 'error', name } }
    default:
      console.error('/api/verify returned an unknown status:', body)
      return { kind: 'done', result: { status: 'failed' } }
  }
}

async function run(sha256: string, signal: AbortSignal, onUpdate: (r: ScanResult) => void): Promise<ScanResult> {
  let failures = 0
  let name: string | undefined
  let lastWasPending = false

  for (let i = 1; i <= MAX_ATTEMPTS; i++) {
    const a = await attempt(sha256, signal)
    if (a.kind === 'done') return a.result

    lastWasPending = a.kind === 'wait'
    if (i === MAX_ATTEMPTS) break

    if (a.kind === 'wait') {
      failures = 0
      name = a.name ?? name
      onUpdate({ status: 'scanning', name, retryIn: a.seconds })
      await sleep(a.seconds * 1000, signal)
    } else {
      // Exponential backoff for temporary failures: 2, 4, 8, 16, 30, 30... seconds.
      await sleep(Math.min(2 ** ++failures, 30) * 1000, signal)
    }
  }

  // Out of attempts: keep showing "in progress" if that's the last thing the API said.
  return lastWasPending ? { status: 'scanning', name, retryIn: null } : { status: 'unavailable' }
}


/* ------------------------------------------------------------------ */
/* Entry point                                                         */
/* ------------------------------------------------------------------ */

interface InFlight {
  promise: Promise<ScanResult>
  listeners: Set<(r: ScanResult) => void>
  /** Aborts the shared loop if no caller is waiting any more. */
  stopIfUnused: () => void
}

const inFlight = new Map<string, InFlight>()

/**
 * Looks up the scan verdict for `sha256`, polling while VirusTotal is still scanning.
 * Concurrent calls for the same hash share one request loop.
 *
 * @param onUpdate Called with intermediate "scanning" states.
 * @param signal   Stops waiting (and, if nobody else is waiting, stops polling).
 */
export function checkScan(sha256: string, onUpdate: (r: ScanResult) => void, signal: AbortSignal): Promise<ScanResult> {
  sha256 = sha256.toLowerCase()

  const cached = readCache(sha256)
  if (cached) return Promise.resolve(cached)

  let entry = inFlight.get(sha256)
  if (!entry) {
    const controller = new AbortController()
    const listeners = new Set<(r: ScanResult) => void>()
    const forget = () => { if (inFlight.get(sha256) === created) inFlight.delete(sha256) }
    const promise = run(sha256, controller.signal, r => listeners.forEach(l => l(r))).finally(forget)
    promise.catch(() => {}) // rejections reach each caller below
    const created: InFlight = {
      promise,
      listeners,
      stopIfUnused: () => {
        if (listeners.size > 0) return
        forget() // so a new caller starts a fresh loop instead of joining this aborted one
        controller.abort()
      },
    }
    entry = created
    inFlight.set(sha256, entry)
  }

  const { promise, listeners, stopIfUnused } = entry
  listeners.add(onUpdate)

  return new Promise<ScanResult>((resolve, reject) => {
    const onAbort = () => {
      listeners.delete(onUpdate)
      stopIfUnused()
      reject(signal.reason)
    }
    if (signal.aborted) return onAbort()
    signal.addEventListener('abort', onAbort, { once: true })
    promise.then(
      r => { signal.removeEventListener('abort', onAbort); listeners.delete(onUpdate); resolve(r) },
      e => { signal.removeEventListener('abort', onAbort); listeners.delete(onUpdate); reject(e) },
    )
  })
}
