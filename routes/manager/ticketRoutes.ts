import { Request, Response } from "express";
import { Admin, Project, Ticket, Comment } from "./../../config/mongoose";

const router = require("express").Router();
const verify = require("./../auth/verifyToken");

router.get(
  "/getTicketsByAssignedProjects",
  verify,
  async (req: any, res: Response) => {
    const docAdmin = await Admin.findOne({
      personal: { $elemMatch: { _id: req.user._id } }
    });

    try {
      let myProjectsId: any = [];
      for (let i = 0; i < docAdmin.personal.length; i++) {
        if (docAdmin.personal[i]._id == req.user._id) {
          for (
            let j = 0;
            j < docAdmin.personal[i].assignedProjects.length;
            j++
          ) {
            myProjectsId.push(docAdmin.personal[i].assignedProjects[j].id);
          }
        }
      }

      let myTicketsAssigned: any = [];
      for (let k = 0; k < myProjectsId.length; k++) {
        for (let i = 0; i < docAdmin.projects.length; i++) {
          if (docAdmin.projects[i]._id == myProjectsId[k]) {
            for (let j = 0; j < docAdmin.projects[i].tickets.length; j++) {
              myTicketsAssigned.push(docAdmin.projects[i].tickets[j]);
            }
          }
        }
      }
      res.send(myTicketsAssigned);
    } catch (err) {
      res.status(400).send(err);
      console.log(err);
    }
  }
);

module.exports = router;
