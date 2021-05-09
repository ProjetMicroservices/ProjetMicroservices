const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LivraisonSchema = new Schema({
  fromPlace: {
    type: String,
  },
  destinationPlace: {
    type: String,
  },
  description: {
    type: String,
  },
  
  State: {
    type: String,
  },
  id_user: {
    type: mongoose.Types.ObjectId,
    required: false,
    ref: "user",
    autopopulate: true,
  },
  loc: {
    type: { type: String },
    coordinates: [Number],
  },
  locDestination: {
    type: { type: String },
    coordinates: [Number],
  },
  id_provider_affected: {
    type: mongoose.Types.ObjectId,
    required: false,
    ref: "provider",
    autopopulate: true,
  },
  id_user_affected: {
    type: mongoose.Types.ObjectId,
    required: false,
    ref: "user",
    autopopulate: true,
  },
  id_company_affected: {
    type: mongoose.Types.ObjectId,
    required: false,
    ref: "user",
    autopopulate: true,
  },
});
LivraisonSchema.index({ loc: "2dsphere" });
LivraisonSchema.plugin(require("mongoose-autopopulate"));

module.exports = mongoose.model("Livraison", LivraisonSchema);
