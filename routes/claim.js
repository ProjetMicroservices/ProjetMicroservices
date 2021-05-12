var express = require('express');
const asyncHandler = require('express-async-handler');
var Claim = require('../models/claim');


var router = express.Router();


router.post('/add',(async(req,res)=>{
    const claim=await Claim.create({...req.body});
  
    if(claim) {
      res.status(200) ;
      res.json({data:claim}) ;
    }else{
      res.status(500);
      throw new Error('claim creating failed');
    }
  
  })
  );


  router.get('/'  , async (req, res) => {
  
    var claim = await Claim.find()
    res.send(claim);
  });
  

  router.get('/findByUser/:user',asyncHandler(async(req,res)=>{
    //res.send(req.params.id)   
     user = req.params.user;
    try {

      const ClaimByUser = await Claim
      .find({'user':user})
   

    if (!ClaimByUser) {
      return res.status(400).json({ message: "not found " }).end()
    }
    
    res.send(ClaimByUser);

     }  catch (e) {
    console.error(e)
    res.status(400).end()
    }


   
   })) ;



   
  router.put('/accept/:id',asyncHandler(async(req,res)=>{
      try {
    const accpetedClaim= await Claim
    .updateOne(
      { _id: req.params.id },
{ $set: { "etat" : "treated"} }
    )
    .lean()
    .exec()


    if (!accpetedClaim) {
      return res.status(400).json({ message: "not found " }).end()
    }

    res.status(200).json(accpetedClaim )
     }  catch (e) {
    console.error(e)
    res.status(400).end()
    }
   
   })) ;


   router.delete('/:id'  , async (req, res) => {
   

    try {
      const claim = await Claim.findOneAndRemove({
        _id: req.params.id
      })
  
      if (!claim) {
        return res.status(400).end()
      }
  
      return res.status(200).json({ data: claim })
    } catch (e) {
      console.error(e)
      res.status(400).end()
    }
  });


   
  router.put('/refuse/:id',asyncHandler(async(req,res)=>{
    try {
  const accpetedClaim= await Claim
  .updateOne(
    { _id: req.params.id },
{ $set: { "etat" : "refused"} }
  )
  .lean()
  .exec()


  if (!accpetedClaim) {
    return res.status(400).json({ message: "not found " }).end()
  }

  res.status(200).json(accpetedClaim )
   }  catch (e) {
  console.error(e)
  res.status(400).end()
  }
 
 })) ;



 router.get('/countDelay',async function(req,res) {
    
  Claim.countDocuments({ type: "delivery delay" }, function (err, result) {
  if (err) {
    console.log(err);
  } else {
    res.json(result);

  }

  if (result > 0) {
    console.log(result);
  }
});

   
   }) ;



   router.get('/countNR',async function(req,res) {
    
    Claim.countDocuments({ type: "delivery not received" }, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      res.json(result);
  
    }
  
    if (result > 0) {
      console.log(result);
    }
  });
  
     
     }) ;


     router.get('/countPBS',async function(req,res) {
    
      Claim.countDocuments({ type: "package in bad state" }, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.json(result);
    
      }
    
      if (result > 0) {
        console.log(result);
      }
    });
    
       
       }) ;

       router.get('/countOther',async function(req,res) {
    
        Claim.countDocuments({ type: "other" }, function (err, result) {
        if (err) {
          console.log(err);
        } else {
          res.json(result);
      
        }
      
        if (result > 0) {
          console.log(result);
        }
      });
      
         
         }) ;




  module.exports = router;