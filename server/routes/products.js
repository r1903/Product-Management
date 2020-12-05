const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.diskStorage({destination: function(req,file,cb){
                                    cb(null,'./uploads'); 
                                    },
                                    filename: function(req,file,cb){
                                    cb(null,file.originalname);
                                    }
                                    });
const upload = multer({storage:storage});
const Products = require('../models/products');
const checkAuth = require('../middleware/auth');
const getProduct = require('../middleware/getProduct');


//seting the endpoint that listen to HTTP get request
router.get('/', async(req,res) => {
    try{
        const products = await Products.find();
        res.status(200).json(products);
    }catch(err){
        res.status(500).json({message:err.message});
    }
});


//seting the endpoint that listen to HTTP post request
router.post('/', checkAuth, upload.single('productImg'), async (req,res)=>{
    const product = new Products({
        title:req.body.title,
        price:req.body.price,
        productImg:`http://localhost:5000/${req.file.path}`
    });

    try{
        const newProduct = await product.save();
        res.status(201).json({message:'success',product:newProduct});
    }catch(err){
        res.status(400).json({message:err.message})
        console.log(err.message);
    }

});

//seting the endpoint that listen to HTTP  get request for particular product id.
router.get('/:productId', getProduct, async(req,res) => {

    res.status(200).json(res.product);
    
});


 //seting the endpoint that listen to HTTP delete request for particular product id.
 router.delete('/:productId', checkAuth, getProduct, async(req,res) => {
    try{
         res.product.remove();
         console.log('here2')
        res.status().json({message:'Deleted product'});
    }catch(err){
        res.status(500).json({message:err.message});
    }
 });

//seting the endpoint that listen to HTTP update request for particular product id.
 router.patch('/:productId', checkAuth, getProduct, upload.single('productImg'), async(req,res) => {
    try{
        if(req.file){
           
            req.body["productImg"]=`http://localhost:5000/${req.file.path}`;
        }

        const product = await Products.updateOne(res.product,
                                                 {$set :req.body});
        res.status(200).json({message:'success',product});
    } catch(err) {
        res.status(400).json({message:err.message});
    }
 });



module.exports = router;