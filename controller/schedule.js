const cron = require("node-cron");
const order = require("../Models/Order");
const customer = require("../Models/customer");
const sendEmail = require("./mailer");

cron.schedule('0 0 * * *',async() => {
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
    order.findAll({where:{date:{$lte:fiveDaysAgo}}}).then((orders)=>{
        orders.forEach(ord => {
            customer.find({ where: { id: ord.customerId } }).then((cust)=>{
                sendEmail(cust.email, "Thank you for your purchase!",`The link to rate`);
            })
        });
    })

})