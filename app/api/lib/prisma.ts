import { PrismaClient } from '@db/client';
import { PrismaPg } from "@prisma/adapter-pg";


const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const database = new PrismaClient({ adapter });

export default database;

