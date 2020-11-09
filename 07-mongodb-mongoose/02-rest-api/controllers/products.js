/* eslint-disable object-curly-spacing */
const mongoose = require('mongoose');
const Product = require('../models/Product');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const { subcategory } = ctx.query;
  if (!subcategory) return next();
  if (mongoose.Types.ObjectId.isValid(subcategory)) {
    await Product.find({ subcategory: subcategory }).then((products) => {
      ctx.body = {
        products: products.map((product) => {
          return product.toObject();
        }),
      };
    });
  } else {
    ctx.body = { products: [] };
    ctx.status = 400;
  }
};

module.exports.productList = async function productList(ctx, next) {
  await Product.find().then((products) => {
    ctx.body = {
      products: products.map((product) => {
        return product.toObject();
      }),
    };
  });
};

module.exports.productById = async function productById(ctx, next) {
  const { id } = ctx.params;
  if (mongoose.Types.ObjectId.isValid(id)) {
    await Product.findById(id).then((product) => {
      ctx.body = { product: product.toObject() };
    }).catch(() => {
      ctx.body = 'Product not found';
      ctx.status = 404;
    });
  } else {
    ctx.body = 'Id is invalid';
    ctx.status = 400;
  }
};
