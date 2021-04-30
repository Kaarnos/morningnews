const mongoose = require('mongoose');

const wishlistsSchema = mongoose.Schema({
  title: String,
  description: String,
  content: String,
  urlToImage: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  }
})

const WishlistsModel = mongoose.model('wishlists', wishlistsSchema)

module.exports = WishlistsModel;