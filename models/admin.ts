import * as mongoose from "mongoose";
import { projectSchema } from "./project";
import { userSchema } from "./user";

export var adminSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  personal: [userSchema],
  projects: [projectSchema]
});
