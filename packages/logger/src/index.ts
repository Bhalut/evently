import pino from "pino";

export interface LoggerOptions {
  service: string;
  level?: string;
}

export type { Logger } from "pino";

export const createLogger = (options: LoggerOptions) => {
  const isDev = process.env.NODE_ENV !== "production";
  return pino({
    level: options.level || "info",
    base: { service: options.service },
    transport: isDev
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
          },
        }
      : undefined,
    redact: ["req.headers.authorization", "password", "token"],
  });
};

/**
 * NestJS LoggerService compatible wrapper for pino logger.
 */
export class NestLogger {
  private logger;

  constructor(logger: pino.Logger) {
    this.logger = logger;
  }

  log(message: any, ...optionalParams: any[]) {
    this.logger.info(message, ...optionalParams);
  }

  error(message: any, ...optionalParams: any[]) {
    this.logger.error(message, ...optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    this.logger.warn(message, ...optionalParams);
  }

  debug?(message: any, ...optionalParams: any[]) {
    this.logger.debug(message, ...optionalParams);
  }

  verbose?(message: any, ...optionalParams: any[]) {
    this.logger.trace(message, ...optionalParams);
  }
}
