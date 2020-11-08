const mongoose = require('mongoose');
const connection = require('../libs/connection');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  category: {
    type: mongoose.Types.ObjectId,
    ref: 'Category',
    required: true,
  },

  subcategory: {
    type: mongoose.Types.ObjectId,
    required: true,
  },

  images: [String],

});

productSchema.set('toObject', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = doc.id;
    delete ret._id;
    delete ret.__v;
  },
});

module.exports = connection.model('Product', productSchema);
