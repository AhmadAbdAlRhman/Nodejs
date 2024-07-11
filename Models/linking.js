/*import the table*/
const product = require("./product");
const customer = require("./customer");
const Store = require('./Store');
require('./rahaf'),
require('./testRahaf');
const order = require('./Order');
const product_image = require('./Product_image');
/*_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_*/
//link between the table
Store.hasMany(product, { as: "products", foreignKey: "StoreId" });
product.belongsTo(Store, { foreignKey: "StoreId" });

customer.hasMany(order, { as: "customer", foreignKey: "customerId" }); //one to many relationship from cart to user
order.belongsTo(customer);

product.hasMany(order, { as: "product", foreignKey: "productId" }); //one to many relationship from cart to user
order.belongsTo(product);

product.hasMany(product_image, { as: "image", foreignKey: "productId" }); //one to many relationship from cart to user
product_image.belongsTo(product);