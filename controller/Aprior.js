const order = require("../Models/Order");
const { Sequelize, Op } = require("sequelize");
var transactions = [];
generateCombinations = (items, k) => {
  if (k === 1) return items.map((item) => [item]);
  var combinations = [];
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
const generateAssociationRules = (frequentItems, transactions) => {
  const rules = [];

  Object.keys(frequentItems).forEach((itemset) => {
    const items = itemset.split(",");
    if (items.length > 1) {
      items.forEach((item) => {
        const lhs = [item];
        const rhs = items.filter((i) => i !== item);
        const lhsKey = lhs.sort().join(",");
        const rhsKey = rhs.sort().join(",");
        const lhsSupport = frequentItems[lhsKey] * transactions.length;
        const rhsSupport = frequentItems[itemset] * transactions.length;
        const confidence = rhsSupport / lhsSupport;

        rules.push({
          lhs: lhs,
          rhs: rhs,
          confidence: confidence,
        });
      });
    }
  });

  return rules;
};
const findBestRules = (rules) => {
  const bestRules = rules.reduce((acc, rule) => {
    if (!acc[rule.lhs] || acc[rule.lhs].confidence < rule.confidence) {
      acc[rule.lhs] = rule;
    }
    return acc;
  }, {});

  return Object.values(bestRules);
};
const generateSubsets = (set) => {
  const subsets = [];
  const totalSubsets = 1 << set.length;

  for (let i = 1; i < totalSubsets - 1; i++) {
    const subset = [];
    for (let j = 0; j < set.length; j++) {
      if (i & (1 << j)) {
        subset.push(set[j]);
      }
    }
    subsets.push(subset);
  }

  return subsets;
};
const calculateConfidence = (transactions, itemSet, supportCount) => {
  const subsets = generateSubsets(itemSet);
  const rules = [];

  subsets.forEach((subset) => {
    const remaining = itemSet.filter((item) => !subset.includes(item));
    if (remaining.length > 0) {
      const subsetKey = subset.sort().join(",");
      const itemSetKey = itemSet.sort().join(",");

      const confidence = supportCount[itemSetKey] / supportCount[subsetKey];

      rules.push({
        rule: `${subset.join(",")} => ${remaining.join(",")}`,
        confidence: confidence,
      });
    }
  });

  return rules;
};
module.exports.ApriorImplements = async (_req, res, _next) => {
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
    for (const item of purchases) {
      items.push(item.dataValues.purchase);
    }
    const promises = items.map(async (i) => {
      const itom = [];
      const products = await order.findAll({
        attributes: ["productId"],
        where: { purchase: i},
      });
      for (const it of products) {
        itom.push(it.dataValues.productId);
      }
      transactions.push(itom);
    });
    await Promise.all(promises);
    res.json(transactions);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
};
// module.exports.ApriorImplements = async (_req, res, _next) => {
//   try {
//     const items = [];
//     const transactions = [];

//     // Fetch distinct purchases
//     const purchases = await order.findAll({
//       attributes: [
//         [Sequelize.fn("DISTINCT", Sequelize.col("purchase")), "purchase"],
//       ],
//     });

//     for (const item of purchases) {
//       items.push(item.dataValues.purchase);
//     }

//     // Fetch product IDs for each purchase
//     const promises = items.map(async (i) => {
//       const itom = [];
//       const products = await order.findAll({
//         attributes: ["productId"],
//         where: { purchase: i },
//       });
//       for (const it of products) {
//         itom.push(it.dataValues.productId);
//       }
//       transactions.push(itom);
//     });

//     await Promise.all(promises);

//     const minSupport = 0.5;
//     const minConfidence = 0.8; // Set your desired minimum confidence level
//     let allFrequentItems = [];
//     let k = 1;
//     const supportCount = {};

//     // Generate frequent itemsets using Apriori algorithm
//     while (true) {
//       const itemSets = generateCombinations(Array.from(new Set(transactions.flat())), k);
//       if (itemSets.length === 0) break;

//       const currentSupportCount = countSupport(transactions, itemSets);
//       Object.assign(supportCount, currentSupportCount);
//       const frequentItems = filterItemSets(
//         currentSupportCount,
//         minSupport,
//         1
//         // transactions.length
//       );

//       if (Object.keys(frequentItems).length === 0) break;
//       allFrequentItems = allFrequentItems.concat(frequentItems);
//       k++;
//     }

//     // Generate association rules
//     const allRules = [];

//     Object.keys(supportCount).forEach((key) => {
//       const itemSet = key.split(",").map((item) => parseInt(item, 10));
//       if (itemSet.length > 1) {
//         const rules = calculateConfidence(transactions, itemSet, supportCount);
//         allRules.push(
//           ...rules.filter((rule) => rule.confidence >= minConfidence)
//         );
//       }
//     });

//     res.json({
//       frequentItemsets: allFrequentItems,
//       rules: allRules
//     });
//   } catch (err) {
//     console.error("Error:", err);
//     res.status(500).send("Internal Server Error");
//   }
// };

//   var items = [];
//   order
//     .findAll({
//       attributes: [
//         Sequelize.fn("DISTINCT", Sequelize.col("purchase")),
//         "purchase",
//       ],
//     })
//     .then((result) => {
//       result.forEach((item) => {
//         items.push(item.dataValues.purchase);
//       });
//       const promises = items.map((i) => {
//         let itom = [];
//         return order
//           .findAll({ attributes: ["productId"], where: { purchase: i } })
//           .then((result) => {
//             result.forEach((it) => {
//               itom.push(it.dataValues.productId);
//             });
//             transactions.push(itom);
//           });
//       });
//       Promise.all(promises)
//         .then(() => {
//           // res.status(200).json(transactions);
//           const minSupport = 0.5;
//           const minConfidence = 0.7; // Set your desired minimum confidence level
//           let allFrequentItems = [];
//           let k = 1;

//           const supportCount = {};

//           // Generate frequent itemsets using Apriori algorithm
//           while (true) {
//             const itemSets = generateCombinations(
//               Array.from(new Set(transactions.flat())),
//               k
//             );
//             if (itemSets.length === 0) break;

//             const currentSupportCount = countSupport(transactions, itemSets);
//             Object.assign(supportCount, currentSupportCount);
//             const frequentItems = filterItemSets(
//               currentSupportCount,
//               minSupport,
//               transactions.length
//             );

//             if (Object.keys(frequentItems).length === 0) break;
//             allFrequentItems = allFrequentItems.concat(frequentItems);
//             k++;
//           }

//           // Generate association rules
//           const allRules = [];

//           Object.keys(supportCount).forEach((key) => {
//             const itemSet = key.split(",").map((item) => parseInt(item, 10));
//             if (itemSet.length > 1) {
//               const rules = calculateConfidence(
//                 transactions,
//                 itemSet,
//                 supportCount
//               );
//               allRules.push(
//                 ...rules.filter((rule) => rule.confidence >= minConfidence)
//               );
//             }
//           });

//           res.json({ frequentItemsets: allFrequentItems, rules: allRules });
//         })
//         .catch((err) => {
//           console.error("Error fetching transactions:", err);
//           res.status(500).send("Internal Server Error");
//         });
//     })
//     .catch((err) => {
//       console.error("Error fetching items:", err);
//       res.status(500).send("Internal Server Error");
//     });
// };
