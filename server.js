const express = require('express');
const userRoute = require('./userRoutes/userRoutes');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();

//configaraion of dotenv
dotenv.config();

//creating server
const port = process.env.PORT || 3000;
app.listen(port,()=>console.log(`listenning on port ${port}`));

//connecting to the database 
mongoose.connect(process.env.MONGO_DB,{useNewUrlParser : true, useUnifiedTopology : true})
.then(console.log('connected to db'))
.catch(err=>console.log(err));

//middleWare
app.use(express.json());
app.use(express.urlencoded({extended : false}));

//routes configaration
app.use('/user',userRoute);



