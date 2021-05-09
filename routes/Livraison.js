var express = require("express");
const Provider = require("../models/Provider");
const userModel = require("../models/user");

var router = express.Router();
const multer = require("multer");
var fs = require("fs");

const File = require("../models/file");
const { Console } = require("console");
const Livraison = require("../models/Livraison");
var nodemailer = require("nodemailer");
const user = require("../models/user");
var mongoose = require("mongoose");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "deliveryesprit@gmail.com",
    pass: "deliveryesprit12345",
  },
});

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "public");
  },
  filename: function (req, file, callback) {
    var imageUrl = file.fieldname + "-" + Date.now() + ".jpg";
    callback(null, imageUrl);
  },
});
const upload = multer({ storage: storage }).single("myfile");
router.post("/addLivraison", async (req, res) => {
  const longitude = req.body.long;
  const latitude = req.body.lat;
  const longitudeD = req.body.longDestination;
  const latitudeD = req.body.latDestination;
  let loc = {
    type: "Point",
    coordinates: [latitude, longitude],
  };
  let locD = {
    type: "Point",
    coordinates: [latitudeD, longitudeD],
  };
  const objet = {
    fromPlace: req.body.fromPlace,
    destinationPlace: req.body.destinationPlace,
    description: req.body.description,
    id_user: req.body.id_user,
    loc: loc,
    locDestination: locD,
    State: "Pending",
  };

  try {
    const livraison = new Livraison(objet);
    livraison.save();
    res.status(200).json({ msg: " Livraaison ajoutée avec succée" });
  } catch (error) {
    console.log("erreur ajout", error);
    res.status(400).json({ msg: " Livraaison errur ajout" });
  }
});
router.get("/getLivraisonWithUser", async (req, res) => {
  try {
    const livraison = await Livraison.find({
      State: { $ne: "Affected" },
    }).populate({
      path: "id_user",
      model: "user",
      select: "-password", // <-- this is the way
    });
    res.status(200).json({ livraison });
  } catch (error) {
    console.log("erreur ajout", error);
    res.status(400).json({ msg: " Livraison errur ajout" });
  }
});
router.post("/getLivraisonsByProvider", async (req, res) => {
  try {
    const livraison = await Livraison.find({
      id_user_affected: req.body.idProvdier,
      // id_livraison_affected: { $ne: null },
    })
      .populate({
        path: "id_user_affected",
        model: "user",
        select: "-password", // <-- this is the way
      })
      .populate({
        path: "id_provider_affected",
        model: "provider",
      });
    res.status(200).json({ livraison });
  } catch (error) {
    console.log("erreur ajout", error);
    res.status(400).json({ msg: " Livraaison errur ajout" });
  }
});
router.post("/getLivraisonsByCustomer", async (req, res) => {
  try {
    const livraison = await Livraison.find({
      id_user: req.body.id,
      // id_livraison_affected: { $ne: null },
    })
      .populate({
        path: "id_user_affected",
        model: "user",
        select: "-password", // <-- this is the way
      })
      .populate({
        path: "id_provider_affected",
        model: "provider",
      });
    res.status(200).json({ livraison });
  } catch (error) {
    console.log("erreur ajout", error);
    res.status(400).json({ msg: " Livraaison errur ajout" });
  }
});
router.post("/getLivraisonsByCompany", async (req, res) => {
  try {
    const livraison = await Livraison.find({
      id_company_affected: req.body.id,
      State: "Affected",
    })
      .populate({
        path: "id_user_affected",
        model: "user",
        select: "-password", // <-- this is the way
      })
      .populate({
        path: "id_provider_affected",
        model: "provider",
      });
    res.status(200).json({ livraison });
  } catch (error) {
    console.log("erreur ajout", error);
    res.status(400).json({ msg: " Livraaison errur ajout" });
  }
});
router.put("/affecterLivraison", async (req, res) => {
  try {
    const livraison = await Livraison.findById(req.body.idLivraison);
    console.log("affect ajout", livraison);

    livraison.id_provider_affected = req.body.idProvdier;
    livraison.id_company_affected = req.body.idCompany;
    livraison.State = "Affected";

    const provider = await Provider.findById(req.body.idProvdier);
    livraison.id_user_affected = provider.id_user;

    const users = await user.findById(provider.id_user);
    //send mail
    var mailOptions = {
      from: "deliveryesprit@gmail.com",
      to: users.email,
      subject: "A delivery as been affected to you",
      text: `A new delivery has been affected to you.`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    provider.id_livraison_affected = req.body.idLivraison;
    provider.PackageSize = provider.PackageSize - 1;

    await livraison.save();
    await provider.save();

    await res.status(200).json({ data: livraison });
  } catch (error) {
    console.log("affect ajout", error);
    res.status(400).json({ msg: "liraison not found" });
  }
});
router.post("/getNombreDeliveryByProviderBySociete", async (req, res) => {
  const arrayResuult = [];
  const pipeline = [
    {
      $match: {
        id_company_affected: mongoose.Types.ObjectId(req.body.id),
      },
    },
    {
      $group: {
        _id: "$id_user_affected",
        count: { $sum: 1 },
      },
    },
  ];
  // You have to be in an async function to await like this
  try {
    const result = await Livraison.aggregate(pipeline).then(async (ress) => {
      for (let item of ress) {
        const users = await user.findById(item._id);
        arrayResuult.push({ name: users.username, count: item.count });
        console.log(arrayResuult);
      }

      console.log(arrayResuult);
      res.send({ data: arrayResuult });
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/getNombreBylivraison", async (req, res) => {
  try {
    const livraisonn = await Livraison.find().count();
    res.status(200).json({ livraisonn });
  } catch (error) {
    console.log("erreur nbr livr", error);
    res.status(400).json({ msg: " Livraaison errur nbr" });
  }
});

router.post("/getNombreByProvider", async (req, res) => {
  provider = 0;
  const pipeline = [
    {
      $match: {
        id_company_affected: mongoose.Types.ObjectId(req.body.id),
      },
    },
    {
      $group: {
        _id: "$id_user_affected",
        count: { $sum: 1 },
      },
    },
  ];
  // You have to be in an async function to await like this
  try {
    const result = await Livraison.aggregate(pipeline).then(async (ress) => {
      for (let item of ress) {
        const users = await user.findById(item._id);
        if (users != null) {
          provider = provider + 1;
        }
      }

      res.send({ provider });
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
