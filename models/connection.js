var mongoose = require('mongoose');

var options = {
    connectTimeoutMS: 5000,
    useUnifiedTopology : true,
    useNewUrlParser: true,
}

mongoose.connect('mongodb+srv://Philippe:Koo61oPDoWZQEkx7@cluster0.rrtpe.mongodb.net/morningnews?retryWrites=true&w=majority',
    options,
    function(err){
        console.log(err);
    } 
    
)

module.exports = mongoose