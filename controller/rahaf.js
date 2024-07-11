const rahaf = require("../Models/rahaf");
const test = require("../Models/testRahaf");
module.exports.addTest = (req, res, next) => {
    const name = req.body.name;
    test.create({ name }).then((result)=>{
        res.json(result);
    }).catch((err)=>{
        res.json(err);
    });
};
module.exports.getQuestions = (_req, res, _next) => {
  rahaf.findAll().then((result) => {
    res.setHeader("Content-Type", "application/json");
    res.json(result);
  });
};
