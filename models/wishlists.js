const mongoose = require('mongoose');

const wishlistsSchema = mongoose.Schema({
  title: String,
  desciption: String,
  content: String,
  img: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  }
})

const WishlistsModel = mongoose.model('wishlists', wishlistsSchema)

module.exports = WishlistsModel;