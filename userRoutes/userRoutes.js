const express = require('express');
const User = require('../models/userModel');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const session = require('express-session')
const mongoDbStore = require('connect-mongodb-session')(session);

//Configuring the MongoDB store
const store = new mongoDbStore({
    uri : process.env.MONGO_DB,
    databaseName: 'connect_mongodb',
    collection : 'session'
})
// Catch errors
store.on('error', function(error) {
    console.log(error);
  });

//configure doteenv
dotenv.config();

//session
router.use(session({
    secret : process.env.SECRET,
    saveUninitialized : false,
    resave : false,
    unset : 'destroy',
    store : store,
    name : 'session cookie name',
    
}));


//validation with joi
const joi = require('@hapi/joi');
const schema = joi.object({
    email : joi.string()
    .max(100)
    .email()
    .required(),
    password :
     joi.string()
     .min(8)
     .max(1200)
     .required(),
    token : joi.string()
}

)

//resgistration route
router.post('/register',async (req,res)=>{
    //check if email exists 
    const emailExists = await User.findOne({email : req.body.email})
    if(emailExists) {
        res.status(400).json({
            message : 'email exists'
        });
       
    }else{
    //validation
    const {error} = schema.validate(req.body)
    if(error) {
        res.status(400).send(error.message)
    }else{
        //encryption of password
    const hashedPassword = await bcrypt.hash(req.body.password,10);
   
    const user = new User({
        email : req.body.email,
        password : hashedPassword
    }) 
    try {
        const newUser = await user.save();
        res.status(200).json({
            message : 'uploaded'
        })

    } catch (error) {

        res.status(500).json({
            message : error
        });

    }

    }
    
   }
})

router.post('/login',async (req,res)=>{
    //validation    
    const {error} = schema.validate(req.body)
    if(error){
        res.status(400).send(error.message);
    }else{
        //authentication
    const user = await User.findOne({email : req.body.email})
    if(!user) {
        res.status(400).send('email or password is wrong');
    }else{
        const password = await bcrypt.compare(req.body.password,user.password)
        if(!password){
            res.status(400).send('email or password is wrong');
        }else{
            req.session.user = {
                email : user.email,
                password : user.password
            }
            res.send('logged in');

        }
        
    }
    

    }

})

router.get('/logout',(req,res)=>{
    if(req.session.user){
        console.log(req.session.user)
        
        delete req.session.user;
        res.send('logged out')
    }else{
        res.send('failed')
    }
})


module.exports = router;