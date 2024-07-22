const Store = require("../../Models/Store");
const product = require("../../Models/product");
const cus = require("../../Models/customer");
const images = require("../../Models/Product_image");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
/*_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_*/
const createToken = (id) => {
  return jwt.sign({ id }, "secretSeller", {
    expiresIn: 3 * 24 * 60 * 60,
  });
};
/*_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_*/
module.exports.postCreateStore = (req, res, _next) => {
  console.log(req.body);
  const StoreName = req.body.StoreName;
  const StoreKind = req.body.storeKind;
  const SellerName = req.body.sellerName;
  const SellerEmail = req.body.sellerEmail;
  const SellerPassword = req.body.password;
  const SellerPhone = req.body.sellerPhone;
  Store.findOne({ where: { email: SellerEmail } }).then((store) => {
    if (store) {
      return res.status(400).json("This Store is already exists");
    } else {
      bcrypt.hash(SellerPassword, 10).then((hashedPassword) => {
        const StoreData = {
          StoreName: StoreName,
          StoreKind: StoreKind,
          SellerName: SellerName,
          email: SellerEmail,
          password: hashedPassword,
          SellerPhone: SellerPhone,
        };
        Store
          .create(StoreData)
          .then((store) => {
            const storeId = store.id;
            const token = createToken(storeId);
            res.json({ "result": store , token });
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      });
    }
  });
};

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
  try{
    console.log(productsData);
  await product.create(productsData).then(async (newPro)=>{
    const optionImages = req.files["OptionImage"] || [];
    const imagePromises = optionImages.map(file => {
      const photoData = {
        imageUrl: file.filename,
        productId:newPro.id
      };
      images.create(photoData)
    });
    await Promise.all(imagePromises);
  }).then(()=>{
    res.status(200).json("The Product is added");
  })
}
  catch(err){
    res.status(405).json(`There is an err ${err} that mot allowed`);
  };
};

module.exports.getStore = (req, res, _next) => {
  const sid = req.params.id;
  product.findAll({ where: { StoreId: sid } }).then((producty) => {
    Store.findOne({ where: { id: sid } }).then((store) => {
      let storeName = store.StoreName;
      res.json({ pro: producty, storeName });
    });
  });
};

module.exports.getStores = (_req, res, _next) => {
  // const sid = req.cookies.storeId;
  Store.findAll().then((store) => {
    res.json({ stores: store });
  });
};


