const { v4: uuid } = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  try {
    const token = uuid();
    const { email, displayName, password } = ctx.request.body;

    const user = await User.create({ email, displayName, verificationToken: token });
    await user.setPassword(password);
    await user.save();
    await sendMail({
      template: 'confirmation',
      locals: { token: token },
      to: email,
      subject: 'Подтвердите почту',
    });

    ctx.body = { status: 'ok' };
    return next();
  } catch (err) {
    if (err.name !== 'ValidationError') throw err;

    ctx.status = 400;
    if (err.errors.displayName) ctx.body = { errors: { displayName: 'Такое имя уже существует' } };
    if (err.errors.email) ctx.body = { errors: { email: 'Такой email уже существует' } };
  }
};

module.exports.confirm = async (ctx, next) => {
  const { verificationToken } = ctx.request.body;

  const user = await User.findOneAndUpdate(
    { verificationToken: verificationToken },
    { $unset: { verificationToken: 1 } });

  if (!user) {
    ctx.status = 400;
    ctx.body = { error: 'Ссылка подтверждения недействительна или устарела' };
    return next();
  }

  ctx.body = await ctx.login(user);
  ctx.body = { token: uuid() };
};
