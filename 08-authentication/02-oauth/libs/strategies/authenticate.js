/* eslint-disable object-curly-spacing */
const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  try {
    if (!email) return done(null, false, 'Не указан email');

    const user = await User.findOne({ email: email });
    if (user) {
      return done(null, user);
    } else {
      const user = await User.create({ email: email, displayName: displayName });
      return done(null, user);
    }
  } catch (err) {
    done(err);
  }
};
