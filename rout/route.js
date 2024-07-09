const express = require("express"),
  router = express.Router(),
  { AuthMiddleware, checkUser } = require("../middleware/Auth"),
  path = require("path"),
  control = require("../controller/Auth/login"),
  password = require("../controller/reset_password");
  const FILE_TYPE_MAM = {
    "image/png": "png",
    "image/jpeg": "jpeg",
    "image/jpg": "jpg",
    "image/svg": "svg",
    "image/apng": "apng",
    "image/jfif": "jfif",
    "image/avif": "avif",
    "image/webp": "webp",
  };
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = FILE_TYPE_MAM[file.mimetype];
    let UploadError = new Error("invalid images type");
    if (isValid) {
      UploadError = null;
    }
    cb(UploadError, "./public/images/users");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.filename + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const uploadOption = multer({
  storage: storage,
});
//Routes
router.post("/login", control.postLogin);
//register
router.post("/Register",  control.postRegister);
//post update the information profile
router.post("/updateProfile",uploadOption.single("updateImage"),control.postUpdateProfile);
//logout
router.get("/logout", control.getLogout);
//forget password
router.post("/sendToken" , password.sendToken);
//change Password
router.post("/changePassword/:token" , password.reSetPassword);
//add profile photo
router.post("/profilePhoto",uploadOption.single("profilePhoto"),control.postPhotoProfile);

module.exports = router;
