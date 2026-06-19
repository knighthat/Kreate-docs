import { Asset } from "@octokit/webhooks-types";


export type GitHubAsset = Asset & { digest: string }