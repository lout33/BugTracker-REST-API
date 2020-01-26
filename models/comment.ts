import * as mongoose from "mongoose";
export var commentSchema = new mongoose.Schema({
  commenterId: {
    type: String
  },
  commenterName: {
    type: String
  },
  message: {
    type: String
  },
  createAt: {
    type: Date
  }
});
