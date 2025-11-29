const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const {
  login,
  signup,
  logout,
  loginWithGoogle,
} = require("../service/authenServices");
const verifyToken = require("../middleware/auth");

const authenRouter = express.Router();
authenRouter.use(bodyParser.json());
router.use(verifyToken);


authenRouter.post("/login", login);
authenRouter.post("/signup", signup);
authenRouter.post("/login-google", loginWithGoogle);
authenRouter.post("/logout", logout);

module.exports = authenRouter;
