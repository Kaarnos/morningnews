var express = require('express');
var router = express.Router();

var uid2 = require('uid2')
var bcrypt = require('bcrypt');

var userModel = require('../models/users');
var WishlistsModel = require('../models/wishlists');


router.post('/save-article', async function (req, res, next) {
  console.log(req.body);
  var user = await userModel.findOne({token: req.body.userToken});

  var newArticle = new WishlistsModel({
    title: req.body.title,
    description: req.body.description,
    content: req.body.content,
    urlToImage: req.body.img,
    userId: user._id
  });

  console.log('newArticle', newArticle);
  await newArticle.save();

  res.json(true);
})

router.delete('/delete-article/:title/:token', async function (req, res, next) {
  console.log('params',req.params);

  var user = await userModel.findOne({token: req.params.token});
  var article = await WishlistsModel.deleteOne({
    userId: user._id,
    title: req.params.title
    });

  console.log(article);
  
  res.json(true);
})

router.post('/initiate-wishlist', async function (req, res, next) {
  var user = await userModel.findOne({token: req.body.token})
  var wishlist = await WishlistsModel.find({userId: user._id})
  console.log(wishlist);
  res.json(wishlist);
})


router.post('/sign-up', async function(req,res,next){

  var error = []
  var result = false
  var saveUser = null
  var token = null

  const data = await userModel.findOne({
    email: req.body.emailFromFront
  })

  if(data != null){
    error.push('utilisateur déjà présent')
  }

  if(req.body.usernameFromFront == ''
  || req.body.emailFromFront == ''
  || req.body.passwordFromFront == ''
  ){
    error.push('champs vides')
  }


  if(error.length == 0){

    var hash = bcrypt.hashSync(req.body.passwordFromFront, 10);
    var newUser = new userModel({
      username: req.body.usernameFromFront,
      email: req.body.emailFromFront,
      password: hash,
      token: uid2(32),
    })
  
    saveUser = await newUser.save()
  
    
    if(saveUser){
      result = true
      token = saveUser.token
    }
  }
  

  res.json({result, saveUser, error, token})
})

router.post('/sign-in', async function(req,res,next){

  var result = false
  var user = null
  var error = []
  var token = null
  
  if(req.body.emailFromFront == ''
  || req.body.passwordFromFront == ''
  ){
    error.push('champs vides')
  }

  if(error.length == 0){
    const user = await userModel.findOne({
      email: req.body.emailFromFront,
    })
  
    
    if(user){
      if(bcrypt.compareSync(req.body.passwordFromFront, user.password)){
        result = true
        token = user.token
      } else {
        result = false
        error.push('mot de passe incorrect')
      }
      
    } else {
      error.push('email incorrect')
    }
  }
  

  res.json({result, user, error, token})


})

      // Route_lang_TODO_ROAD_USER
router.get('/user-lang', async function(req, res,next) {
  var lang = null 
  var user = await userModel.findOne({token: req.body.token})
  
  if(user != null){         // Check
    lang = user.lang
  }

  res.json({lang})
})

router.post('user-lang', async function(req, res,next){
  var lang = null  //false
  var user = await userModel.updateOne({token: req.body.token}, {lang:req.body.lang})

  if(user != null){
    result = true
  }

  res.json({result})

})



module.exports = router;
