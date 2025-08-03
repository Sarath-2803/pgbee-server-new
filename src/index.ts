import "dotenv/config";
import "tsconfig-paths/register";
import "@/config/passport";
import createApp from "@/app";
import { connect, Logger } from "@/utils";

const port = process.env.PORT || 3000;
const app = await createApp();

await connect();
// import "./utils/seed";
app.listen(port, () => {
  Logger.info(`Server is running on port ${port}`, {
    environment: process.env.NODE_ENV || "development",
  });
});
