const cron = require("node-cron");
const Order = require("../Models/Order");
const customer = require("../Models/customer");

const sendEmail = require("./mailer");
const Secheduley = (userId) => {
  let delay = 1000 * 15;
  // 1000 * 60 * 60 * 60 * 24 * 5;
  setTimeout(async () => {
    let order = await Order.findAll({
      where: { customerId: userId, paid: true },
    });
    console.log("Ahmad");
    order.map((ord) => {
      ord.isRating = true;
      ord.save();
    });
  }, delay);
};
module.exports = Secheduley;
/**
 // const Secheduley = cron.schedule('0 0 * * *',async() => {
 //     const userId = req.cookies.userId;
 //     const fiveDaysAgo = new Date();
 //     fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 3);
 //     order.findAll({where:{date:{$lte:fiveDaysAgo} , customerId : userId}})
 //     .then((orde)=>{
 //         orde.isRating = true;
 //         orde.save();
 //     })
 // })
 rs)=>{
        orders.forEach(ord => {
            customer.find({ where: { id: ord.customerId } }).then((cust)=>{
                sendEmail(cust.email, "Thank you for your purchase!",`The link to rate`);
            })
        });
    })
*/