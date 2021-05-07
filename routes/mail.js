var express = require("express");
var router = express.Router();
var nodemailer = require('nodemailer')
var {google} = require('googleapis')
const userModel = require("../models/user");

const CLIENT_ID = '888983214216-0eidl17pv0gsogdhoaa1goagp08ashjr.apps.googleusercontent.com'
const CLIENT_SECRET = 'YtybFzMFMCzmWsXMOXLpqnuq'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = '1//04dYn748hrjdhCgYIARAAGAQSNwF-L9Ir5_VR58NZ6U8It82O9nrCENGVVLsX7vYO47cXwhr4L3WWaRzOUVV9hhgusszDPbSPJwk'

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN})

const accessToken = oAuth2Client.getAccessToken()

const mail = (data)=>{

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

    let mailOptions = {
        from : "wecodeesprit@gmail.com",
        to: data.email,
        subject : data.emailsend,
        html: `
        Subject : <h3>${data.subject}</h3><hr/>
        Message : <p>${data.message}</p>
        `
    }

    transporter.sendMail(mailOptions, (err, data)=>{
        if (err){
            res.status(203).send('error')}
        // }else{
        //     console.log('email sent !!!')
        // }
    })
}

router.post("/", async (req, res) => {
    const { email, emailsend, subject ,message } = req.body;
    //const user = await userModel.findOne({ email: emailsend });

    // if (!user) {
    //     //return res.send("vous n'etes pas enregistrer");
    //    return res.status(203).send("vous n'etes pas enregistrer")
    //  }
    //  else {
        mail(req.body)
        res.send('email sent')
     //}

})

module.exports = router;