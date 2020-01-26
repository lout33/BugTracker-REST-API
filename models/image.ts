import * as mongoose from "mongoose";
export var imageSchema = new mongoose.Schema({
  url: {
    type: String
  },
  filename: {
    type: String
  },
  imageDescription: {
    type: String
  },
  idImageCloud: {
    type: String
  },
  updatedAt: {
    type: Date
  },
  uploaderName: {
    type: String
  },
  uploaderId: {
    type: String
  }
});
