import pino from "pino";

const isEdgeRuntime = process.env.NEXT_RUNTIME === "edge";

const logger = isEdgeRuntime
  ? {
      info: console.log,
      warn: console.warn,
      error: console.error,
      debug: console.debug,
    }
  : pino({
      level: process.env.NODE_ENV === "production" ? "info" : "debug",

      transport:
        process.env.NODE_ENV !== "production"
          ? {
              target: "pino-pretty",
              options: {
                colorize: true,
                translateTime: "SYS:standard",
                ignore: "pid,hostname",
              },
            }
          : undefined,

      base: {
        env: process.env.NODE_ENV,
        app: "next-app",
      },
    });

export default logger;