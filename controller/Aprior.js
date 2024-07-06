generateCombinations = (items , k) =>{
    if(k===1)
        return items.map(item => [item]);
    var combinations = [];
    items.forEach((item , index) =>{
        const smallerCombinations = generateCombinations(item.slice(index+1) , k-1 );
        smallerCombinations.forEach(combination =>{
            combinations.push([item, ...combination]);
        });
    });
    return combinations;
};


countSupport = (transactions , itemSets) => {
    var supportCount = {};
    itemSets.forEach(itemSet => {
        const key = itemSet.sort().join(',');
        supportCount[key] = 0;
        transactions.forEach(transaction => {
            if(itemSet.every(item => transaction.includes(item)))
                supportCount[key]++;
        });
    });
    return supportCount;
}

filterItemSets = (supportCount , minSupport , totalTransactions) => {
    var frequentItems = {};
    for(var key in supportCount){
        var support = supportCount[key] / totalTransactions;
        if(support >= minSupport){
            frequentItems[key] = support;
        }
    }
    return frequentItems;   
}

createIteams = () =>{
    var items = [];
    
}
module.exports.aprior = (req, res, next) => {
    const Order = require("../Models/Order");
    Order.findAll({ group: ["customerId"] }).then((order) => {
      order.map((ordy) => {
        res.json(ordy);
      })
    });
}   


