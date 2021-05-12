var express = require('express');
const asyncHandler = require('express-async-handler');
var FreeDelivery = require('../models/freeDelivery');
const twilio = require('twilio'); 

const accountSid = 'ACdbade11aadd2851cae5d16b66d002b1e';
const authToken = '2c0dc37cd04f94bfe0a33de5bb040538'; 
const client = new twilio(accountSid, authToken);


var router = express.Router();





  router.get('/sendsms', async (req,res)=>{
    //  const {recipient , textmessage} = req.query
   // res.send('Hello to the Twilio Server')
    client.messages.create({
       body:"Your delivery is totally affected, it is ready to be delivered.",
       to:'+21629937412',
       from:'+12168103180',
     }).then((message)=> console.log(message.sid)) ;
    })
  

    module.exports = router;