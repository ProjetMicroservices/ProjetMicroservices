const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username : {
        type : String,
        required : [true, "Username required"]
    },
    email : {
        type : String,
        required : [true, "Please add an email"], /*required: [true, "Please add an email"],*/
        unique : true,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          "Please add a valid email",
        ]
        
    },
    password : {
        type : String,
        required : [true, 'Password required']
    },
    adresse : {
      type : String,
      required : [true, 'Address required']
    },
    phone : {
      type : String,
      required : [true, 'Phone number required']
    },
    role : {
      type : String,
      require : [true, 'unidentified role'],
      enum: ['company']
    },
    date : {
      type : Date
    }
    
})

module.exports = mongoose.model('company', userSchema)