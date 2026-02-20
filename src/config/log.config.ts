import winston, { createLogger, format, transports } from "winston";
const { timestamp, json, printf, errors } = winston.format;

// Custom log format
const systemLogFormat = printf(({ timestamp, level, message }: any) => {
  return `${timestamp} ${level} ${message ? `"${message}"` : "NA"}`;
});

const activityLogFormat = printf(
  ({
    timestamp,
    level,
    message,
    user_id,
    http_method,
    endpoint,
    stack,
  }: any) => {
    return `${timestamp} ${level} ${user_id || "NA"} ${http_method || "NA"} ${
      endpoint || "NA"
    } ${message ? `"${message}"` : "NA"} ${stack ? `"${stack}"` : "NA"}`;
  },
);
/***
 *
 *
 */
const systemLogger = createLogger({
  level: "info",
  format: format.combine(timestamp(), errors({ stack: true }), systemLogFormat),
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), systemLogFormat),
    }),
    new transports.File({ filename: "./log/system.log" }),
  ],
});

const activityLogger = createLogger({
  level: "info",
  format: format.combine(
    timestamp(),
    errors({ stack: true }),
    activityLogFormat,
  ),
  transports: [new transports.File({ filename: "./log/activity.log" })],
});

export { systemLogger, activityLogger };
