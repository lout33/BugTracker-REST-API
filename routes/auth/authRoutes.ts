import { Request, Response } from "express";
import { Admin, User } from "../../config/mongoose";
import {
  registerValidation,
  loginValidation
} from "../../validation/validation";

const router = require("express").Router();
var bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verify = require("./verifyToken");

// ------------------------LOGIN AND REGISTRO-------------------------->

router.post("/login", async (req: Request, res: Response) => {
  try {
    const objContext = {
      reqBodyEmail: req.body.email,
      reqBodyPassword: req.body.password
    };

    const { error } = loginValidation(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const docAdmin = await Admin.findOne({ email: objContext.reqBodyEmail });
    console.log(docAdmin);

    if (!docAdmin) {
      try {
        const adminpersonel = await Admin.findOne({
          personal: { $elemMatch: { email: objContext.reqBodyEmail } }
        });

        if (!adminpersonel) {
          console.log("Email de personal is wrong");
          return res.status(400).send("Email de personal is wrong");
        }
        console.log(adminpersonel);

        for (let i = 0; i < adminpersonel.personal.length; i++) {
          if (adminpersonel.personal[i].email == objContext.reqBodyEmail) {
            const validPassNoAdmin = await bcrypt.compare(
              objContext.reqBodyPassword,
              adminpersonel.personal[i].password
            );
            if (!validPassNoAdmin) {
              return res.status(400).send("Invalid password");
            }

            const tokenNoAdmin = jwt.sign(
              { _id: adminpersonel.personal[i]._id },
              process.env.TOKEN_SECRET
              
            );

            res.header("auth-token", tokenNoAdmin).send(tokenNoAdmin);
            return;
          }
        }
      } catch (error) {
        res.send(error);
        console.log(error);
      }
      res.status(400).send("Email de admin is wrong");
    }

    const validPass = await bcrypt.compare(
      objContext.reqBodyPassword,
      docAdmin.password
    );
    if (!validPass) return res.status(400).send("Invalid password");
    const token = jwt.sign({ _id: docAdmin._id }, process.env.TOKEN_SECRET);
    if (!token) return res.status(400).send("Tu token esta raro");
    res.header("auth-token", token).send(token);
  } catch (error) {
    // res.send(error);
    console.log(error);
  }
});
//ADMIN  ------------------------------------->

router.post("/register", async (req: Request, res: Response) => {
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const emailExist = await Admin.findOne({ email: req.body.email });

  if (emailExist) return res.status(400).send("Email already exist");

  var salt = bcrypt.genSaltSync(10);
  var hashedPasword = bcrypt.hashSync(req.body.password, salt);

  const admin = new Admin({
    name: req.body.name,
    email: req.body.email,
    password: hashedPasword
  });

  try {
    const savedUser = await admin.save();
    const token = jwt.sign({ _id: savedUser._id }, process.env.TOKEN_SECRET);
    res.header("auth-token", token).send(token);
    console.log("usuario creado");
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
