const product = require("../Models/product");
const { Sequelize, Op } = require("sequelize");
const Store = require("../Models/Store");
const Order = require("../Models/Order");
const bank = require("../Models/bank");
const Notification = require("../Models/Notifications");
const Customer = require("../Models/customer");
const Image_product = require("../Models/Product_image");
setNote = async (OrderId) => {
  let order = await Order.findOne({ where: { id: OrderId } });
  let productId = order.productId;
  let CustomerId = order.customerId;
  let customer = await Customer.findOne({where:{id:CustomerId}});
  let produ =  await product.findOne({ where: { id: productId } });
  let StoreId = produ.StoreId;
  let producty = produ.name;
  const NoteData = {
    StoreId: StoreId,
    OrderId: OrderId,
    customer_first: customer.first_name,
    customer_second: customer.second_name,
    address: customer.address,
    phone: customer.telephone,
    product:producty,
  };
  Notification.create(NoteData);
  let products = await product.findAll();
  products.forEach(async (product) => {
    if (product.count < 5){
      let store = await Store.findOne({where : {id : product.StoreId}});
      const NoteData2 = {
        StoreId : store.id,
        ProductId : product.id,
        count : product.count
      }
      Notification.create(NoteData2);
    };
  });
};
StoreBalance = async (proId, quantity) => {
  // return new Promise((resolve, reject) => {
  let pro = await product.findOne({ where: { id: proId } });
  let proCount = pro.price;
  let strId = pro.StoreId;
  let TotalPrice = proCount * quantity;
  let store = await Store.findOne({ where: { id: strId } });
  let storeEmail = store.email;
  // let storeBalance = await StoreBalance.findAndCountAll({where : {storeEmail : store
  let account = await bank.findOne({ where: { Semail: storeEmail } });
  account.balance += TotalPrice;
  await account.save();
};
module.exports.getAllProducts = async (_req, res, _next) => {
  try {
    const products = await product.findAll({
      include: {
        model: Store,
        attributes: ["StoreName"],
      },
    });
    const productsWithImages = await Promise.all(
      products.map(async (product) => {
        const images = await Image_product.findAll({
          where: { productId: product.id },
          attributes: ["imageUrl"],
        });
        return { ...product.toJSON(), images };
      })
    );
    res.status(200).json(productsWithImages);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching products" });
  }
};
module.exports.addToCard = async (req, res, _next) => {
  const userId = 1; //req.cookies.userId;
  const proId = req.body.productId;
  try {
    let producty = await product.findOne({where: {id:proId}});
    let order = await Order.findAll({
      where: { customerId: userId, productId: proId, paid: false },
    }); //
    if (order.length === 0 && producty.count > 0) {
      const OrderData = {
        customerId: userId,
        date: Date.now(),
        productId: proId,
        quantity: 1,
        paid: false,
      };
      await Order.create(OrderData)
        .then(() => {
          res.status(201).json({ message: "Order created successfully" });
        })
        .catch((err) => {
          res.status(500).json({ error: "Error creating order", details: err });
        });
    } else {
      const ord = order[0];
      let prod = await product.findAll({ where: { id: ord.productId } });
      let pro = prod[0];
      if (pro.count > ord.quantity) {
        ord.quantity++;
        ord
          .save()
          .then(() => {
            res.status(200).json({ message: "Order updated successfully" });
          })
          .catch((err) => {
            res
              .status(500)
              .json({ error: "Error updating order", details: err });
          });
      } else {
        res.status(200).json({ error: "The count of product is not enough" });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error fetching orders", details: err });
  }
};
module.exports.changeQuantity = async (req, res, _next) => {
  const orderId = req.body.orderId;
  const signal = req.body.signal;
  let order = await Order.findAll({ where: { id: orderId } });
  var ord = order[0];
  let prod = await product.findAll({ where: { id: ord.productId } });
  var pro = prod[0];
  if (signal === true) {
    if (pro.count > ord.quantity) {
      ord.quantity++;
      ord
        .save()
        .then(() => {
          res.status(200).json("Success");
        })
        .catch((error) => {
          res
            .status(500)
            .json({ error: "Error updating order => 88", details: error });
        });
    } else {
      res.status(200).json({ error: "The count of product is not enough" });
    }
  } else {
    if (ord.quantity === 1) {
      ord
        .destroy()
        .then(() => {
          res.status(200).json("Success");
        })
        .catch((error) => {
          res
            .status(500)
            .json({ error: "Error updating order => 88", details: error });
        });
    } else {
      ord.quantity--;
      ord
        .save()
        .then(() => {
          res.status(200).json("Success");
        })
        .catch((error) => {
          res
            .status(500)
            .json({ error: "Error updating order => 88", details: error });
        });
    }
  }
};
module.exports.getSearch = async (req, res, _next) => {
  const nameProduct = req.params.nameProduct;
  const sellerId = 1;//req.cookies.sellerId;
  if (sellerId) {
    try {
      const allProduct = await product.findAll({
        where: Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("name")), {
          [Op.like]: `%${nameProduct.toLowerCase()}%`,
          StoreId: sellerId,
        }),
        // where: {},
        include: [{ model: Store, attributes: ["StoreName"] }],
      });
      if (!allProduct || allProduct.length === 0) {
        return res.send("No Products Found");
      } else {
        const productsWithImages = await Promise.all(
          allProduct.map(async (product) => {
            const images = await Image_product.findAll({
              where: { productId: product.id },
              attributes: ["imageUrl"],
            });
            return { ...product.toJSON(), images };
          })
        );
        res.status(200).json(productsWithImages);
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while fetching products" });
    }
  } else {
    try {
      const allProduct = await product.findAll({
        where: Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("name")), {
          [Op.like]: `%${nameProduct.toLowerCase()}%`,
        }),
        include: [{ model: Store, attributes: ["StoreName"] }],
      });
      if (!allProduct || allProduct.length === 0) {
        return res.send("No Products Found");
      } else {
        const productsWithImages = await Promise.all(
          allProduct.map(async (product) => {
            const images = await Image_product.findAll({
              where: { productId: product.id },
              attributes: ["imageUrl"],
            });
            return { ...product.toJSON(), images };
          })
        );
        res.status(200).json(productsWithImages);
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while fetching products" });
    }
  }
};
module.exports.postpaid = async (req, res, _next) => {
  const userId = 1; //req.cookies.userId;
  const { totalBill, privateNumber } = req.body;
  let User = await bank.findAll({ where: { token: privateNumber } });
  let user = User[0];
  if (user.balance < totalBill) {
    res.status(404).json("There is not enough money");
  } else {
    user.balance -= totalBill;
    await user
      .save()
      .then(async () => {
        var maxPurchase = await Order.max("purchase");
        var x = ++maxPurchase;
        let ordery = await Order.findAll({
          where: { [Op.and]: [{ customerId: userId }, { Paid: false }] },
        });
        ordery.forEach(async (ord) => {
          ord.Paid = true;
          ord.purchase = x;
          await ord.save().then(async () => {
            let produ = await product.findAll({ where: { id: ord.productId } });
            let pro = produ[0];
            pro.count -= ord.quantity;
            pro.save();
          });
          StoreBalance(ord.productId, ord.quantity);
          setNote(ord.id);
        });
        res.status(200).json({ message: "Payment successful" });
      })
      .catch((err) => {
        res.status(404).json("Failed");
      });
  }
};
module.exports.postRate = async (req, res, _next) => {
  const rate = req.body.rate;
  const proId = req.body.productId;
  const userId = req.cookies.userId;
  let order = await Order.findOne({where: {customerId : userId, productId: proId, paid: true}}); 
  product.findOne({ where: { id: proId } }).then((pro) => {
    let average =
      (pro.AvgOfRating * pro.NumberOfRating + rate) / (pro.NumberOfRating + 1);
    let NumberOfRate = pro.NumberOfRating + 1;
    pro
      .update({ AvgOfRating: average, NumberOfRating: NumberOfRate })
      .then(async() => {
        order.isRating = true;
        await order.save();
        res.status(200).json("Success");
      })
      .catch((err) => {
        res.status(401).json(`failed because there is ${err}`);
      });
  });
};
module.exports.getCard = (req, res, _next) => {
  const userId = req.cookies.userId;
  Order.findAll({
    where: { customerId: userId , paid : false },
    include: [{ model: product, attributes: ["name", "price"] }],
  })
    .then((order) => {
      res.json({ order });
    })
    .catch((err) => {
      res.json(err);
    });
};
module.exports.deleteProductFromCard = (req, res, _next) => {
  const userId = req.cookies.userId;
  const productId = req.body.productId;
  Order.findAll({ where: { customerId: userId, productId: productId , paid: false} })
    .then((order) => {
      const ordy = order[0];
      ordy.destroy();
      res
        .status(200)
        .json({ message: "Product deleted from cart successfully" });
    })
    .catch((err) => {
      res.status(405).json({
        message: `There is an error ${err} that not allowed us to delete the product`,
      });
    });
};
module.exports.deleteCard = (req, res, _next) => {
  const userId = req.cookies.userId;
  Order.findAll({ where: { customerId: userId } })
    .then((order) => {
      order.forEach((ordy) => {
        ordy.destroy();
      });
      res.status(200).json({ message: "Cart deleted successfully" });
    })
    .catch((err) => {
      res
        .status(405)
        .json({ message: `There is an error ${err} that not allowed` });
    });
};
module.exports.deleteProductFromStore = (req, res, _next) => {
  const productId = req.body.productId;
  product
    .destroy({ where: { id: productId } })
    .then(() => {
      res.status(200).json({ message: "Product deleted successfully" });
    })
    .catch((err) => {
      res
        .status(405)
        .json({ message: `There is an error ${err} that not allowed` });
    });
};
module.exports.updateProduct = (req, res, _next) => {
  const productId = req.body.productId;
  const Name = req.body.Name;
  const Count = req.body.Count;
  const Price = req.body.Price;
  const Size = req.body.Size ? req.body.Size : null;
  const Color = req.body.Color ? req.body.Color : null;
  const Kind = req.body.Kind ? req.body.Kind : null;
  const proData = {
    name: Name,
    count: Count,
    price: Price,
    size: Size,
    color: Color,
    kind: Kind,
  };
  product
    .update(proData, { where: { id: productId } })
    .then(() => {
      res.status(200).json({ message: "Product updated successfully" });
    })
    .catch((err) => {
      res.status(405).json({ message: `There is an error ${err} that not` });
    });
};
module.exports.getProfile = (req, res, _next) => {
  const userId = req.cookies.userId;
  Customer.findAll({ where: { id: userId } })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      res.json(`There is an err${err}`);
    });
};
module.exports.getNote = async (req, res, _next) =>{
  const sellerId = 1;//req.cookies.sellerId;
  try{
    let Noti = await Notification.findAll({where:{StoreId: sellerId}});
    res.status(200).json(Noti);
  }catch(err){
    res.status(404).json(err);
  }
}
module.exports.getHistory = async (req, res, _next) =>{
  const userId = 1; //req.cookies.userId; 
  let ProductName;
  try{
    let History = await Order.findAll({
    where:{customerId: userId , paid : true} , 
    });
    const result = await Promise.all(
      History.map(async (his) => {
        ProductName = await product.findAll({where:{id:his.productId} , attributes:["AvgOfRating","name"]}); 
        return { ...his.toJSON(), ProductName };
      })
    );
  res.status(200).json(result);
  }catch(err){
    res.status(404).json(err);
  }
}
