import * as mongoose from "mongoose";
export var historySchema = new mongoose.Schema({
  property: {
    type: String
  },
  oldValue: {
    type: String
  },
  newValue: {
    type: String
  },
  dateChange: {
    type: String
  },
  metaData: {
    type: Array
  }
});
