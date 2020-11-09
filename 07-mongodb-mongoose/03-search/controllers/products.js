/* eslint-disable object-curly-spacing */
const Product = require('../models/Product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const { query } = ctx.query;

  await Product.find({
    $text: { $search: query },
  }, {
    score: { $meta: 'textScore' },
  }).sort({ score: { $meta: 'textScore' } }).then((products) => {
    if (!products.length) {
      // ctx.body = 'No results found.';
      ctx.body = { products: [] };
    } else {
      ctx.body = {
        products: products.map((product) => {
          return product.toObject();
        }),
      };
    }
  });
};
