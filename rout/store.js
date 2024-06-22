const express = require("express");
const path = require("path");
const AuthStore = require("../controller/Auth/store");
const store = require("../controller/store");
const router = express.Router();
const FILE_TYPE_MAM = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "image/svg": "svg",
  "image/apng": "apng",
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
    cb(UploadError, "./public/images/products");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.filename + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const uploadOption = multer({ storage: storage });
//API for Store
router.post("/create-store", AuthStore.postCreateStore);
router.post("/AddProduct/:storeId",
  uploadOption.single("image"),
  AuthStore.postAddProduct
);

router.get("/stores", AuthStore.getStores);
router.get("/store/:id", AuthStore.getStore);

router.post("/order", store.addToCard);
router.post("/changeQuantity", store.changeQuantity);
router.get("/searchProduct", store.getSearch);

router.post("/paid",store.postpaid);
router.post("/rate", store.postRate);

router.get("/AllProduct", store.getAllProducts);
module.exports = router;
