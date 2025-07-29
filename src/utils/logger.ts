import fs from "fs";
import path from "path";

export class Logger {
  private static logDir = path.join(process.cwd(), "logs");

  static {
    // Ensure logs directory exists
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private static formatLog(
    level: string,
    message: string,
    meta?: Record<string, unknown>,
  ): string {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...(meta && { meta }),
    };
    return JSON.stringify(logEntry) + "\n";
  }

  private static writeToFile(filename: string, content: string): void {
    const filePath = path.join(this.logDir, filename);
    fs.appendFileSync(filePath, content);
  }

  static info(message: string, meta?: Record<string, unknown>): void {
    const logEntry = this.formatLog("INFO", message, meta);
    console.log(`ℹ️  ${message}`, meta ? meta : "");
    this.writeToFile("app.log", logEntry);
  }

  static error(message: string, error?: Error | Record<string, unknown>): void {
    const errorMeta =
      error instanceof Error
        ? { name: error.name, message: error.message, stack: error.stack }
        : error;
    const logEntry = this.formatLog("ERROR", message, errorMeta);
    console.error(`❌ ${message}`, error ? error : "");
    this.writeToFile("error.log", logEntry);
  }

  static warn(message: string, meta?: Record<string, unknown>): void {
    const logEntry = this.formatLog("WARN", message, meta);
    console.warn(`⚠️  ${message}`, meta ? meta : "");
    this.writeToFile("app.log", logEntry);
  }

  static success(message: string, meta?: Record<string, unknown>): void {
    const logEntry = this.formatLog("SUCCESS", message, meta);
    console.log(`✅ ${message}`, meta ? meta : "");
    this.writeToFile("success.log", logEntry);
  }
}
