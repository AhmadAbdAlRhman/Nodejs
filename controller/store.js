const product = require("../Models/product");
const Store = require("../Models/Store");
const Order = require("../Models/Order");
module.exports.getAllProducts = (req, res, next) => {
  product
    .findAll({
      include: [{ model: Store, attributes: ["StoreName"] }],
    })
    .then((prod) => {
      res.json({ prod });
    })
    .catch((err) => {
      res.json({ result: err });
    });
};

module.exports.addToCard = (req, res, next) => {
  const userId = 3; //req.cookies.userId
  const proId = req.body.productId;
  Order.findAll({
    where: { customerId: userId, productId: proId, paid: false },
  })
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
    })
    .catch((err) => {
      res.status(500).json({ error: "Error fetching orders", details: err });
    });
};

module.exports.changeQuantity = (req, res, next) => {
  const orderId = req.body.orderId;
  const signal = req.body.signal;
  Order.findAll({ where: { id: orderId } })
    .then((order) => {
      var ord = order[0];
      if (signal === true) {
        ord.quantity++;
        ord.save();
      } else {
        if (ord.quantity === 1) {
          ord.destroy();
        } else {
          ord.quantity--;
          ord.save();
        }
      }
    })
    .then(() => {
      res.status(200).json({ message: "Order updated successfully" });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: "Error updating order => 67", details: err });
    });
};
module.exports.getSearch = (req, res, next) => {
  const nameProduct = req.body.nameProduct;
  product
    .findAll({
      where: { name: nameProduct },
      include: [{ model: Store, attributes: ["StoreName"] }],
    })
    .then((allProduct) => {
      if (!allProduct || allProduct.length === 0) {
        return res.send("No Products Found");
      } else {
        return res.status(200).json({ allProduct });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
module.exports.postpaid =(req, res ,next) =>{
  const orderId = req.body.orde;
  Order.findAll({where:{id : orderId}}).then((order)=>{
    var ord = order[0];
    ord.Paid = true;
    ord.save();    
  }).then(()=>{
    res.status(200).json({message:"Order Paid Successfully" });
  }).catch((err)=>{
    res.status(500).json({error:"Error in payment => 82",details:err});
  });
}
module.exports.postRate = (req, res, next) => {
  const rate = req.body.rate;
  product.findOne({ where: { id: 1 } }).then((pro) => {
    let avgy = (pro.avg * pro.NOR + rate) / (pro.NOR + 1);
    let numy = pro.NOR + 1;
    pro.update({ avg: avgy, NOR: numy });
  });
};
