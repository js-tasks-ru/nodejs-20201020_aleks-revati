/* eslint-disable max-len */
const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');

module.exports.checkout = async function checkout(ctx, next) {
  const {product, phone, address} = ctx.request.body;

  const order = await Order.create({user: ctx.user.id, product, phone, address});

  await sendMail({
    template: 'order-confirmation',
    locals: {
      id: order._id,
      product: {title: order.product.title},
    },
    to: ctx.user.email,
    subject: 'Подтверждение заказа',
  });

  ctx.body = {order: order._id};

  return next();
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const orders = await Order.find({user: ctx.user.id}).populate('product');

  ctx.body = {orders: orders};
  return next();
};
