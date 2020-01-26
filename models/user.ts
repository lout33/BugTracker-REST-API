import * as mongoose from "mongoose";
export var userSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  assignedProjects: { type: Array }, //id and name
  role: { type: String }
});
