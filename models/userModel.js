const mongoose = require('mongoose');
const UserSchema = mongoose.Schema({
    email : {
        type : String,
        require 
    },
    password : {
        type : String,
        require 
    },
    date : {
        type : Date,
        dafault : Date.now
    },
    token : {
        type : String, 
    }
})


module.exports = mongoose.model('user',UserSchema);