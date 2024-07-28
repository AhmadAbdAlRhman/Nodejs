const product = require("../Models/product");
const { Sequelize, Op } = require("sequelize");
const Store = require("../Models/Store");
const Order = require("../Models/Order");
const Customer = require("../Models/customer");
const Image_product = require("../Models/Product_image");
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
module.exports.addToCard = (req, res, _next) => {
  const userId = 5; //req.cookies.userId;
  const proId = req.body.productId;
  Order.findAll({
    where: { customerId: userId, productId: proId, paid: false },
  }) //
    .then((order) => {
      if (order.length === 0) {
        const OrderData = {
          customerId: userId,
          date: Date.now(),
          productId: proId,
          quantity: 1,
          paid: false,
        };
        Order.create(OrderData)
          .then(() => {
            res.status(201).json({ message: "Order created successfully" });
          })
          .catch((err) => {
            res
              .status(500)
              .json({ error: "Error creating order", details: err });
          });
      } else {
        const ord = order[0];
        let prod = product.findAll({ where: { id: ord.productId } });
        if (prod.count > ord.quantity) {
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
        }
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Error fetching orders", details: err });
    });
};
module.exports.changeQuantity = (req, res, _next) => {
  const orderId = req.body.orderId;
  const signal = req.body.signal;
  let order = Order.findAll({ where: { id: orderId } });
  var ord = order[0];
  let prod = product.findAll({ where: { id: ord.productId } });
  var pro = prod[0];
  if (signal === true && pro.count > ord.quantity) {
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
  const sellerId = req.cookies.sellerId;
  if (sellerId) {
    try {
      const allProduct = await product.findAll({
        where: Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("name")), {
          [Op.like]: `%${nameProduct.toLowerCase()}%`,
        }),
        where: { StoreId: sellerId },
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
  const userId = req.body.userId;
  var maxPurchase = await Order.max("purchase");
  var x = ++maxPurchase;
  Order.findAll({
    where: { [Op.and]: [{ customerId: userId }, { Paid: false }] },
  })
    .then((order) => {
      order.forEach((ord) => {
        ord.Paid = true;
        ord.purchase = x;
        ord.save();
      });
      // require("./controller/schedule");
    })
    .then(() => {
      res.status(200).json({ message: "Order Paid Successfully" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Error in payment => 82", details: err });
    });
};
module.exports.postRate = (req, res, _next) => {
  const rate = req.body.rate;
  const proId = req.body.productId;
  product.findOne({ where: { id: proId } }).then((pro) => {
    let average =
      (pro.AvgOfRating * pro.NumberOfRating + rate) / (pro.NumberOfRating + 1);
    let NumberOfRate = pro.NumberOfRating + 1;
    pro
      .update({ AvgOfRating: average, NumberOfRating: NumberOfRate })
      .then(() => {
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
    where: { customerId: userId },
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
  Order.findAll({ where: { customerId: userId, productId: productId } })
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
  const DisCount = req.body.DisCount ? req.body.DisCount : null;
  const Description = req.body.Description ? req.body.Description : null;
  const proData = {
    name: Name,
    count: Count,
    price: Price,
    size: Size,
    color: Color,
    kind: Kind,
    disCount: DisCount,
    description: Description,
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
