const product = require("../Models/product");
const order = require("../Models/Order");
const { Sequelize, Op } = require("sequelize");

const generateTransction = async () =>{
    try {
    const items = [];
    const transactions = [];
    // Fetch distinct purchases
    const purchases = await order.findAll({
      attributes: [
        [Sequelize.fn("DISTINCT", Sequelize.col("purchase")), "purchase"],
      ],
      where: { Paid: { [Op.not]: false } },
    });
    for (const item of purchases) {items.push(item.dataValues.purchase);}
    const promises = items.map(async (i) => {
      const itom = [];
      const products = await order.findAll({
        attributes: ["productId"],
        where: { prchase: i},
      });
      for (const it of products) {itom.push(it.dataValues.productId);}
      transactions.push(itom);
    });
    await Promise.all(promises);
    return transactions;
}catch(error) {console.log(error);}
} 
const generateCombinations = (items, k) => {
  if (k === 1) return items.map((item) => [item]);
  const combinations = [];
  items.forEach((item, index) => {
    const smallerCombinations = generateCombinations(
      items.slice(index + 1),
      k - 1
    );
    smallerCombinations.forEach((combination) => {
      combinations.push([item, ...combination]);
    });
  });
  return combinations;
};

const countSupport = (transactions, itemSets) => {
  const supportCount = {};
  itemSets.forEach((itemSet) => {
    const key = itemSet.sort().join(",");
    supportCount[key] = 0;
    transactions.forEach((transaction) => {
      if (itemSet.every((item) => transaction.includes(item))) {
        supportCount[key]++;
      }
    });
  });
  return supportCount;
};

const filterItemSets = (supportCount, minSupport, totalTransactions) => {
  const frequentItems = {};
  for (const key in supportCount) {
    const support = supportCount[key] / totalTransactions;
    if (support >= minSupport) {
      frequentItems[key] = support;
    }
  }
  return frequentItems;
};

const generateAssociationRules = (frequentItems) => {
  const rules = [];
  Object.keys(frequentItems).map((itemset) => {
    const items = itemset.split(",").map(Number);
    if (items.length > 1) {
      items.forEach((item) => {
        const lhs = [item];
        const rhs = items.filter((i) => i !== item);
        rules.push({
          lhs: lhs,
          rhs: rhs,
          //   confidence: confidence,
        });
      });
    }
  });
  return rules;
};

const findBestRules = (rules) => {
  const bestRules = rules.reduce((acc, rule) => {
    const lhsKey = rule.lhs.sort().join(",");
    if (!acc[lhsKey] || acc[lhsKey].confidence < rule.confidence) {
      acc[lhsKey] = rule;
    }
    return acc;
  }, {});
  return Object.values(bestRules);
};

const apriori = async (minSupport) => {
  const transactions = await generateTransction();
  const allItems = Array.from(new Set(transactions.flat()));
  let allFrequentItems = [];
  let supportCount = {};
  let k = 1;
  while (true) {
    const itemSets = generateCombinations(allItems, k);
    if (itemSets.length === 0) break;
    supportCount = countSupport(transactions, itemSets);
    const frequentItems = filterItemSets(
      supportCount,
      minSupport,
      transactions.length
    );
    if (Object.keys(frequentItems).length === 0) break;
    allFrequentItems = allFrequentItems.concat(
      Object.keys(frequentItems).map((key) => key.split(",").map(Number))
    );
    k++;
  }
  const frequentItemsObj = {};
  allFrequentItems.forEach((item) => {
    const key = item.sort().join(",");
    frequentItemsObj[key] = supportCount[key];
  });
  const rules = generateAssociationRules(frequentItemsObj, transactions);
  return rules;
};

module.exports.returnApri = async (req, res, _next) => {
    try{
        const proId = req.body.productId;
        const minSupport = 0.5; // Set your minimum support threshold
        const bestRules = await apriori(minSupport);
        const resu = [];
        bestRules.forEach((item) => {
        if (item.lhs == proId && item.rhs.length >= 1 && item.rhs.length <= 3) {
          item.rhs.map((u) => {
            resu.push(u);
          });
        }
        });
        const uniqueresu = [...new Set(resu)];
        const productwithAprior = await Promise.all(
          uniqueresu.map(async (w) => {
            let products = await product.findOne({ where: { id: w } });
            return products;
          })
        );
        res.json(productwithAprior);
    }
    catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching products" });
  }
}