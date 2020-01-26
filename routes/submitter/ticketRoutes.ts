import { Request, Response } from "express";
import { Admin, Project, Ticket, Comment } from "./../../config/mongoose";

const router = require("express").Router();
const verify = require("./../auth/verifyToken");

router.get(
  "/getTicketsCreatedBySubmitter",
  verify,
  async (req: any, res: Response) => {
    try {
      const data = await Admin.findOne({
        personal: { $elemMatch: { _id: req.user._id } }
      });

      let myTickets = [];
      for (let i = 0; i < data.projects.length; i++) {
        for (let j = 0; j < data.projects[i].tickets.length; j++) {
          if (data.projects[i].tickets[j].submitter.id == req.user._id) {
            myTickets.push(data.projects[i].tickets[j]);
          }
        }
      }
      res.send(myTickets);
      console.log("getMyTickets creados TIcket ");
    } catch (err) {
      res.status(400).send(err);
    }
    return;
  }
);

module.exports = router;
