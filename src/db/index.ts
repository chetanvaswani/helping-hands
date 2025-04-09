import { PrismaClient } from '@prisma/client';
// import { withOptimize } from "@prisma/extension-optimize";

const prismaClientSingleton = () => {
  // return new PrismaClient().$extends(
  //   withOptimize({ apiKey: process.env.PRISMA_OPTIMIZE_API_KEY || "" })
  // )
  return new PrismaClient()
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

// eslint-disable-next-line
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;