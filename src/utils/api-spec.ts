import { Request, Response } from "express";
import path from "path";
import fs from "fs";

const apiSpec = (_req: Request, res: Response) => {
  const swaggerSpec = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "src", "swagger.json"), "utf8"),
  );
  res.json(swaggerSpec);
};

export default apiSpec;
