import { Request, Response } from "express";
import {
  Admin,
  Project,
  Ticket,
  Comment,
  History
} from "../../config/mongoose";

const router = require("express").Router();
const verify = require("./../auth/verifyToken");

router.post("/getProjectById", verify, async (req: any, res: Response) => {
  console.log("yea");

  try {
    const objContext = {
      reqUserIdVerify: req.user._id
    };
    const docAdmin = await Admin.findById(objContext.reqUserIdVerify);

    for (let i = 0; i < docAdmin.projects.length; i++) {
      if (docAdmin.projects[i]._id == req.body.projectId) {
        res.status(200).json(docAdmin.projects[i]);
        break;
      }
    }
  } catch (err) {
    res.status(400).send(err);
  }
});
module.exports = router;
