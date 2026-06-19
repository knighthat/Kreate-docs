import { NextResponse } from 'next/server';
import type { WebhookEvent } from "@octokit/webhooks-types";


export type GitHubEventHandler<T = WebhookEvent> = (
  payload: T
) => Promise<NextResponse | Response | void> | NextResponse | Response | void;