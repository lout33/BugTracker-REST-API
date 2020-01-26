import { Request, Response } from "express";
import { Admin } from "./../../config/mongoose";

const router = require("express").Router();
const verify = require("./../auth/verifyToken");

router.get("/myPersonel", verify, async (req: any, res: Response) => {
  try {
    const objContext = {
      reqUserIdVerify: req.user._id
    };

    const docAdmin = await Admin.findById(objContext.reqUserIdVerify);
    res.send(docAdmin.personal);
    console.log("lista de mi personal");
  } catch (err) {
    res.status(400).send(err);
    console.log(err);
  }
});

router.post("/assignUserRole", verify, async (req: any, res: Response) => {
  try {
    const objContext = {
      reqUserIdVerify: req.user._id,
      reqBodyUserId: req.body.userId,
      reqBodyRole: req.body.role
    };

    const docAdmin = await Admin.findById(objContext.reqUserIdVerify);

    for (let i = 0; i < docAdmin.personal.length; i++) {
      if (docAdmin.personal[i]._id == objContext.reqBodyUserId) {
        docAdmin.personal[i]["role"] = objContext.reqBodyRole;
        await docAdmin.save();
        break;
      }
    }
    res.send(docAdmin.personal);
    console.log("personal assignado success ");
  } catch (err) {
    res.status(400).send(err);
    console.log(err);
  }
});

router.get("/myDevs", verify, async (req: any, res: Response) => {
  try {
    const objContext = {
      reqUserIdVerify: req.user._id
    };

    const docAdmin = await Admin.findById(objContext.reqUserIdVerify);

    let personelDev = [];
    for (let i = 0; i < docAdmin.personal.length; i++) {
      if (docAdmin.personal[i].role == "developer") {
        personelDev.push(docAdmin.personal[i]);
      }
    }
    res.send(personelDev);
    console.log("lista de mis devs ");
  } catch (err) {
    res.status(400).send(err);
    console.log(err);
  }
});

router.post("/deletePersonalById", verify, async (req: any, res: Response) => {
  try {
    const objContext = {
      reqUserId: req.user._id,
      personnelId: req.body.personnelId
    };

    await Admin.updateOne(
      { _id: objContext.reqUserId },
      { $pull: { personal: { _id: objContext.personnelId } } }
    );

    res.send("eliminado personal");
    console.log("personal eliminado");
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
