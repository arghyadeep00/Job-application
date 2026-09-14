import multer from "multer";

const storage = multer.memoryStorage();

const resumeFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF file allowed"), false);
  }
};

const uploadResume = multer({
  storage,
  resumeFilter,
  limits: {
    fileSize: 3 * 1024 * 1024,
  },
});

export default uploadResume;
