import { ReleaseEvent, ReleasePublishedEvent } from '@octokit/webhooks-types';
import { NextResponse } from 'next/server';

import { GitHubEventHandler } from './types';
import { GitHubAsset } from '@/lib/types';
import service from '@services/virustotal.service';


const VIRUSTOTAL_API_ENDPOINT = 'https://www.virustotal.com/api/v3/files';

const handleRelease: GitHubEventHandler<ReleaseEvent> = async (event) => {
  const VT_API_KEY = process.env.VIRUSTOTAL_API_KEY;
  if (!VT_API_KEY) {
    console.error('Missing VIRUSTOTAL_API_KEY environment variable.');
    return NextResponse.json({ error: 'Webhook misconfigured' }, { status: 500 });
  }

  if (event.action !== 'published') {
    return NextResponse.json({}, { status: 202 });
  }
  const payload = event as ReleasePublishedEvent

  const assets = payload.release.assets;
  if (!assets || assets.length === 0) return;

  console.log(`Processing ${assets.length} assets...`);

  for (const a of assets) {
    const asset = a as GitHubAsset
    const downloadUrl = asset.browser_download_url;
    const fileName = asset.name;

    try {
      console.log(`Downloading: ${fileName}...`);
      const fileResponse = await fetch(downloadUrl);
      if (!fileResponse.ok) throw new Error(`Download failed`);
      const fileBlob = await fileResponse.blob();

      console.log(`Uploading to VirusTotal: ${fileName}...`);
      
      const formData = new FormData();
      formData.append('file', fileBlob, fileName);
      const vtResponse = await fetch(VIRUSTOTAL_API_ENDPOINT, {
        method: 'POST',
        headers: { 'x-apikey': VT_API_KEY },
        body: formData,
      });

      if (!vtResponse.ok) {
        console.error(`VirusTotal rejected ${fileName} with status: ${vtResponse.status}`);
        continue;
      }

      const vtData = await vtResponse.json();
      console.log(`Queued ${fileName}. Analysis ID: ${vtData.data.id}`);
      service.create(payload.release.tag_name, asset);

    } catch (error) {
      console.error(`Failed to process asset "${fileName}":`, error);
    }
  }
};

export default handleRelease;