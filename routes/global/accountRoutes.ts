import express, { Request, Response } from "express";
import { Admin } from "./../../config/mongoose";
const router = require("express").Router();
const verify = require("./../auth/verifyToken");

router.get("/myAccount", verify, async (req: any, res: Response) => {
  const objContext = {
    reqUserIdVerify: req.user._id,
    reqBodyUserId: req.body.userId
  };
  const docAdmin = await Admin.findById(objContext.reqUserIdVerify);

  try {
    if (!docAdmin) {
      const docAdmin = await Admin.findOne({
        personal: { $elemMatch: { _id: objContext.reqUserIdVerify } }
      });

      for (let i = 0; i < docAdmin.personal.length; i++) {
        if (docAdmin.personal[i]._id == objContext.reqUserIdVerify) {
          res.send(docAdmin.personal[i]);
          return;
        }
      }
    } else {
      res.send(docAdmin);
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
