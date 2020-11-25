const mapMessage = require('../mappers/message');
const Message = require('../models/Message');

module.exports.messageList = async function messages(ctx, next) {
  const messages = await Message.find({chat: ctx.user._id}).limit(20).sort('-date');

  ctx.body = {
    messages: messages.map(mapMessage),
  };

  return next();
};
