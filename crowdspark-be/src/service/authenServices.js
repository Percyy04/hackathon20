const Users = require("../models/User");
const bcrypt = require("bcrypt");
const generateToken = require("../lib/util.js");
const admin = require("firebase-admin");

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ message: "All fields are required!" });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return res.status(400).json({ message: "Invalid email format!" });

    const user = await Users.findOne({ email });
    if (user)
      return res.status(400).json({ message: "Email is already used!" });

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const result = await Users.create({
      username,
      email,
      password: hashedPass,
    });

    return res.status(201).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "All fields are required!" });

  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return res.status(400).json({ message: "Invalid credential" });

    const user = await Users.findOne({ email });
    if (!user) return res.status(400).json({ message: "No user found!" });

    const correctPass = await bcrypt.compare(password, user.password);
    if (!correctPass)
      return res.status(400).json({ message: "Incorrect password!" });

    const token = generateToken(user, res);
    return res.status(200).json({ message: token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error" });
  }
};

const loginWithGoogle = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken)
      return res.status(400).json({ message: "Id Token is required!" });

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { name, email, picture } = decodedToken;

    let user = await Users.findOne({ email });

    if (!user) {
      user = new Users({
        username: name,
        email,
        avatar: picture,
      });
      await user.save();
    }

    res.cookie("jwt", idToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
    });
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal error" });
  }
};

const logout = (_, res) => {
  res.cookie("jwt", "", {
    maxAge: 0,
  });

  return res.status(200).json({ message: "Logout successfully!" });
};

module.exports = {
  signup,
  login,
  loginWithGoogle,
  logout,
};
