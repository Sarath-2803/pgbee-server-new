import multer from "multer";

const storage = multer.memoryStorage();
const fileFilter = (
  _req: multer.Request,
  file: multer.File,
  cb: multer.fileFilterCallBack,
) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

export default upload;
