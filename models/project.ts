import * as mongoose from "mongoose";
import { ticketSchema } from "./ticket";
export var projectSchema = new mongoose.Schema({
  name: {
    type: String
  },
  description: {
    type: String
  },

  tickets: [ticketSchema]
});
