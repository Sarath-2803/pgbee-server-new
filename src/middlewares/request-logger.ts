import { Request, Response, NextFunction } from "express";
import { Logger } from "@/utils";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const start = Date.now();

  // Log request
  Logger.info(`Incoming Request: ${req.method} ${req.originalUrl}`, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    body: req.method !== "GET" ? req.body : undefined,
  });

  // Override res.json to log responses
  const originalJson = res.json;
  res.json = function <T>(body: T) {
    const duration = Date.now() - start;

    Logger.info(`Response: ${req.method} ${req.originalUrl}`, {
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      responseSize: JSON.stringify(body).length,
    });

    return originalJson.call(this, body);
  };

  next();
};
