const mongoose = require('mongoose');

// Creating Schema
const produtsSchmea = mongoose.Schema({title:{type: String, required:true},
                                       price: {type: Number, required:true},
                                       productImg:{type: String, required:true}});


module.exports=mongoose.model('Products',produtsSchmea)                                      