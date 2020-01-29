import * as mongoose from "mongoose";
import { commentSchema } from "./comment";
import { imageSchema } from "./image";
import { historySchema } from "./history";

export var ticketSchema = new mongoose.Schema({
  name: {
    type: String
  },
  description: {
    type: String
  },

  assignedDeveloper: {
    type: Object //Id and Name
  },
  submitter: {
    type: Object //Id and Name
  },
  byProjectName: {
    type: Object
  },
  priority: {
    type: String
  },
  status: {
    type: String
  },
  type: {
    type: String
  },
  comments: [commentSchema],
  image: [imageSchema], //Path , Name //Id //coment //create at
  createdAt: {
    type: String
  },
  updatedAt: {
    type: String
  },
  historial: [historySchema]
});
