const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const genPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const comparePassword = async (password, user_password) => {
  return await bcrypt.compare(password, user_password);
};

const issueToken = async (user) => {
  const _id = user._id;
  const expiresIn = "2d";

  const payload = {
    sub: _id,
    iat: Date.now(),
  };

  const signedToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn,
  });

  return `Bearer ${signedToken}`;
};

module.exports = {
  genPassword,
  comparePassword,
  issueToken,
};
