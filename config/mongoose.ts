import * as mongoose from "mongoose";
import { projectSchema } from "./../models/project";
import { userSchema } from "./../models/user";
import { ticketSchema } from "./../models/ticket";
import { adminSchema } from "./../models/admin";
import { commentSchema } from "./../models/comment";
import { historySchema } from "./../models/history";

export var Project = mongoose.model<iProject>("project", projectSchema);

interface iProject extends mongoose.Document {
  name: string;
  description: string;
  creatorId: String;
  tickets: Array<any>;
  assignedPersonel: object;
}

export var User = mongoose.model<iUser>("user", userSchema);
interface iUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  assignedProjects: Array<any>;
}

export var Ticket = mongoose.model<iTicket>("ticket", ticketSchema);

interface iTicket extends mongoose.Document {
  name: string;
  description: string;
  assignedDeveloper: string;
}

export var History = mongoose.model<iHistory>("history", historySchema);

interface iHistory extends mongoose.Document {
  property: String;
  oldValue: any;
  newValue: any;
  dateChange: String;
}

export var Admin = mongoose.model<any>("admin", adminSchema);

interface iAdmin extends mongoose.Document {
  name: string;
  description: string;
  password: string;
  personal: Array<any>;
  projects: Array<any>;
}

export var Comment = mongoose.model<iComment>("comment", commentSchema);

interface iComment extends mongoose.Document {}
