var express = require('express');
var router = express.Router();
const bcrypt = require("bcryptjs");
const userModel = require('../../models/user')

const verifAuth = (req, res, next)=>{
  if(req.session.isAuth){
      next()
  }else{
      res.redirect('/auth')
  }
}

/* GET users listing. */
router.get('/' ,verifAuth , async (req, res) => {
  
  var users = await userModel.find()
  res.send(users);
});

router.put('/updatepassword/:id' ,verifAuth , async (req, res) => {

  var user = await userModel.findById(req.params.id)
  if (!user) {
    //return res.send("vous n'etes pas enregistrer");
   return res.status(203).send("vous n'etes pas enregistrer")
 }

 const isMatch = await bcrypt.compare(req.body.passcurrent, user.password);

 if (!isMatch) {
  return res.status(203).send("password incorrecte");
}
const hashedPsw = await bcrypt.hash(req.body.passnew, 12);

var user = await userModel.findByIdAndUpdate(req.params.id, {password: hashedPsw},{})
  res.send("modification success");
})

router.put('/profile/:id' ,verifAuth , async (req, res) => {
  
  var user = await userModel.findById(req.params.id)
  if (!user) {
    //return res.send("vous n'etes pas enregistrer");
   return res.status(203).send("vous n'etes pas enregistrer")
 }

 const isMatch = await bcrypt.compare(req.body.password, user.password);

 if (!isMatch) {
   return res.status(203).send("mot de passe incorrecte");
 }

 var user = await userModel.findByIdAndUpdate(req.params.id, req.body.profile,{})
  res.send("modification success");
});

router.put('/:id' ,verifAuth , async (req, res) => {
  
  var user = await userModel.findOne({ email: req.body.email });
  if (user) {
    return res.status(203).send("Email exist");
  }
  var user = await userModel.findByIdAndUpdate(req.params.id, req.body,{}) 
  var user = await userModel.findById(req.params.id)
  res.send(user);
});

router.delete('/:id' ,verifAuth , async (req, res) => {
  var user = await userModel.findById(req.params.id)
  user.remove();
  res.send('user deleted')

});

router.post('/adduser',verifAuth, async (req,res)=>{
  const { username, email, password, adresse, phone, role,id_company } = req.body;
  user = new userModel({
    username,
    email,
    password,
    adresse,
    phone,
    role,
    date : Date.now(),
    id_company
  });
  try{
    await user.save();
    res.send(user);

  }catch(err){
    res.status(203).send(err.message)
  }
});

router.get('/stat',verifAuth, async(req, res)=>{

  var jancurrent=[]; var fevcurrent=[]; var marcurrent=[]; var avrcurrent=[];
   var maicurrent=[]; var juincurrent=[]; var juilcurrent=[]; var aoutcurrent=[];
    var septcurrent=[]; var octcurrent=[]; var novcurrent=[]; var deccurrent=[]

    var janbefore=[]; var fevbefore=[]; var marbefore=[]; var avrbefore=[];
   var maibefore=[]; var juinbefore=[]; var juilbefore=[]; var aoutbefore=[];
    var septbefore=[]; var octbefore=[]; var novbefore=[]; var decbefore=[]

  var users = await userModel.find()
  
  users.map(user=>{

    if(new Date(user.date).getFullYear() == new Date().getFullYear()){
      if(new Date(user.date).getMonth()+1 === 1){
        jancurrent.push(user)
      }
      if(new Date(user.date).getMonth()+1 === 2){
        fevcurrent.push(user)
      }
      if(new Date(user.date).getMonth()+1 === 3){
        marcurrent.push(user)
      }
      if(new Date(user.date).getMonth()+1 === 4){
        avrcurrent.push(user)
      }
      if(new Date(user.date).getMonth()+1 === 5){
        maicurrent.push(user)
      }
      if(new Date(user.date).getMonth()+1 === 6){
        juincurrent.push(user)
      }
      if(new Date(user.date).getMonth()+1 === 7){
        juilcurrent.push(user)
      }
      if(new Date(user.date).getMonth()+1 === 8){
        aoutcurrent.push(user)
      }
      if(new Date(user.date).getMonth()+1 === 9){
        septcurrent.push(user)
      }
      if(new Date(user.date).getMonth()+1 === 10){
        octcurrent.push(user)
      }
      if(new Date(user.date).getMonth()+1 === 11){
        novcurrent.push(user)
      }
      if(new Date(user.date).getMonth()+1 === 12){
        deccurrent.push(user)
      }
    }

    if(new Date(user.date).getFullYear() == (new Date().getFullYear()-1)){
      if(new Date(user.date).getMonth()+1 === 1){
        janbefore.push(user)
      }
      if(new Date(user.date).getMonth()+1 === 2){
        fevbefore.push(user)
      }
      if(new Date(user.date).getMonth()+1 === 3){
        marbefore.push(user)
      }
      if(new Date(user.date).getMonth()+1 === 4){
        avrbefore.push(user)
      }
      if(new Date(user.date).getMonth()+1 === 5){
        maibefore.push(user)
      }
      if(new Date(user.date).getMonth()+1 === 6){
        juinbefore.push(user)
      }
      if(new Date(user.date).getMonth()+1 === 7){
        juilbefore.push(user)
      }
      if(new Date(user.date).getMonth()+1 === 8){
        aoutbefore.push(user)
      }
      if(new Date(user.date).getMonth()+1 === 9){
        septbefore.push(user)
      }
      if(new Date(user.date).getMonth()+1 === 10){
        octbefore.push(user)
      }
      if(new Date(user.date).getMonth()+1 === 11){
        novbefore.push(user)
      }
      if(new Date(user.date).getMonth()+1 === 12){
        decbefore.push(user)
      }
    }
  })

  const stat = {
    statcurrent : {
      Jan : jancurrent.length,
      Fev : fevcurrent.length,
      Mars: marcurrent.length,
      Avril : avrcurrent.length,
      Mai : maicurrent.length,
      Juin : juincurrent.length,
      Juillet : juilcurrent.length,
      Aout : aoutcurrent.length,
      Septembre : septcurrent.length,
      Octobre : octcurrent.length,
      Novembre : novcurrent.length,
      Decembre : deccurrent.length
  },
  statbefore : {
    Jan : janbefore.length,
    Fev : fevbefore.length,
    Mars: marbefore.length,
    Avril : avrbefore.length,
    Mai : maibefore.length,
    Juin : juinbefore.length,
    Juillet : juilbefore.length,
    Aout : aoutbefore.length,
    Septembre : septbefore.length,
    Octobre : octbefore.length,
    Novembre : novbefore.length,
    Decembre : decbefore.length
},

}

  res.send(stat)
} );

router.get('/:id' ,verifAuth , async (req, res) => {
  var user = await userModel.findById(req.params.id)
  res.send(user);
});

module.exports = router;
