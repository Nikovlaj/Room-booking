const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authcontrollers");

//POST /register

router.post("/register", register);

//POST /login
router.post("/login", login);

module.exports = router;
