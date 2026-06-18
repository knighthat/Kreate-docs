import { NextResponse } from 'next/server';


export async function GET() {
    return NextResponse.json(
        {
            status: 'UP',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(), // returns uptime in seconds
        },
        {
            status: 200,
            headers: {
            'Cache-Control': 'no-store, max-age=0', // ensure load balancers don't cache the response
            },
        }
    );
}