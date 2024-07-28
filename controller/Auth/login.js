const Customer = require("../../Models/customer");
const Seller = require("../../Models/Store");
const bank = require("../../Models/bank");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
/*_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_*/
//handleErrors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: "", password: "" };
  //deplicate error code
  if (err.code === 11000) {
    errors.email = "that email is already registered";
    return errors;
  }
  //validation Errors
  if (err.message.includes("user validation failed")) {
    Object.values(err.message).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};
/*_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_*/
const createToken = (id) => {
  return jwt.sign({ id }, "Secert-Token", {
    expiresIn: "1h",
  });
};
module.exports.postLogin = async (req, res, _next) => {
  const { email, password } = req.body;
  let seller = Seller.findOne({ where: { email: email } });
  if (seller) {
    const isValid = await bcrypt.compare(password, seller.password);
    if (isValid) {
      const token = createToken(seller.id);
      res.cookie("token", token, { httpOnly: true });
      res.cookie("sellerId", seller.id, { httpOnly: true });
      res.status(200).json({ seller, token });
    } else {
      res.status(404).json({ result: "Not Found" });
    }
  } else {
    let customer = Customer.findOne({ where: { email: email } });
    if (customer) {
      const isValid = await bcrypt.compare(password, customer.password);
      if (isValid) {
        const token = createToken(customer.id);
        res.cookie("token", token, { httpOnly: true });
        res.cookie("customerId", customer.id, { httpOnly: true });
        res.status(200).json({ customer, token });
      } else {
        res.status(404).json({ result: "Not Found" });
      }
    } else {
      res.status(404).json({ result: "Not Found" });
    }
  }
};
/*_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_*/
module.exports.postRegister = async (req, res, _next) => {
  const { firstName, lastName, email, password, address, phoneNumber } =
    req.body;
  try {
    let user = await Customer.findOne({ where: { email: email } });
    if (user) return res.json({ result: "This email is already exists" });
    user = await Seller.findOne({ where: { email: email } });
    if (user) return res.json({ result: "This email is already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = {
      first_name: firstName,
      second_name: lastName,
      email: email,
      password: hashedPassword,
      address: address,
      telephone: phoneNumber,
    };
    const newCustomer = await Customer.create(userData);
    const bankData = {
      Cemail: newCustomer.email,
      balance: 1000000,
      token: Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000,
    };
    await bank.create(bankData);
    const token = createToken(newCustomer.id);
    res.cookie("token", token, { httpOnly: true });
    res.cookie("userId", newCustomer.id, { httpOnly: true });
    res.status(200).json({ newCustomer, token, bankData });
  } catch (err) {
    console.log(err);
    res.status(400).json({ result: "failed to Register " });
  }
};
/*_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_*/
module.exports.postUpdateProfile = (req, res, _next) => {
  const userId = req.cookies.userId;
  const first_name = req.body.firstName;
  const second_name = req.body.lastName;
  const phoneNumber = req.body.phoneNumber;
  const addressy = req.body.address;
  const photo = req.file.filename;
  Customer.findOne({ where: { id: userId } })
    .then((cust) => {
      const userData = {
        first_name: first_name,
        second_name: second_name,
        telephone: phoneNumber,
        address: addressy,
        photo: photo,
      };
      cust
        .update(userData)
        .then(() => {
          res.json({ res: "Success" });
        })
        .catch(() => {
          res.json({ res: "Failed" });
        });
    })
    .catch(() => {
      res.json({ res: "Failed" });
    });
};
/*_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_*/
module.exports.getLogout = (_req, res, _next) => {
  res.clearCookie("jwt");
  res.json({ result: "you are not Authenticated now" });
};
/*_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_*/
module.exports.postPhotoProfile = (req, res, _next) => {
  const userId = 6; //req.cookies.userId;
  const photo = req.file.filename;
  Customer.findOne({ where: { id: userId } }).then((user) => {
    user
      .update({ photo: photo })
      .then(() => {
        res.json({ result: "Success" });
      })
      .catch(() => {
        res.json({ result: "Failed" });
      });
  });
};
/*_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_*/
module.exports.deleteCount = async (req, res, _next) => {
  const customerId = req.cookies.customerId;
  const sellerId = 1; //req.cookies.sellerId;
  if (customerId) {
    await Customer.findAll({ where: { id: customerId } })
      .then((customer) => {
        let cus = customer[0];
        cus.destroy();
      })
      .then(() => {
        res.status(200).json("success");
      })
      .catch((error) => {
        res.status(404).json(error);
      });
  }
  if (sellerId) {
    await Seller.findAll({ where: { id: sellerId } })
      .then((seller) => {
        let sel = seller[0];
        sel.destroy();
      })
      .then(() => {
        res.status(200).json("success");
      })
      .catch((error) => {
        res.status(404).json(error);
      });
  }
};
