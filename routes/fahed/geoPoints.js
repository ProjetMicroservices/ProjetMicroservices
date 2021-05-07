var express = require("express");
var router = express.Router();
const circuitModel = require('../../models/circuit')

const {orderByDistance}= require('geolib')

const verifAuth = (req, res, next)=>{
    if(req.session.isAuth){
        next()
    }else{
        res.redirect('/auth')
    }
  }

router.get('/all/:id' ,verifAuth , async (req, res) => {
  
    var circuits = await circuitModel.find({iduser : req.params.id})
    res.send(circuits);
  });

  router.get('/:id' ,verifAuth , async (req, res) => {

    var circuit = await circuitModel.findById(req.params.id)
  res.send(circuit);

  })

  router.put('/:id' ,verifAuth , async (req, res) => {
    
    let order = orderByDistance(req.body.start, req.body.points)
  
    var circuit = await circuitModel.findById(req.params.id)
    newcircuit = {
        name : circuit.name,
        departure: req.body.departure,
        destinations : req.body.items,
        start : req.body.start,
        waypoints : order,
        iduser : req.body.idcreator
      };
      
    var upcircuit = await circuitModel.findByIdAndUpdate(req.params.id, newcircuit)
    res.send(upcircuit) 
  });

router.post('/',async (req, res)=>{

    var circuits = await circuitModel.find({ iduser : req.body.idcreator })
   
    let order = orderByDistance(req.body.start, req.body.points)
    numberPoints = order.length
    let points = {
        start : req.body.start,
        waypoints : order
    }

    circuit = new circuitModel({
        name : `circuit ${circuits.length + 1}`,
        departure: req.body.departure,
        destinations : req.body.items,
        start : req.body.start,
        waypoints : order,
        iduser : req.body.idcreator,
        date : new Date()
      });
      console.log(circuit)
      await circuit.save()
    res.send(points)
})

module.exports = router;