import { GitHubAsset } from "@/lib/types";
import { VirusTotalRepository } from "@repositories/virustotal.repository";


class VirusTotalService {

  constructor(
    private readonly repository = new VirusTotalRepository()
  ) {}

  async create(tagName: string, asset: GitHubAsset) {
    const digest = asset.digest.split(':')[1]
    const record = await this.repository.findByHash(digest)
    if (record) return

    await this.repository.insert({
      sha256: digest,
      filename: asset.name,
      version: tagName,
      report: null,
      last_modified: new Date()
    })
  }
}

const service = new VirusTotalService();
export default service;