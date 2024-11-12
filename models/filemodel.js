const mongoose = require('mongoose')

const coverImageBasePath = 'uploads/ModelCovers'

const fileSchema = mongoose.Schema({
    title: {
      type: String,
      required: [true],
    },
    description:{
      type: String,
      required:[true]
    },
    link: {
      type: String,
      required: [true]
    },
    printTime: {
        type: String,
        required: [true]
    },
    material:{
        type: String,
        required: [true]
    },
    glue:{
        type: Boolean,
        requied: [true]
    },
    pieces:{
        type: Number,
        required: [true]
    },
    weight:{
        type: String,
        required: [true]
    },
    coverImageNames: {
      type: [String],
      required: [true]
    }

  })
  
  const models = mongoose.model("models", fileSchema);
  
  module.exports = models;
  module.exports.coverImageBasePath = coverImageBasePath;