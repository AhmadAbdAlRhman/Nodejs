const Store = require("../../Models/Store");
const product = require("../../Models/product");
const cus = require("../../Models/customer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
/*_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_*/
const createToken = (id) => {
  return jwt.sign({ id }, "secretSeller", {
    expiresIn: 3 * 24 * 60 * 60,
  });
};
/*_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_*/
module.exports.postCreateStore = (req, res, next) => {
  console.log(req.body);
  const StoreName = req.body.StoreName;
  // const fileName = req.file.filename;
  // const basePath = `${req.protocol}://${req.get("host")}/images`;
  // const StoreAge = req.body.StoreAge;
  // const StoreLocation = req.body.StoreLocation;
  const StoreKind = req.body.storeKind;
  const SellerName = req.body.sellerName;
  const SellerEmail = req.body.sellerEmail;
  const SellerPassword = req.body.password;
  const SellerPhone = req.body.sellerPhone;
  // const NOF = req.body.NumberOfFollowers;
  // const NOE = req.body.NumbersOfEmployees;
  Store.findOne({ where: { email: SellerEmail } }).then((store) => {
    if (store) {
      return res.status(400).json("This Store is already exists");
    } else {
      bcrypt.hash(SellerPassword, 10).then((hashedPassword) => {
        const StoreData = {
          StoreName: StoreName,
          // StoreLogo: `${basePath}${fileName}`,
          // StoreAge,
          // StoreLocation,
          StoreKind: StoreKind,
          SellerName: SellerName,
          email: SellerEmail,
          password: hashedPassword,
          SellerPhone: SellerPhone,
          // NumberOfFollowers: NOF,
          // NumberOfEmpty: NOE,
        };
        Store
          .create(StoreData)
          .then((store) => {
            const storeId = store.id;
            const token = createToken(storeId);
            res.json({ "result": store });
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      });
    }
  });
};

module.exports.postAddProduct = (req, res, next) => {
  const SId = req.params.storeId;
  const productName = req.body.productName;
  const productCount = req.body.productCount;
  const productPrice = req.body.productPrice;
  const photo_data = req.file.filename;
  console.log(req.body);
  product.findOne({ where: { name: productName } }).then((pro) => {
    if (pro) {
      res.status(400).json("This product  already exists");
    } else {
      const productsData = {
        name: productName,
        count: productCount,
        price: productPrice,
        photo_data: `${photo_data}`,
        StoreId: SId,
      };
      product
        .create(productsData)
        .then((result) => {
          const token = createToken(SId);
          res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 3 * 24 * 60 * 60 * 1000,
          });
          res
            .status(200)
            .json(`This product is saved in the store that id ${SId}`);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
};

module.exports.getStore = (req, res, next) => {
  const sid = req.params.id;
  product.findAll({ where: { StoreId: sid } }).then((producty) => {
    Store.findOne({ where: { id: sid } }).then((store) => {
      let storeName = store.StoreName;
      res.json({ pro: producty, storeName });
    });
  });
};

module.exports.getStores = (req, res, next) => {
  // const sid = req.cookies.storeId;
  Store.findAll().then((store) => {
    res.json({ stores: store });
  });
};


