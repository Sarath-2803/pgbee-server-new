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
import path from "path";
import fs from "fs";

const app = express();
const port = process.env.PORT || 3000;

const ROUTE_PREFIX = "/api/v1";
connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session(googleAuthController.sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(ROUTE_PREFIX + "/auth", routes.authRouter);
app.use(ROUTE_PREFIX + "/hostel", routes.hostelRouter);
app.use(ROUTE_PREFIX + "/review", routes.reviewRouter);
app.use(ROUTE_PREFIX + "/ammenities", routes.ammenitiesRouter);

// RapiDoc API Documentation route
app.get("/docs", (req: Express.Request, res: Express.Response) => {
  // const swaggerSpec = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src", "swagger.json"), "utf8"));

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>PGBee API Documentation</title>
      <script type="module" src="https://unpkg.com/rapidoc/dist/rapidoc-min.js"></script>
    </head>
    <body>
      <rapi-doc 
        spec-url="/api-spec" 
        theme="dark"
        bg-color="#1e1e1e"
        text-color="#ffffff"
        primary-color="#4CAF50"
        nav-bg-color="#2d2d2d"
        nav-text-color="#ffffff"
        nav-hover-bg-color="#404040"
        nav-hover-text-color="#ffffff"
        render-style="read"
        schema-style="table"
        default-schema-tab="schema"
        show-header="true"
        allow-authentication="true"
        allow-try="true"
        allow-server-selection="true"
        show-info="true"
        info-description-headings-in-navbar="true"
        use-path-in-nav-bar="true"
      >
      </rapi-doc>
    </body>
    </html>
  `;

  res.send(html);
});

// Serve swagger spec
app.get("/api-spec", (req: Express.Request, res: Express.Response) => {
  const swaggerSpec = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "src", "swagger.json"), "utf8"),
  );
  res.json(swaggerSpec);
});

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
