const jwt = require('jsonwebtoken');
const User = require('../Models/customer');
module.exports.AuthMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, "Secert-Token", (err, decoded) => {
      if (err) {
        res.json({ Error: "The token is not correct" });
      } else {
        req.firstName = decoded.firstName;
        next();
      }
    });
  } else {
    res.json({ Error: "you are not Authenticated" });
  }
};

module.exports.checkUser = (req , res , next) =>{
    const token = req.cookies.jwt;
    if (token){
        jwt.verify(token , 'not ninja secret' , async(err , decodedToken) =>{
            if(err){
                console.log(err.message);
                res.locals.user = null;
                next();
            }else{
                console.log(decodedToken);
                let user = await User.findByPk(decodedToken.id);
                res.locals.user = user ;
                next();
            }
        })
    }else{
        res.locals.user = null; 
        next();
    }
}
