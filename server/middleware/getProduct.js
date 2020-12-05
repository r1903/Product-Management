const Products = require('../models/products');

module.exports = async (req,res,next) => {
    let product;
    try{
       product = await Products.findById(req.params.productId);
       if(product == null){
           return res.status(404).json({message: 'Cannot find product'});
       }
    }catch(err){
      return res.status(500).json({message:err.message});
    }
    res.product = product;
    next();
}