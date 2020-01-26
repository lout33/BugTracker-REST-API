import { Request, Response } from "express";
import { Admin, User } from "./../../config/mongoose";

import {
  registerValidation,
  loginValidation
} from "../../validation/validation";

const router = require("express").Router();
const verify = require("./../auth/verifyToken");

var bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.get("/getListOfTickets", verify, async (req: any, res: Response) => {
  const objContext = {
    reqUserIdVerify: req.user._id
  };
  const docAdmin = await Admin.findById(objContext.reqUserIdVerify);

  try {
    let arrayTickets = [];
    for (let i = 0; i < docAdmin.projects.length; i++) {
      for (let j = 0; j < docAdmin.projects[i].tickets.length; j++) {
        arrayTickets.push(docAdmin.projects[i].tickets[j]);
      }
    }
    res.send(arrayTickets);
    console.log("list of tickets enviado al front");
  } catch (err) {
    res.status(400).send(err);
  }
});
// USER ------------------------------------->
router.post("/addPersonel", verify, async (req: any, res: Response) => {
  const objContext = {
    reqUserIdVerify: req.user._id,
    reqBodyEmail: req.body.email
  };

  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const emailExist = await Admin.findOne({
    personal: { $elemMatch: { email: req.body.email } }
  });

  if (emailExist) return res.status(400).send("Email already exist");

  var salt = bcrypt.genSaltSync(10);
  var hashedPasword = bcrypt.hashSync(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPasword
  });

  const docAdmin = await Admin.findById(objContext.reqUserIdVerify);
  docAdmin.personal.push(user);
  try {
    await docAdmin.save();
    for (let i = 0; i < docAdmin.personal.length; i++) {
      if (docAdmin.personal[i].email == objContext.reqBodyEmail) {
        res.send(docAdmin.personal);
        console.log("envio al personal recien creado");
        break;
      }
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
