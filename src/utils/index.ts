import sequelize, { connect } from "./sequelize";
import docs from "./docs";
import apiSpec from "./api-spec";
import { Logger } from "./logger";
import { ResponseHandler } from "./response-handler";
import getS3Instance from "./aws";
import upload from "./multer";

export {
  sequelize,
  getS3Instance,
  connect,
  docs,
  apiSpec,
  upload,
  Logger,
  ResponseHandler,
};
