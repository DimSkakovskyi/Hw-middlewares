// src/config/passport.js
const LocalStrategy = require("passport-local").Strategy;
const userStore = require("../stores/userStore");

module.exports = function configurePassport(passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      async (email, password, done) => {
        try {
          const user = userStore.findByEmail(email);
          if (!user) return done(null, false, { message: "User not found" });

          const ok = await userStore.validatePassword(email, password);
          if (!ok) return done(null, false, { message: "Wrong password" });

          return done(null, { id: user.id, email: user.email });
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  // що зберігаємо в сесії:
  passport.serializeUser((user, done) => done(null, user.id));

  // як відновлюємо користувача з id в сесії:
  passport.deserializeUser((id, done) => {
    const user = userStore.findById(id);
    if (!user) return done(null, false);
    return done(null, { id: user.id, email: user.email });
  });
};
