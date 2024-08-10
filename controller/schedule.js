const cron = require("node-cron");
const order = require("../Models/Order");
const customer = require("../Models/customer");

const sendEmail = require("./mailer");
const Secheduley = cron.schedule('0 0 * * *',async() => {
    const userId = 1; //req.cookies.userId;
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 3);
    order.findAll({where:{date:{$lte:fiveDaysAgo} , customerId : userId}})
    .then((orde)=>{
        orde.isRating = true;
        orde.save();
    })
})

module.exports = Secheduley;
/**
rs)=>{
        orders.forEach(ord => {
            customer.find({ where: { id: ord.customerId } }).then((cust)=>{
                sendEmail(cust.email, "Thank you for your purchase!",`The link to rate`);
            })
        });
    })
*/