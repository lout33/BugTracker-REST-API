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

// GENERAL ROUTES ------------------------------------------------------------>

router.post("/createTicket", verify, async (req: any, res: Response) => {
  try {
    let docAdmin = await Admin.findById(req.user._id);

    if (!docAdmin) {
      docAdmin = await Admin.findOne({
        personal: { $elemMatch: { _id: req.user._id } }
      });

      for (let i = 0; i < docAdmin.projects.length; i++) {
        if (docAdmin.projects[i]._id == req.body.projectId) {
          const ticket = new Ticket({
            name: req.body.name,
            description: req.body.description,
            priority: req.body.priority,
            type: req.body.type,
            status: "informado",
            submitter: { id: req.user._id, name: docAdmin.name },
            createdAt: new Date().toLocaleString(),
            byProjectName: docAdmin.projects[i].name
          });
          docAdmin.projects[i].tickets.push(ticket);

          await docAdmin.save();
          let arrayTicketsCreatedByMe = [];
          for (let i = 0; i < docAdmin.projects.length; i++) {
            for (let j = 0; j < docAdmin.projects[i].tickets.length; j++) {
              if (
                docAdmin.projects[i].tickets[j].submitter.id == req.user._id
              ) {
                arrayTicketsCreatedByMe.push(docAdmin.projects[i].tickets[j]);
              }
            }
          }
          res.send(arrayTicketsCreatedByMe);
          console.log("created TIcket sumitter");
        }
      }
    } else {
      for (let i = 0; i < docAdmin.projects.length; i++) {
        if (docAdmin.projects[i]._id == req.body.projectId) {
          const ticket = new Ticket({
            name: req.body.name,
            description: req.body.description,
            priority: req.body.priority,
            type: req.body.type,
            status: "informado",
            submitter: { id: req.user._id, name: docAdmin.name },
            createdAt: new Date().toLocaleString(),
            byProjectName: docAdmin.projects[i].name
          });
          docAdmin.projects[i].tickets.push(ticket);
          await docAdmin.save();
          let arrayTickets = [];

          for (let i = 0; i < docAdmin.projects.length; i++) {
            for (let j = 0; j < docAdmin.projects[i].tickets.length; j++) {
              arrayTickets.push(docAdmin.projects[i].tickets[j]);
            }
          }
          console.log("created TIcket admin ");
          res.send(arrayTickets);
          console.log(arrayTickets);
        }
      }
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/updateTicketById", verify, async (req: any, res: Response) => {
  let docAdmin = await Admin.findById(req.user._id);

  if (!docAdmin) {
    docAdmin = await Admin.findOne({
      personal: { $elemMatch: { _id: req.user._id } }
    });
    for (let i = 0; i < docAdmin.projects.length; i++) {
      for (let j = 0; j < docAdmin.projects[i].tickets.length; j++) {
        if (docAdmin.projects[i].tickets[j]._id == req.body.ticketId) {
          docAdmin.projects[i].tickets[j].name = req.body.name;
          docAdmin.projects[i].tickets[j].description = req.body.description;
          docAdmin.projects[i].tickets[j].priority = req.body.priority;
          docAdmin.projects[i].tickets[j].type = req.body.type;
          docAdmin.projects[i].tickets[j].status = req.body.status;
          docAdmin.projects[i].tickets[
            j
          ].updatedAt = new Date().toLocaleString();
          try {
            await docAdmin.save();
            res.send(docAdmin.projects[i].tickets[j]);
            console.log("UPDATED TIcket ");
          } catch (err) {
            res.status(400).send(err);
            console.log(err);
          }
          return;
        }
      }
    }
  }

  for (let i = 0; i < docAdmin.projects.length; i++) {
    for (let j = 0; j < docAdmin.projects[i].tickets.length; j++) {
      if (docAdmin.projects[i].tickets[j]._id == req.body.ticketId) {
        docAdmin.projects[i].tickets[j].name = req.body.name;
        docAdmin.projects[i].tickets[j].description = req.body.description;
        docAdmin.projects[i].tickets[j].priority = req.body.priority;
        docAdmin.projects[i].tickets[j].type = req.body.type;
        docAdmin.projects[i].tickets[j].status = req.body.status;
        docAdmin.projects[i].tickets[j].updatedAt = new Date().toLocaleString();
        try {
          await docAdmin.save();
          res.send(docAdmin.projects[i].tickets[j]);
          console.log("updated TIcket ");
        } catch (err) {
          res.status(400).send(err);
          console.log(err);
        }
        return;
      }
    }
  }
});

router.post("/getTicketById", verify, async (req: any, res: Response) => {
  let docAdmin = await Admin.findById(req.user._id);

  if (!docAdmin) {
    docAdmin = await Admin.findOne({
      personal: { $elemMatch: { _id: req.user._id } }
    });
  }

  for (let i = 0; i < docAdmin.projects.length; i++) {
    for (let j = 0; j < docAdmin.projects[i].tickets.length; j++) {
      if (docAdmin.projects[i].tickets[j]._id == req.body.ticketId) {
        // console.log(docAdmin.projects[i].tickets[j]);
        try {
          await docAdmin.save();
          res.send(docAdmin.projects[i].tickets[j]);
          console.log("list tot ticket success");
          return;
        } catch (err) {
          res.status(400).send(err);
        }
      }
    }
  }
});

router.post("/addCommentToTicket", verify, async (req: any, res: Response) => {
  const comment = new Comment({
    commenterId: req.body.commenter,
    commenterName: req.body.commenterName,
    message: req.body.message,
    createAt: new Date().toLocaleString()
  });

  let docAdmin = await Admin.findById(req.user._id);

  if (!docAdmin) {
    docAdmin = await Admin.findOne({
      personal: { $elemMatch: { _id: req.user._id } }
    });
  }
  for (let i = 0; i < docAdmin.projects.length; i++) {
    for (let j = 0; j < docAdmin.projects[i].tickets.length; j++) {
      if (docAdmin.projects[i].tickets[j]._id == req.body.ticketId) {
        docAdmin.projects[i].tickets[j].comments.push(comment);
        try {
          await docAdmin.save();
          res.send(docAdmin.projects[i].tickets[j]);
          console.log("addcoemnt tot ticket success");
          break;
        } catch (err) {
          res.status(400).send(err);
        }
      }
    }
  }
});

router.post("/addImageToTicket", verify, async (req: any, res: Response) => {
  let docAdmin = await Admin.findById(req.user._id);

  if (!docAdmin) {
    docAdmin = await Admin.findOne({
      personal: { $elemMatch: { _id: req.user._id } }
    });
  }
  for (let i = 0; i < docAdmin.projects.length; i++) {
    for (let j = 0; j < docAdmin.projects[i].tickets.length; j++) {
      if (docAdmin.projects[i].tickets[j]._id == req.body.ticketId) {
        docAdmin.projects[i].tickets[j].image.push({
          url: req.body.url,
          filename: req.body.filename,
          imageDescription: req.body.imageDescription,
          idImageCloud: req.body.id,
          uploaderName: req.body.uploaderName,
          uploaderId: req.body.uploaderId,
          updatedAt: new Date().toLocaleString()
        });
        try {
          await docAdmin.save();
          res.send(docAdmin.projects[i].tickets[j]);
          console.log("addcoemnt tot ticket success");
          break;
        } catch (err) {
          res.status(400).send(err);
        }
      }
    }
  }
});

router.post("/deleteTicketById", verify, async (req: any, res: Response) => {
  try {
    let docAdmin = await Admin.findById(req.user._id);

    if (!docAdmin) {
      docAdmin = await Admin.findOne({
        personal: { $elemMatch: { _id: req.user._id } }
      });

      for (let i = 0; i < docAdmin.projects.length; i++) {
        for (let j = 0; j < docAdmin.projects[i].tickets.length; j++) {
          if (docAdmin.projects[i].tickets[j]._id == req.body.ticketId) {
            docAdmin.projects[i].tickets.splice(j, 1);
            const savedRole = await docAdmin.save();

            // ----------------------------metodo para obtener los tickets assignados -----------------------------------
            let myProjectsId: any = [];
            for (let i = 0; i < docAdmin.personal.length; i++) {
              if (docAdmin.personal[i]._id == req.user._id) {
                for (
                  let j = 0;
                  j < docAdmin.personal[i].assignedProjects.length;
                  j++
                ) {
                  myProjectsId.push(
                    docAdmin.personal[i].assignedProjects[j].id
                  );
                }
              }
            }

            let myTicketsAssigned: any = [];
            for (let k = 0; k < myProjectsId.length; k++) {
              for (let i = 0; i < docAdmin.projects.length; i++) {
                if (docAdmin.projects[i]._id == myProjectsId[k]) {
                  for (
                    let j = 0;
                    j < docAdmin.projects[i].tickets.length;
                    j++
                  ) {
                    myTicketsAssigned.push(docAdmin.projects[i].tickets[j]);
                  }
                }
              }
            }
            res.send(myTicketsAssigned);
            // ----------------------------metodo para obtener los tickets assignados -----------------------------------
            console.log("eliminado assignacion ");
            break;
          }
        }
      }
    }

    for (let i = 0; i < docAdmin.projects.length; i++) {
      for (let j = 0; j < docAdmin.projects[i].tickets.length; j++) {
        if (docAdmin.projects[i].tickets[j]._id == req.body.ticketId) {
          docAdmin.projects[i].tickets.splice(j, 1);

          const savedRole = await docAdmin.save();
          let arrayTickets = [];
          for (let i = 0; i < savedRole.projects.length; i++) {
            for (let j = 0; j < savedRole.projects[i].tickets.length; j++) {
              arrayTickets.push(savedRole.projects[i].tickets[j]);
            }
          }
          res.send(arrayTickets);
          console.log("eliminado assignacion ");
          break;
        }
      }
    }
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

router.post("/assignTicketToDev", verify, async (req: any, res: Response) => {
  let docAdmin = await Admin.findById(req.user._id);

  if (!docAdmin) {
    docAdmin = await Admin.findOne({
      personal: { $elemMatch: { _id: req.user._id } }
    });

    let devName: any;
    for (let k = 0; k < docAdmin.personal.length; k++) {
      if (docAdmin.personal[k]._id == req.body.devId) {
        devName = docAdmin.personal[k].name;
        break;
      }
    }

    for (let i = 0; i < docAdmin.projects.length; i++) {
      for (let j = 0; j < docAdmin.projects[i].tickets.length; j++) {
        if (docAdmin.projects[i].tickets[j]._id == req.body.ticketId) {
          try {
            //////////////Add Histoy ///////////////////////
            let oldDevName;
            if (docAdmin.projects[i].tickets[j]["assignedDeveloper"]) {
              oldDevName =
                docAdmin.projects[i].tickets[j]["assignedDeveloper"]["devName"];
            } else {
              oldDevName = "";
            }
            const history = new History({
              property: "Developer Ticket Assignment",
              oldValue: oldDevName,
              newValue: devName,
              dateChange: new Date().toLocaleString(),
              metaData: [
                docAdmin.projects[i].tickets[j]["assignedDeveloper"],
                { devId: req.body.devId, devName: devName }
              ]
            });

            // console.log(history);
            docAdmin.projects[i].tickets[j].historial.push(history);
            await docAdmin.save();
            // console.log(docAdmin);

            //////////////Add History ///////////////////////

            docAdmin.projects[i].tickets[j]["assignedDeveloper"] = {
              devId: req.body.devId,
              devName: devName
            };
            // const savedUser = await docAdmin.save();
            await docAdmin.save();

            // ----------------------------metodo para obtener los tickets assignados -----------------------------------

            try {
              let myProjectsId: any = [];
              for (let i = 0; i < docAdmin.personal.length; i++) {
                if (docAdmin.personal[i]._id == req.user._id) {
                  for (
                    let j = 0;
                    j < docAdmin.personal[i].assignedProjects.length;
                    j++
                  ) {
                    myProjectsId.push(
                      docAdmin.personal[i].assignedProjects[j].id
                    );
                  }
                }
              }

              let myTicketsAssigned: any = [];
              for (let k = 0; k < myProjectsId.length; k++) {
                for (let i = 0; i < docAdmin.projects.length; i++) {
                  if (docAdmin.projects[i]._id == myProjectsId[k]) {
                    for (
                      let j = 0;
                      j < docAdmin.projects[i].tickets.length;
                      j++
                    ) {
                      myTicketsAssigned.push(docAdmin.projects[i].tickets[j]);
                    }
                  }
                }
              }
              console.log("envio los tickets asignados ");

              res.send(myTicketsAssigned);
            } catch (err) {
              res.status(400).send(err);
              console.log(err);
            }
            // ----------------------------metodo para obtener los tickets assignados -----------------------------------
            console.log("enviar lista de tickes de los proyecots assignados ");
            return;
          } catch (err) {
            res.status(400).send(err);
          }
        }
        break;
      }
    }
  }
  // finding new dev name
  let devName: any;
  for (let k = 0; k < docAdmin.personal.length; k++) {
    if (docAdmin.personal[k]._id == req.body.devId) {
      devName = docAdmin.personal[k].name;
      break;
    }
  }

  for (let i = 0; i < docAdmin.projects.length; i++) {
    for (let j = 0; j < docAdmin.projects[i].tickets.length; j++) {
      if (docAdmin.projects[i].tickets[j]._id == req.body.ticketId) {
        try {
          console.log("guardand history admin ");

          //////////////Add Histoy ///////////////////////
          let oldDevName;
          if (docAdmin.projects[i].tickets[j]["assignedDeveloper"]) {
            oldDevName =
              docAdmin.projects[i].tickets[j]["assignedDeveloper"]["devName"];
          } else {
            oldDevName = "";
          }
          const history = new History({
            property: "Developer Ticket Assignment",
            oldValue: oldDevName,
            newValue: devName,
            dateChange: new Date().toLocaleString(),
            metaData: [
              docAdmin.projects[i].tickets[j]["assignedDeveloper"],
              { devId: req.body.devId, devName: devName }
            ]
          });

          // console.log(history);
          docAdmin.projects[i].tickets[j].historial.push(history);
          await docAdmin.save();
          // console.log(docAdmin);

          //////////////Add History ///////////////////////

          docAdmin.projects[i].tickets[j]["assignedDeveloper"] = {
            devId: req.body.devId,
            devName: devName
          };

          const savedUser = await docAdmin.save();

          let arrayTickets = [];
          for (let i = 0; i < savedUser.projects.length; i++) {
            for (let j = 0; j < savedUser.projects[i].tickets.length; j++) {
              arrayTickets.push(savedUser.projects[i].tickets[j]);
            }
          }
          res.send(arrayTickets);
          console.log("lista de tickers");
          return;
        } catch (err) {
          console.log(err);
          res.status(400).send(err);
        }
      }
    }
  }
});

module.exports = router;
