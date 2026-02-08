const User = require("../../models/user");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

async function handleUserSignup(req, res) {
  try {
    const { name, username, email, password, avatar } = req.body || {};

    if (!name || !username || !email || !password) {
      return res
        .status(400)
        .json({ message: "name, username, email, and password are required" });
    }

    const existingUser = await User.exists({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const existingUsername = await User.exists({ username });
    if (existingUsername) {
      return res.status(409).json({ message: "Username already taken" });
    }

    const user = await User.create({ name, username, email, password, avatar: avatar || "Avatar1" });

    return res.status(201).json({
      message: "Signup successful",
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function handleUserLogin(req, res) {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password are required" });
    }

    const user = await User.findOne({ email })
      .select("_id name username email avatar password")
      .lean();

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });
    // console.log(user);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    // console.log(error);

    return res.status(500).json({ message: "Internal server error" });
  }
}

async function handleUserData(req, res) {
  const userId = req.user.id;
  const userData = await User.findById(userId).select("-password").lean();

  if (!userData) {
    return res.status(404).json({ message: "No data found" });
  }

  return res.status(200).json({ userData });
}

module.exports = {
  handleUserSignup,
  handleUserLogin,
  handleUserData,
};
