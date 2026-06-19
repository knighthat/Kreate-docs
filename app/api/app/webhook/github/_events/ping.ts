import { NextResponse } from 'next/server';

import { GitHubEventHandler } from './types';
import { PingEvent } from '@octokit/webhooks-types';


const handlePing: GitHubEventHandler<PingEvent> = () => {
  return NextResponse.json({ message: "Pong!" }, { status: 200 })
};

export default handlePing;