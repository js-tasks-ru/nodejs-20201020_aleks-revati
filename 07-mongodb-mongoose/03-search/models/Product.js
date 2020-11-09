/* eslint-disable object-curly-spacing */
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },

  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
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

productSchema.index({
  title: 'text',
  description: 'text',
}, {
  default_language: 'russian',
  weights: { title: 10, description: 5 },
  name: 'TextSearchIndex',
},
);

module.exports = connection.model('Product', productSchema);
