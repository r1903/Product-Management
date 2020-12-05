const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv/config');


const User = require('../models/user');

router.post('/signup',async (req,res) => {
    
    const{name,email,password,confirmPwd} = req.body;
   
    if(!name && !email && !password && !confirmPwd){
      return res.status(400).json({message:'please enter all the fields'});
    } 

    try{
        const user = await User.findOne({email});

        if(user){
            return res.status(400).json({message:'User already exist'});
        }

        const newUser = new User({
            name,
            email,
            password
        });

        bcrypt.hash(req.body.password,10,(err,hash)=>{
            if(err){
                return res.status(500).json({message:err.message});
            }else{
        
                newUser['password'] = hash;

            }
        }); 
        
        try{
            const createdUser = await newUser.save();
            const token = jwt.sign({email:createdUser.email,id:createdUser._id},process.env.TOKEN_KEY,{expiresIn:"1hr"})
             res.status(201).json({user:createdUser.name,
                                   message:'Registered Successfully',
                                   token
                                  });
        }catch(err){
            res.status(400).json({message:err.message})
        }


    }catch(err){
        res.status(500).json({message:err.message});
    }  
});

//seting the endpoint that listen to HTTP get request
router.get('/signup', async(req,res) => {
    try{
        const user = await User.find();
        res.status(201).json({message:'user created',
                              user});
    }catch(err){
        res.status(500).json({message:err.message});
    }
});


router.post('/login', async(req,res) => {
   
    const{email,password} = req.body;
   
    if(!email && !password){
      return res.status(400).json({message:'please enter all the fields'});
    } 

    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:'User with this email and password does not exist'});
        }

        bcrypt.compare(password,user.password,(err,result)=>{
            if(err){
                return res.status(401).json({message:'Auth failed'});
            }
            if(result){
                const token= jwt.sign({email:user.email,id:user._id},process.env.TOKEN_KEY,{expiresIn:"1hr"})
                return res.status(200).json({message:'Auth successful',
                                             token,
                                              user:user.name });
            }

            return res.status(401).json({message:'Incorrect Email or Password'});
        }); 
        
    }catch(err){
        res.status(500).json({message:err.message});
    }  
});


module.exports = router;