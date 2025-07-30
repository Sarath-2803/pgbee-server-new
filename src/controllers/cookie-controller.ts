import { Request, Response } from "express";
import fetch from "node-fetch";

const cookieController = async (req: Request, res: Response) => {
  try {
    if (
      req.body["g-recaptcha-response"] === undefined ||
      req.body["g-recaptcha-response"] === "" ||
      req.body["g-recaptcha-response"] === null
    ) {
      return res.json({
        responseCode: 1,
        responseDesc: "Validate captcha first",
      });
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const verificationUrl =
      "https://www.google.com/recaptcha/api/siteverify?secret=" +
      secretKey +
      "&response=" +
      req.body["g-recaptcha-response"] +
      "&remoteip=" +
      (req.ip || "unknown");

    interface CaptchaVerificationResponse {
      success: boolean;
      challenge_ts?: string;
      hostname?: string;
      "error-codes"?: string[];
    }

    const response = await fetch(verificationUrl, { method: "POST" });
    const bodyObj: CaptchaVerificationResponse =
      (await response.json()) as CaptchaVerificationResponse;
    if (bodyObj.success !== undefined && !bodyObj.success) {
      return res.json({
        responseCode: 1,
        responseDesc: "Failed captcha verification",
      });
    }
    return res.json({
      responseCode: 0,
      responseDesc: "Captcha verification successful",
    });
  } catch (error: unknown) {
    console.error("Captcha verification error:", error);
    return res
      .status(500)
      .json({ responseCode: 2, responseDesc: "Internal server error" });
  }
};
export default cookieController;
