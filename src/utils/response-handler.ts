import { Response } from "express";
import { SuccessResponse, ErrorResponse } from "@/types";
import { Logger } from "@/utils";

export class ResponseHandler {
  static success(
    res: Response,
    message: string,
    data: SuccessResponse["data"] = {},
    statusCode: number = 200,
  ): Response<SuccessResponse> {
    const response: SuccessResponse = {
      ok: true,
      message,
      data,
    };

    Logger.success(`Success Response: ${message}`, {
      statusCode,
      data,
      ip: res.req.ip,
      method: res.req.method,
      url: res.req.originalUrl,
    });

    return res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    message: string,
    statusCode: number = 500,
    error?: Error | Record<string, unknown>,
  ): Response<ErrorResponse> {
    const response: ErrorResponse = {
      ok: false,
      message,
      data: null,
    };

    Logger.error(`Error Response: ${message}`, {
      statusCode,
      error: error?.stack || error,
      ip: res.req.ip,
      method: res.req.method,
      url: res.req.originalUrl,
    });

    return res.status(statusCode).json(response);
  }
}
