import path from "path";
import { v4 as uuid } from "uuid";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { Request, Response, NextFunction } from "express";
import { User, File } from "@/models";
import { asyncHandler, AppError } from "@/middlewares";
import { sequelize, getS3Instance, ResponseHandler } from "@/utils";

interface AuthenticatedRequest extends Request {
  user: User;
  file?: Express.Multer.File; // Fixed: Use Express.Multer.File instead of multer.file
}

interface UploadParams {
  Bucket: string;
  Key: string;
  Body: Buffer;
  ContentType: string;
}

// Fixed return type annotation
interface S3UploadResult {
  Location?: string;
  key?: string;
  Key?: string;
  ETag?: string;
}

const upload = async (uploadParams: UploadParams): Promise<S3UploadResult> => {
  const s3 = getS3Instance();
  const fileData = new PutObjectCommand(uploadParams);
  await s3.send(fileData); // Fixed: PutObjectCommand doesn't return the expected data

  // Return the constructed result based on the upload params
  return {
    Key: uploadParams.Key,
    Location: `https://${uploadParams.Bucket}.s3.amazonaws.com/${uploadParams.Key}`,
  };
};

const uploadFile = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const bucketName = "pgbee";
    const file = (req as AuthenticatedRequest).file;

    const getFileExtension = (filename: string): string => {
      return path.extname(filename).substring(1); // Fixed: Use substring(1) instead of split(".")[1]
    };

    const user = await User.findOne({
      where: { id: (req as AuthenticatedRequest).user.id },
    });

    if (!user) {
      throw new AppError("User not found", 404, true);
    }

    if (!file) {
      throw new AppError("File not provided", 400, true);
    }

    const { originalname } = file;
    const newName = `${uuid()}.${getFileExtension(originalname)}`;
    file.originalname = newName;

    const uploadParams: UploadParams = {
      Bucket: bucketName,
      Key: newName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    let data: S3UploadResult = {};

    await sequelize.transaction(async (t) => {
      const fileData = await upload(uploadParams);

      // Fixed: Create file record with proper attributes
      const fileRecord = {
        filename: newName,
        originalName: originalname,
        mimetype: file.mimetype,
        size: file.size,
        key: fileData.Key,
        location: fileData.Location,
        userId: user.id,
      };

      const options = {
        transaction: t,
      };

      await File.create(fileRecord, options);
      data = fileData;
      // Fixed: Remove unnecessary save() call as create() already saves
    });

    ResponseHandler.success(res, "File uploaded successfully", { data }, 201);
  },
);

const getFile = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const authenticatedReq = req as AuthenticatedRequest;
    const { key } = req.params;

    if (!authenticatedReq.user) {
      throw new AppError("User not authenticated", 401, true);
    }

    const files = await File.findAll({
      where: { key },
    }); // Fixed: Renamed to 'files' for clarity

    if (!files || files.length === 0) {
      throw new AppError("File not found", 404, true);
    }

    ResponseHandler.success(res, "File fetched successfully", { files }, 200);
  },
);

const getAllFile = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    // Fixed: Properly type the request to access user
    const authenticatedReq = req as AuthenticatedRequest;

    if (!authenticatedReq.user) {
      throw new AppError("User not authenticated", 401, true);
    }

    const user = await User.findOne({
      where: { id: authenticatedReq.user.id },
    });

    if (!user) {
      throw new AppError("User not found", 403, true);
    }

    const files = await File.findAll({
      where: { userId: authenticatedReq.user.id },
    }); // Fixed: Renamed to 'files' for clarity

    if (!files || files.length === 0) {
      throw new AppError("Files not found", 404, true);
    }

    ResponseHandler.success(res, "Files fetched successfully", { files }, 200);
  },
);

export default { uploadFile, getFile, getAllFile };
