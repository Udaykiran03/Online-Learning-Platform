const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");

const TEACHER = "TEACHER";
const STUDENT = "STUDENT";

exports.register = async (req, res) => {
  const { name, email, password, type } = req.body;

  let user;

  user = await Teacher.findOne({ email });
  if (!user) await Student.findOne({ email });
  if (user) return res.status(409).json({ message: "User already exists" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    if (type === TEACHER) {
      await Teacher.create({
        name,
        email,
        password: hashedPassword,
      });
    } else if (type === STUDENT) {
      await Student.create({
        name,
        email,
        password: hashedPassword,
      });
    } else {
      return res.status(400).json({ message: "Invalid user type" });
    }

    res.status(201).json({ message: "User registration successfull!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user;

    user = await Teacher.findOne({ email });
    if (!user) {
      user = await Student.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({ message: "User not registered" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    user = { ...user._doc };
    delete user.password;

    const token = jwt.sign({ user: user }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({ data: user, token, message: "Login successful!" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
