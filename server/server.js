//Requireing the dependency modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv/config');
const productsRoute = require ('./routes/products');
const userRoute = require ('./routes/user');
const port = process.env.PORT || 5000;

//Defining the Express app
const app = express();

//Adding Middlewares 
app.use(cors());
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/products', productsRoute);
app.use('/user', userRoute);


//seting the endpoint that listen to HTTP get request.
app.get('/',(req,res) => {
    res.send("its home page");

});

//Connecting to the database
mongoose.connect(process.env.DB_CONNECTION
                ,{ useNewUrlParser: true,useUnifiedTopology: true},
                 ()=> console.log('connected to db'));


// starting the server
app.listen(port,'0.0.0.0',()=> console.log('server is running'));


