const order = require("../Models/Order");
const Sequelize = require("sequelize");
var transactions = [];
generateCombinations = (items, k) => {
  if (k === 1) return items.map((item) => [item]);
  var combinations = [];
  items.forEach((item, index) => {
    const smallerCombinations = generateCombinations(
      item.slice(index + 1),
      k - 1
    );
    smallerCombinations.forEach((combination) => {
      combinations.push([item, ...combination]);
    });
  });
  return combinations;
};
countSupport = (transactions, itemSets) => {
  var supportCount = {};
  itemSets.forEach((itemSet) => {
    const key = itemSet.sort().join(",");
    supportCount[key] = 0;
    transactions.forEach((transaction) => {
      if (itemSet.every((item) => transaction.includes(item)))
        supportCount[key]++;
    });
  });
  return supportCount;
};
filterItemSets = (supportCount, minSupport, totalTransactions) => {
  var frequentItems = {};
  for (var key in supportCount) {
    var support = supportCount[key] / totalTransactions;
    if (support >= minSupport) {
      frequentItems[key] = support;
    }
  }
  return frequentItems;
};
module.exports.createIteams = (_req, res, _next) => {
  var items = [];
  // var transactions = [];
  order
    .findAll({
      attributes: [
        Sequelize.fn("DISTINCT", Sequelize.col("purchase")),
        "purchase",
      ],
    })
    .then((result) => {
      result.forEach((item) => {
        items.push(item.dataValues.purchase);
      });
      const promises = items.map((i) => {
        let itom = [];
        return order
          .findAll({ attributes: ["productId"], where: { purchase: i } })
          .then((result) => {
            result.forEach((it) => {
              itom.push(it.dataValues.productId);
            });
            transactions.push(itom);
          });
      });
      Promise.all(promises)
        .then(() => {
          return(transactions);
        })
        .catch((err) => {
          console.error("Error fetching transactions:", err);
          res.status(500).send("Internal Server Error");
        });
    })
    .catch((err) => {
      console.error("Error fetching items:", err);
      res.status(500).send("Internal Server Error");
    });
};
module.exports.aprior = (req, res, next) => {
  res.json(transactions);
};
