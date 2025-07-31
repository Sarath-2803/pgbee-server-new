import express from "express";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import cookieParser from "cookie-parser";
import {
  authRouter,
  hostelRouter,
  reviewRouter,
  ammenitiesRouter,
  ownerRouter,
  docsRouter,
  studentRouter,
  enquiryRouter,
  rentRouter,
} from "@/routes";
import {
  authorize,
  errorHandler,
  notFoundHandler,
  handleUncaughtException,
  handleUnhandledRejection,
  requestLogger,
} from "@/middlewares";
import { googleAuthController } from "@/controllers";

const createApp = async () => {
  const app = express();
  handleUncaughtException();
  handleUnhandledRejection();
  app.use(requestLogger);

  app.use(express.json());
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true }));
  app.use(session(googleAuthController.sessionConfig));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(
    cors({
      origin: [
        "https://app.pgbee.in",
        "http://localhost:3001",
        "http://localhost:3000",
      ],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  );

  const router = express.Router();

  router.use("/auth", authRouter);
  router.use("/hostel", authorize, hostelRouter);
  router.use("/review", authorize, reviewRouter);
  router.use("/ammenities", authorize, ammenitiesRouter);
  router.use("/owner", authorize, ownerRouter);
  router.use("/enquiry", authorize, enquiryRouter);
  router.use("/student", authorize, studentRouter);
  app.use("/rent", authorize, rentRouter);

  app.use(router);
  app.use("/", docsRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
};

export default createApp;
