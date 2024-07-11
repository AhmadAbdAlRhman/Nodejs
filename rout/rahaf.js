const express = require("express");
const rahaf = require("../controller/rahaf");
const router = express.Router();
router.get("/question", rahaf.getQuestions);
router.post("/test",rahaf.addTest);
module.exports = router;