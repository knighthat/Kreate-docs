import { NextResponse } from 'next/server';
import { verify } from '@octokit/webhooks-methods';
import { EventEmitter } from 'stream';


export async function POST(request: Request) {
  const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    console.error('Missing GITHUB_WEBHOOK_SECRET environment variable.');
    return NextResponse.json({ error: 'Webhook misconfigured' }, { status: 500 });
  }

  try {
    const signature = request.headers.get('x-hub-signature-256');
    const eventType = request.headers.get('x-github-event');
    if (!signature || !eventType) {
      return NextResponse.json({ error: 'Missing headers' }, { status: 400 });
    } else if (eventType == 'types') {
      return NextResponse.json({ error: 'Invalid headers' }, { status: 412 });
    }

    const rawBody = await request.text();
    if (await verify(WEBHOOK_SECRET, rawBody, signature)) {
      console.log(`Received verified GitHub event: ${eventType}`);
    } else {
      return NextResponse.json({}, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    // To prevent this file from being clustered by the implementations
    // each event is organized into a single file
    const eventModule = await import(`./_events/${eventType}`);
    const handler = eventModule.default;

    if (typeof handler === 'function') {
      const result = await handler(payload);

      // If the handler returned a structured Response, 
      // deliver it back to GitHub
      if (result instanceof Response) {
        return result;
      }
    } else {
      return NextResponse.json({}, { status: 501 });
    }

    return NextResponse.json({}, { status: 200 });
  } catch (error: any) {
    console.error('Webhook processing error:', error);

    if (error?.code == 'MODULE_NOT_FOUND') {
      return NextResponse.json({}, { status: 404 });
    } else {
      return NextResponse.json({ error: 'Unknown error.' }, { status: 500 });
    }
  }
}