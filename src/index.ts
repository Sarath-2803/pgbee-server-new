import "dotenv/config";
import express from "express";
import session from "express-session";
import passport from "passport";
import "tsconfig-paths/register";
import { connect, Logger } from "@/utils";
import {
  authRouter,
  hostelRouter,
  reviewRouter,
  ammenitiesRouter,
  ownerRouter,
  docsRouter,
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
import "@/config/passport";

handleUncaughtException();
handleUnhandledRejection();

const app = express();
const port = process.env.PORT || 3000;

app.use(requestLogger);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session(googleAuthController.sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
const router = express.Router();

router.use("/auth", authRouter);
router.use("/hostel", authorize, hostelRouter);
router.use("/review", authorize, reviewRouter);
router.use("/ammenities", authorize, ammenitiesRouter);
router.use("/owner", authorize, ownerRouter);

const ROUTE_PREFIX = "/api/v1";
app.use(ROUTE_PREFIX, router);
app.use("/", docsRouter);
app.use(notFoundHandler);
app.use(errorHandler);
connect();

app.listen(port, () => {
  Logger.info(`Server is running on port ${port}`, {
    port,
    environment: process.env.NODE_ENV || "development",
  });
});
