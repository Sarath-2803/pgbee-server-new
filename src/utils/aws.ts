import { S3Client } from "@aws-sdk/client-s3";
let s3Instance: S3Client | null = null;
export const getS3Instance = () => {
  if (!s3Instance) {
    // Validate environment variables
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      throw new Error(
        "AWS credentials are missing. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables.",
      );
    }

    s3Instance = new S3Client({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      region: process.env.AWS_REGION || "us-east-1",
    });
  }
  return s3Instance;
};

export default getS3Instance;
