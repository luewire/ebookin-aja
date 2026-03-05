import { runtimeConfig, type LogLevel } from '@/lib/runtime-config';

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const configuredLevel = (runtimeConfig.logLevel.toLowerCase() as LogLevel);
const currentLevel: LogLevel = LEVEL_PRIORITY[configuredLevel] !== undefined ? configuredLevel : 'warn';

function canLog(level: LogLevel) {
  return LEVEL_PRIORITY[level] <= LEVEL_PRIORITY[currentLevel];
}

export const logger = {
  error: (...args: unknown[]) => {
    if (canLog('error')) console.error(...args);
  },
  warn: (...args: unknown[]) => {
    if (canLog('warn')) console.warn(...args);
  },
  info: (...args: unknown[]) => {
    if (canLog('info')) console.info(...args);
  },
  debug: (...args: unknown[]) => {
    if (runtimeConfig.debug && canLog('debug')) console.debug(...args);
  },
};
