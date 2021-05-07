const mongoose = require('mongoose')
const Schema = mongoose.Schema

const circuitSchema = new Schema({
    name : {
        type : String,
        required : [true, "Name required"]
    },
    
    departure : {
      type : String,
      required : [true, 'Departure required']
    },

    destinations : {
        type : [],
        required : [true, 'Destinations required']
      },

    start : {
      type : {},
      require : [true, 'Start point required'],
    },

    waypoints : {
        type : [],
        require : [true, 'Points Destinations required'],
      },
    iduser:{
        type : String,
        required : [true, 'User creator required'],
    },
    date : {
      type : Date
    },
    
})

module.exports = mongoose.model('circuit', circuitSchema)