import "dotenv/config";
import express from "express";
import Express from "express";
import session from "express-session";
import passport from "passport";
import "tsconfig-paths/register";
import { connect } from "@/utils";
import routes from "./routes";
import googleAuthController from "./controllers/google-auth-controller";
import "@/config/passport";

const app = express();
const port = process.env.PORT || 8080;

const ROUTE_PREFIX = "/api/v1";
connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session(googleAuthController.sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(ROUTE_PREFIX, routes.authRouter);
// Make sure routes.hostelController is an Express Router instance
app.use(ROUTE_PREFIX, routes.hostelRouter);
app.use(ROUTE_PREFIX, routes.reviewRouter);

// app.get(ROUTE_PREFIX, (_req: Express.Request, res: Express.Response) => {
//   res.json({ message: "Hello, World!" });
// });

app.get(ROUTE_PREFIX, (_req: Express.Request, res: Express.Response) => {
  res.render("loginPage", {
    title: "PGBee - Authentication",
    baseUrl: ROUTE_PREFIX,
    error: _req.query.error || null,
    success: _req.query.success || null,
    user: null, // You can pass user data here if available
  });
});

app.listen(port, () => {
  process.stdout.write(`Server is running on http://localhost:${port}`);
});
