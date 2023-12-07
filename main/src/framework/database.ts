import { Prisma, PrismaClient } from "@prisma/client";

const orm = new PrismaClient();
export const serializeSql = (sql: string) => Prisma.sql`${sql}`;
export default orm;
