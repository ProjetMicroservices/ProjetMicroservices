var express = require("express");
var app = express();
require("dotenv").config();
const expressListRoutes = require("express-list-routes");
var cookieParser = require("cookie-parser");
var path = require("path");
const cors = require("cors");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoDBSession = require("connect-mongodb-session")(session);
const { ApolloServer , PubSub} = require('apollo-server');
const resolvers = require('./graphql/resolvers'); 
const typeDefs=require('./graphql/typeDefs');

var authRouter = require("./routes/auth");
var mailRouter = require("./routes/mail");
var geoRouter = require("./routes/fahed/geoPoints");
var usersRouter = require("./routes/fahed/users");
var companiesWaitRouter = require("./routes/fahed/companiesWait");
//*********************************ahmmed routess********************* */
var livreurRouter = require("./routes/ahmed/livreur");
var deliveryRouter = require("./routes/ahmed/delivery");
var VehiculeRouter = require("./routes/Raed/vehicules");
var admindelivery = require("./routes/ahmed/admindelivery");
var circuit = require("./routes/ahmed/circuit");
var chekboxRouter = require("./routes/ahmed/checkbox");
var sendpointRouter = require("./routes/ahmed/sendpoint");

// eya
var providerRouter = require("./routes/Provider");
var livraisonRouter = require("./routes/Livraison");

//takwa
var freeDeliveryRouter = require('./routes/freeDelivery');
var smsRouter = require('./routes/sms');
var claimRouter = require('./routes/claim');
var conversationRouter = require('./routes/conversations');
var messageRouter = require('./routes/messages');



const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context:({req}) => ({req,pubsub})
});






app.use(express.json());
app.use(express.static("frontend/build"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({ origin: process.env.URLCORS, credentials: true }));

mongoose
  .connect(
    "mongodb+srv://admin:admin@mabase.jnjfd.mongodb.net/mabase?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    }
  )
  .then((res) => console.log("je suis connecter avec mongo"));


mongoose.set("useFindAndModify", false);
const store = new MongoDBSession({
  uri:
    "mongodb+srv://admin:admin@mabase.yc6od.mongodb.net/mabase?retryWrites=true&w=majority",
  collection: "mySession",
});

app.use(
  session({
    secret: "key to sign in",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60000,
      httpOnly: false,
    },
    store: store,
  })
);

app.use("/users", usersRouter);
app.use("/compwait", companiesWaitRouter);
app.use("/auth", authRouter);
app.use("/mail", mailRouter);
app.use("/geo", geoRouter);
app.use("/livreur", livreurRouter);
app.use("/delivery", deliveryRouter);
app.use("/vehicules", VehiculeRouter);
app.use(express.static("routes/images/"));
app.use("/adminpassdelivery", admindelivery);
app.use("/chekbox", chekboxRouter);
app.use("/circuit", circuit);
app.use("/getpoints", sendpointRouter);
app.get("/api/youtube", (req, res) => {
  res.send("hello we are there");
});

// eya
app.use("/provider", providerRouter);
app.use("/livraison", livraisonRouter);

//takwa
app.use('/freeDelivery',freeDeliveryRouter)
app.use('/sms',smsRouter)
app.use('/claim',claimRouter)
app.use('/conversations',conversationRouter)
app.use('/messages',messageRouter)







const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`le serveur est lancé sur ${PORT}`);
});
app.get("/*", (_, res) => {
  res.sendFile(path.join(__dirname, "./frontend/build/index.html"));
});
expressListRoutes(app, { prefix: "" });

