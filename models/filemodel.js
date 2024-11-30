const mongoose = require('mongoose')

const coverImageBasePath = 'uploads/ModelCovers';
const stlFileBasePath = 'uploads/STLFiles';
const chassisImageBasePath = 'uploads/ChassisImages';

const fileSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true]
  },
  description: {
    type: String,
    required: [true]
  },
  link: {
    type: String,
    required: [true]
  },
  type: {
    type: String,
    required: [true]
  },
  printTime: {
    type: String,
    required: [true]
  },
  material: {
    type: String,
    required: [true]
  },
  glue: {
    type: Boolean,
    requied: [true]
  },
  pieces: {
    type: Number,
    required: [true]
  },
  weight: {
    type: String,
    required: [true]
  },
  price: {
    type: Number
  },
  coverImageNames: {
    type: [String],
    required: [true]
  },
  stlFileNames: {
    type: [String],
    required: [true]
  },
  chassisImageNames: {
    type: [String],
    required: [true]
  }
})

const models = mongoose.model("models", fileSchema);

module.exports = models;
module.exports.coverImageBasePath = coverImageBasePath;
module.exports.stlFileBasePath = stlFileBasePath;
module.exports.chassisImageBasePath = chassisImageBasePath;