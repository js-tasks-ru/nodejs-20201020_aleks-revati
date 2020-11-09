/* eslint-disable object-curly-spacing */
const Category = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {
  await Category.find().then((categories) => {
    ctx.body = {
      categories: categories.map((category) => {
        return category.toObject();
      }),
    };
  });
};
