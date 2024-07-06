const Customer = require("../../Models/customer");
const Seller = require("../../Models/Store");
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
module.exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  Seller.findOne({ where: { email: email } }).then(async (seller) => {
    if (seller) {
      const isValid = await bcrypt.compare(password, seller.password);
      if (isValid) {
        const token = createToken(seller.id);
        res.cookie("token", token, {
          httpOnly: true,
          // maxAge: "1h",
        });
        res.status(200).json({ seller ,token });
      } else {
        res.status(404).json({ result: "Not Found" });
      }
    } else {
      Customer.findOne({ where: { email: email } }).then(async (customer) => {
        if (customer) {
          const isValid = await bcrypt.compare(password, customer.password);
          if (isValid) {
            const token = createToken(customer.id);
            res.cookie("token", token, {
              httpOnly: true,
              // maxAge: "2h",
            });
            res.cookie("userId", customer.id, {
              httpOnly: true,
              // maxAge: "2h",
            });
            res.status(200).json({ customer , token});
          }
          else {
            res.status(404).json({ result: "Not Found" });
          }
        }
      });
    }
  });
};
/*_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_*/
module.exports.postRegister = (req, res, _next) => {
  const namy = req.body.firstName;
  const Sname = "req.body.lastName";
  const email = req.body.email;
  const password = req.body.password;
  Customer.findOne({ where: { email: email } }).then((user) => {
    if (user) {
      return res.json({ result: "This email is already exists" });
    } else {
      Seller.findOne({ where: { email: email } }).then((user) => {
        if (user) {
          return res.json({ result: "This email is already exists" });  
        } else {
          bcrypt.hash(password, 10).then(async (hashedPassword) => {
            const userData = {
              first_name: namy,
              second_name: Sname,
              email: email,
              password: hashedPassword,
            };
            await Customer.create(userData)
              .then((user) => {
                const token = createToken(user.id);
                res.cookie("token", token, {
                  httpOnly: true,
                  // maxAge: '2h',
                });
                res.cookie("userId", user.id, {
                  httpOnly: true,
                  // maxAge: '2h',
                });
                res.status(200).json({user,token});
              })
              .catch((err) => {
                console.log(err);
                res.status(400).json({ result: "failed to Register " });
              });
          });
        }
      });
    }
  });
};
/*_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_*/
module.exports.postUpdateProfile = (req, res, next) => {
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
module.exports.getLogout = (req, res, next) => {
  res.clearCookie("jwt");
  res.json({ result: "you are not Authenticated now" });
};
/*_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_*/
