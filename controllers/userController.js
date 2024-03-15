const {
  genPassword,
  comparePassword,
  issueToken,
} = require("../utils/passwordUtils");
const User = require("../models/User");
const CustomError = require("../middleware/CustomError");
const asyncHandler = require("../utils/asyncHandler");

const register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    const err = new CustomError("user already exists", 401);

    return next(err);
  }

  const hashedPassword = await genPassword(password);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    image: `images/${req.file.filename}`,
  });
  await newUser.save();

  res.redirect("/users/profile");
});

const registerForm = asyncHandler(async (req, res, next) => {
  res.render("register.ejs");
});

const loginForm = asyncHandler(async (req, res, next) => {
  res.render("login.ejs");
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  user;
  if (!user) {
    const err = new CustomError("User does not exists!", 404);
    next(err);
  }

  const isValid = await comparePassword(password, user.password);

  if (!isValid) {
    const err = new CustomError("Enter a valid password", 401);
    next(err);
  }

  res.redirect("/");
});

const getProfile = asyncHandler(async (req, res, next) => {
  const users = await User.find({ _id: { $nin: [req.user._id] } });
  res.render("dashboard.ejs", { user: req.user, users: users });
});

const logout = asyncHandler(async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/users/login");
  });
});

module.exports = {
  register,
  registerForm,
  loginForm,
  login,
  logout,
  getProfile,
};
