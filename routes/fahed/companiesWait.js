var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var {google} = require('googleapis')
const compwaitModel = require('../../models/compwaiting')
const userModel = require('../../models/user')

const CLIENT_ID = '888983214216-0eidl17pv0gsogdhoaa1goagp08ashjr.apps.googleusercontent.com'
const CLIENT_SECRET = 'YtybFzMFMCzmWsXMOXLpqnuq'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = '1//04dYn748hrjdhCgYIARAAGAQSNwF-L9Ir5_VR58NZ6U8It82O9nrCENGVVLsX7vYO47cXwhr4L3WWaRzOUVV9hhgusszDPbSPJwk'

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN})

const accessToken = oAuth2Client.getAccessToken()

const verifAuth = (req, res, next)=>{
    if(req.session.isAuth){
        next()
    }else{
        res.redirect('/auth')
    }
  }

  router.get('/' ,verifAuth , async (req, res) => {
  
    var companies = await compwaitModel.find()
    res.send(companies);
  });

  router.delete('/:id' ,verifAuth , async (req, res) => {
    var company = await compwaitModel.findById(req.params.id)
    company.remove().then(result=>{
        let transporter = nodemailer.createTransport({
          service : 'gmail',
          auth : {
            type : 'OAuth2',
            user : "wecodeesprit@gmail.com",
            clientId : CLIENT_ID,
            clientSecret : CLIENT_SECRET,
            refreshToken : REFRESH_TOKEN,
            accessToken : accessToken,
            pass : "wecode1234"
        }
      })
  
        transporter.sendMail({
          to : company.email,
          from : "wecodeesprit@gmail.com",
          subject : "Request canceled",
          html : `
          <p>Hello,</p>
          <h4>We are sorry, your request to create an account has been canceled because the contact details are not correct.</h4>
          `
        })
        res.send("company deleted")
      })
  
  });

  router.post('/add',verifAuth, async (req,res)=>{
    var company = await compwaitModel.findOne({email : req.body.email})
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
      await user.save().then(result=>{
        let transporter = nodemailer.createTransport({
          service : 'gmail',
          auth : {
            type : 'OAuth2',
            user : "wecodeesprit@gmail.com",
            clientId : CLIENT_ID,
            clientSecret : CLIENT_SECRET,
            refreshToken : REFRESH_TOKEN,
            accessToken : accessToken,
            pass : "wecode1234"
        }
      })
  
        transporter.sendMail({
          to : company.email,
          from : "wecodeesprit@gmail.com",
          subject : "Request accepted",
          html : `
          <p>Hello,</p>
          <h4>Welcome to our platform, your request to create an account has been accepted, 
          if you have forgotten your password you can change it with this <a href="https://shortdistance.herokuapp.com/resetpassword">link</a>.</h4>
          `
        })
        res.send(user)
      });
      
      await company.remove()
    }catch(err){
      res.status(203).send(err.message)
    }
  });

  module.exports = router;