const express = require("express");
const path = require("path");
const rahaf = require("../controller/rahaf");
const router = express.Router();
router.get("/question", rahaf.getQuestions);
router.post("/test",rahaf.addTest);
