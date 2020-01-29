import { Request, Response } from "express";
import {
  Admin,
  Project,
  Ticket,
  Comment,
  History
} from "./../../config/mongoose";

const router = require("express").Router();
const verify = require("./../auth/verifyToken");

router.get(
  "/getTicketsByAssignedManager",
  verify,
  async (req: any, res: Response) => {
    const objContext = {
      reqUserIdVerify: req.user._id
    };

    const adminpersonel = await Admin.findOne({
      personal: { $elemMatch: { _id: objContext.reqUserIdVerify } }
    });

    try {
      let myTicketsAssigned: any = [];
      for (let i = 0; i < adminpersonel.projects.length; i++) {
        for (let j = 0; j < adminpersonel.projects[i].tickets.length; j++) {
          if (adminpersonel.projects[i].tickets[j].assignedDeveloper) {
            if (
              adminpersonel.projects[i].tickets[j].assignedDeveloper.devId ===
              objContext.reqUserIdVerify
            ) {
              myTicketsAssigned.push(adminpersonel.projects[i].tickets[j]);
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

router.post(
  "/updateTicketStatusByDev",
  verify,
  async (req: any, res: Response) => {
    let docData = await Admin.findOne({
      personal: { $elemMatch: { _id: req.user._id } }
    });

    for (let i = 0; i < docData.projects.length; i++) {
      for (let j = 0; j < docData.projects[i].tickets.length; j++) {
        if (docData.projects[i].tickets[j]._id == req.body.ticketId) {
          //////////////Add Histoy ///////////////////////

          const history = new History({
            property: "Change Status ",
            oldValue: docData.projects[i].tickets[j].status,
            newValue: req.body.status,
            dateChange: new Date().toLocaleString(),
            metaData: [{ devId: req.user._id }]
          });

          // console.log(history);
          docData.projects[i].tickets[j].historial.push(history);
          await docData.save();
          // console.log(docAdmin);

          //////////////Add History ///////////////////////

          docData.projects[i].tickets[j].status = req.body.status;
          try {
            await docData.save();
            res.send(docData.projects[i].tickets[j]);
            console.log("projecto creado");
          } catch (err) {
            res.status(400).send(err);
          }
        }
      }
    }
  }
);

module.exports = router;
