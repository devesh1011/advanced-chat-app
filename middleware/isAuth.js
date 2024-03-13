const CustomError = require("../middleware/CustomError");

isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    const err = new CustomError("Not Authorized", 401);

    next(err);
  }
};

module.exports = {
  isAuth,
};
