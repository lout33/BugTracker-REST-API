import { Request, Response } from "express";
import { Admin, Project, Ticket, Comment } from "./../../config/mongoose";

const router = require("express").Router();
const verify = require("./../auth/verifyToken");

router.get("/getAssignedProjects", verify, async (req: any, res: Response) => {
  try {
    const adminpersonel = await Admin.findOne({
      personal: { $elemMatch: { _id: req.user._id } }
    });

    let myProjectsId: any = [];
    for (let i = 0; i < adminpersonel.personal.length; i++) {
      if (adminpersonel.personal[i]._id == req.user._id) {
        for (
          let j = 0;
          j < adminpersonel.personal[i].assignedProjects.length;
          j++
        ) {
          myProjectsId.push(adminpersonel.personal[i].assignedProjects[j].id);
        }
      }
    }

    let myProjectsAssigned = [];
    for (let l = 0; l < myProjectsId.length; l++) {
      for (let i = 0; i < adminpersonel.projects.length; i++) {
        if (adminpersonel.projects[i]._id == myProjectsId[l]) {
          myProjectsAssigned.push(adminpersonel.projects[i]);
        }
      }
    }
    res.send(myProjectsAssigned);
  } catch (err) {
    res.status(400).send(err);
    console.log(err);
  }
});

router.get(
  "/myDevsForAssignedProjects",
  verify,
  async (req: any, res: Response) => {
    try {
      const adminpersonel = await Admin.findOne({
        personal: { $elemMatch: { _id: req.user._id } }
      });

      let myProjectsId: any = [];
      for (let i = 0; i < adminpersonel.personal.length; i++) {
        if (adminpersonel.personal[i]._id == req.user._id) {
          for (
            let j = 0;
            j < adminpersonel.personal[i].assignedProjects.length;
            j++
          ) {
            myProjectsId.push(adminpersonel.personal[i].assignedProjects[j].id);
          }
        }
      }

      let devsForThisAssignedProjects = [];
      for (let k = 0; k < myProjectsId.length; k++) {
        for (let i = 0; i < adminpersonel.personal.length; i++) {
          for (
            let j = 0;
            j < adminpersonel.personal[i].assignedProjects.length;
            j++
          ) {
            if (
              adminpersonel.personal[i].role == "developer" &&
              adminpersonel.personal[i].assignedProjects[j].id ==
                myProjectsId[k]
            ) {
              devsForThisAssignedProjects.push(adminpersonel.personal[i]);
            }
          }
        }
      }

      let arrayWithUniqueDevs = [...new Set(devsForThisAssignedProjects)];

      res.send(arrayWithUniqueDevs);
    } catch (err) {
      res.status(400).send(err);
    }
  }
);

module.exports = router;
