const Store = require("../../Models/Store");
const product = require("../../Models/product");
const cus = require("../../Models/customer");
const images = require("../../Models/Product_image");
const bank = require("../../Models/bank");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
/*_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_*/
const createToken = (id) => {
  return jwt.sign({ id }, "secretSeller", {
    expiresIn: 3 * 24 * 60 * 60,
  });
};
/*_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_*/
module.exports.postCreateStore = async (req, res, _next) => {
  let { StoreName, storeKind, sellerName, sellerEmail, password, sellerPhone } =
    req.body;
  let story = await Store.findOne({ where: { email: sellerEmail } });
  if (story) return res.status(400).json("This Store is already exists");
  story = await cus.findOne({ where: { email: sellerEmail } });
  if (story) return res.status(400).json("This email is not valid");
  const hashedPassword = await bcrypt.hash(password, 10);
  const StoreData = {
    StoreName: StoreName,
    StoreKind: storeKind,
    SellerName: sellerName,
    email: sellerEmail,
    password: hashedPassword,
    SellerPhone: sellerPhone,
  };
  await Store.create(StoreData)
    .then(async (store) => {
      const bankData = {
        Semail: store.email,
        balance: 1000000,
        token: Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000,
      };
      await bank.create(bankData).then((bankInfo) => {
        const token = createToken(store.id);
        res.cookie("token", token, { httpOnly: true });
        res.cookie("storeId", store.id, { httpOnly: true });
        res.status(200).json({ result: store, token, bankInfo });
      });
    })
    .catch((err) => {
      res.status(404).json(err);
    });
};
/*_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_*/
module.exports.postAddProduct = async (req, res, _next) => {
  const SId = req.params.storeId;
  const productName = req.body.productName;
  const productCount = req.body.productCount;
  const productPrice = req.body.productPrice;
  const photo_data = req.files["image"][0].filename;
  const productsData = {
    name: productName,
    count: productCount,
    price: productPrice,
    photo_data: `${photo_data}`,
    StoreId: SId,
  };
  try {
    console.log(productsData);
    await product
      .create(productsData)
      .then(async (newPro) => {
        const optionImages = req.files["OptionImage"] || [];
        const imagePromises = optionImages.map((file) => {
          const photoData = {
            imageUrl: file.filename,
            productId: newPro.id,
          };
          images.create(photoData);
        });
        await Promise.all(imagePromises);
      })
      .then(() => {
        res.status(200).json("The Product is added");
      });
  } catch (err) {
    res.status(405).json(`There is an err ${err} that mot allowed`);
  }
};
/*_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_*/
module.exports.getStore = (req, res, _next) => {
  const sid = req.params.id;
  product.findAll({ where: { StoreId: sid } }).then(async (pro) => {
    const producty = await Promise.all(
      pro.map(async (product) => {
        const imageos = await images.findAll({
          where: { productId: product.id },
          attributes: ["imageUrl"],
        });
        return { ...product.toJSON(), images: imageos };
      })
    );
    Store.findOne({ where: { id: sid } }).then((store) => {
      let storeName = store.StoreName;
      res.json({ pro: producty, storeName });
    });
  });
};
/*_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_*/
module.exports.getStores = (_req, res, _next) => {
  // const sid = req.cookies.storeId;
  Store.findAll().then((store) => {
    res.json({ stores: store });
  });
};
