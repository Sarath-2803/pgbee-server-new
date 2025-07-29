import hostelRouter from "./hostel-routes";
import authRouter from "./auth-routes";
import reviewRouter from "./review-routes";
import ammenitiesRouter from "./ammenities-routes";
import captchaRouter from "./captcha-routes";
export * from "./owner-routes";

export default {
  authRouter,
  hostelRouter,
  reviewRouter,
  ammenitiesRouter,
  captchaRouter,
};
