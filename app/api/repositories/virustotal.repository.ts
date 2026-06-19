// repositories/user.repository.ts
import { VirusTotalReport } from "@/generated/client";
import prisma from "@/lib/prisma";
import { Bytes } from "@prisma/client/runtime/client";


export class VirusTotalRepository {

  private readonly table = prisma.virusTotalReport

  async findByHash(hash: string) {
    return this.table.findUnique({
      where: { sha256: hash }
    })
  }

  async insert(report: VirusTotalReport) {
    return this.table.create({ data: report });
  }

  async updateReport(hash: string, report: Bytes) {
    return this.table.update({
      where: { sha256: hash },
      data: { report: report }
    });
  }
}
