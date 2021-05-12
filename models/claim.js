var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const userSchema = require('./user').schema;

var claim = new Schema({
  user: { type: String},
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },

  dateClaim : Date,

      date: {
        type: String,
       
      },
 

  QRcode: {
    type: String,
  },
  type: {
    type: String,
    enum: ['delivery delay', 'delivery not received','package in bad state','other']
},
description: String,

  
  etat: {
    type: String,
    enum: ['treated', 'pending',"refused"]
} ,
 
});

module.exports = mongoose.model("claim", claim);
