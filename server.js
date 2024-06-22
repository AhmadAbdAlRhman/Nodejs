/*import needed Library  */
const express = require("express");
const session = require("express-session");
const path = require("path");
const cookieParser = require("cookie-parser");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
/*_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_*/
const sequelize = require("./config/database");
require("./Models/linking");
require("./controller/schedule");
require('dotenv').config();
const port = 3000;
const corsOption = {
  origin: ["http://localhost:3000", "http://localhost:5173"],
  methods: ["POST", "GET"],
  credentials: true,
  optionSuccessStatus: 200
}
/*_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_*/
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(cors(corsOption));
app.use(express.json()); //this is to accept data in json format
app.use(express.urlencoded({ extended: true })); //this is basically to decode the data send through html form
app.use(bodyParser.urlencoded({ extended: true })); //body-parser is a middleware in Express designed to handle and parse data sent in the body of HTTP requests.
const rout = require("./rout/route");
const store = require("./rout/store");
app.use(rout);
app.use(store);
app.use(
  session({
    secret: "some secret",
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
      db: sequelize,
    }),
    // cookie: {
    //   maxAge: 1000 * 60 * 60 * 24,
    // },
  })
);
sequelize
  .sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running at http://localhost:port`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
