import { Response } from "express";
import { Admin } from "./../../config/mongoose";

const router = require("express").Router();
const verify = require("./../auth/verifyToken");

router.get("/getAssignedProjects", verify, async (req: any, res: Response) => {
  const adminpersonel = await Admin.findOne({
    personal: { $elemMatch: { _id: req.user._id } }
  });

  try {
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

module.exports = router;
