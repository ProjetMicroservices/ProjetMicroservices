var express = require('express');
const asyncHandler = require('express-async-handler');
var FreeDelivery = require('../models/freeDelivery');
const twilio = require('twilio'); 
const User = require('../models/user')

const accountSid = 'ACe735327a96603551e48cadf9e116b953';
const authToken = 'dc17df17ca3ef2f9ac390e17a4ebbf68'; 
const client = new twilio(accountSid, authToken);


var router = express.Router();


router.post('/add',(async(req,res)=>{
  req.body.quantiteDispo= req.body.quantite;
    const freeDelivery=await FreeDelivery.create({...req.body});
    if(freeDelivery) {
      res.status(200) ;
      res.json({data:freeDelivery}) ;
    }else{
      res.status(500);
      throw new Error('delivery creating failed');
    }
  
  })
  );


  router.get('/afftoAdmin'  , async (req, res) => {
  
    var freeDeliveries = await FreeDelivery.find()
    if (!freeDeliveries) {
      return res.status(400).json({ message: "not found " }).end()
    }
     console.log( freeDeliveries.affectedTo)
    res.send({ freeDeliveries, data: freeDeliveries.affectedTo })
  });

  router.get('/'  , async (req, res) => { 
  
    var freeDeliveries = await FreeDelivery.find()
  
    res.send (freeDeliveries  );

  });

  router.get('/affectedTo/:idDel'  , async (req, res) => { 
  
    try {
      const freeDeliveries = await FreeDelivery
        .findOne({ _id: req.params.idDel })
        .lean()
        .exec()
  
      if (!freeDeliveries) {
        return res.status(400).json({ message: "the delivery is probably deleted " }).end()
      }
  
      res.status(200).send({ data: freeDeliveries.affectedTo })
    } catch (e) {
      console.error(e)
      res.status(400).end()
    }
  });
  

  router.put('/update/:id',asyncHandler(async(req,res)=>{
    //res.send(req.params.id)
    const freeDelivery = await FreeDelivery.findById(req.params.id);
   
    if(freeDelivery) {
    const updatedFreeDelivery = await FreeDelivery.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators:true,
      }
    );
       res.status(200) ;
       res.json(updatedFreeDelivery) ;
     } else {
       res.status(500) ; 
       throw new Error('Update failed ') ;
     }
   
   })) ;

   router.get('/:id'  , async (req, res) => {
    var freeDelivery = await FreeDelivery.findById(req.params.id)
    res.send(freeDelivery);
  });

  router.delete('/:id'  , async (req, res) => {
   

    try {
      const freeDelivery = await FreeDelivery.findOneAndRemove({
        _id: req.params.id
      })
  
      if (!freeDelivery) {
        return res.status(400).end()
      }
  
      return res.status(200).json({ data: freeDelivery })
    } catch (e) {
      console.error(e)
      res.status(400).end()
    }
  });


  router.put('/passedDelivery/:id/:affectedTo/:quantiteDispo',asyncHandler(async(req,res)=>{
    //res.send(req.params.id)   
    affectedTo = req.params.affectedTo;
    quantiteDispo =  req.params.quantiteDispo;
    nvquantite = req.params.quantiteDispo - 1; 
    state="valid"
    if(quantiteDispo==1) {
      state="invalid"
    }
    try {
    

    const updatedDelivery = await FreeDelivery
    .updateOne(
      { _id: req.params.id },
{ $set: { "state" :state , "quantiteDispo" : nvquantite }, 
$push:{
  'affectedTo': affectedTo
} }
    )
    .lean()
    .exec()

    
    if (!updatedDelivery) {
      return res.status(400).json({ message: "not found " }).end()
    }

    res.status(200).json(updatedDelivery )
     }  catch (e) {
    console.error(e)
    res.status(400).end()
    }


   
   })) ;



   router.get('/findByUser/:user/',asyncHandler(async(req,res)=>{
    //res.send(req.params.id)   
     user = req.params.user;
    try {

      const DeliveriesByUser = await FreeDelivery
      .find({'user._id':user})
   

    if (!DeliveriesByUser) {
      return res.status(400).json({ message: "not found " }).end()
    }
    
    res.send(DeliveriesByUser);

     }  catch (e) {
    console.error(e)
    res.status(400).end()
    }


   
   })) ;


  
   
   router.get('/findByAffectedUser/:affectedTo/',asyncHandler(async(req,res)=>{
    //res.send(req.params.id)   
    affectedTo = req.params.affectedTo;
    try {

      const DeliveriesByAffectedUser = await FreeDelivery
      .find({ affectedTo:affectedTo})
   

    if (!DeliveriesByAffectedUser) {
      return res.status(400).json({ message: "not found " }).end()
    }
    
    res.send(DeliveriesByAffectedUser);

     }  catch (e) {
    console.error(e)
    res.status(400).end()
    }


   
   })) ;


  module.exports = router;