const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");
const { comparePassword } = require("../utils/passwordUtils");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          return done(null, false);
        }

        const isValid = comparePassword(password, user.password);
        if (!isValid) {
          return done(null, false);
        }
        return done(null, user);
      } catch (error) {
        done(error.message);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (userId, done) => {
  try {
    const user = await User.findById(userId);

    if (user) {
      done(null, user);
    }
  } catch (error) {
    done(err);
  }
});
