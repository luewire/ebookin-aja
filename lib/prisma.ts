import { PrismaClient } from '@prisma/client';
import { runtimeConfig } from '@/lib/runtime-config';

const prismaLogLevels = (() => {
  const level = runtimeConfig.logLevel.toLowerCase();

  if (runtimeConfig.debug || level === 'debug') {
    return ['query', 'info', 'warn', 'error'] as const;
  }

  if (level === 'info') {
    return ['info', 'warn', 'error'] as const;
  }

  if (level === 'warn') {
    return ['warn', 'error'] as const;
  }

  return ['error'] as const;
})();

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: prismaLogLevels,
  });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
