"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
var cors = require("cors");
const userRoutes = require("./routes/userRoutes");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");

const { urlencoded, json } = require("body-parser");

dotenv.config();
connectDB();
const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  console.log("1");
  res.status(200).send({ message: "success" });
});

app.post("/messaging-webhook", (req, res) => {
  let body = req.body;
  console.log(req.body);

  console.log(`\u{1F7EA} Received webhook:`);
  console.dir(body, { depth: null });

  if (body.object === "page") {
    // Returns a '200 OK' response to all requests
    res.status(200).send("EVENT_RECEIVED");
    // Iterate over each entry - there may be multiple if batched

    // body.entry.forEach(async function (entry) {
    //   if ("changes" in entry) {
    //     // Handle Page Changes event
    //     let receiveMessage = new Receive();
    //     if (entry.changes[0].field === "feed") {
    //       let change = entry.changes[0].value;
    //       switch (change.item) {
    //         case "post":
    //           return receiveMessage.handlePrivateReply(
    //             "post_id",
    //             change.post_id
    //           );
    //         case "comment":
    //           return receiveMessage.handlePrivateReply(
    //             "comment_id",
    //             change.comment_id
    //           );
    //         default:
    //           console.warn("Unsupported feed change type.");
    //           return;
    //       }
    //     }
    //   }

    //   // Iterate over webhook events - there may be multiple
    //   entry.messaging.forEach(async function (webhookEvent) {
    //     // Discard uninteresting events
    //     if ("read" in webhookEvent) {
    //       console.log("Got a read event");
    //       return;
    //     } else if ("delivery" in webhookEvent) {
    //       console.log("Got a delivery event");
    //       return;
    //     } else if (webhookEvent.message && webhookEvent.message.is_echo) {
    //       console.log(
    //         "Got an echo of our send, mid = " + webhookEvent.message.mid
    //       );
    //       return;
    //     }

    //     // Get the sender PSID
    //     let senderPsid = webhookEvent.sender.id;
    //     // Get the user_ref if from Chat plugin logged in user
    //     let user_ref = webhookEvent.sender.user_ref;
    //     // Check if user is guest from Chat plugin guest user
    //     let guestUser = isGuestUser(webhookEvent);

    //     if (senderPsid != null && senderPsid != undefined) {
    //       if (!(senderPsid in users)) {
    //         if (!guestUser) {
    //           // Make call to UserProfile API only if user is not guest
    //           let user = new User(senderPsid);
    //           GraphApi.getUserProfile(senderPsid)
    //             .then((userProfile) => {
    //               user.setProfile(userProfile);
    //             })
    //             .catch((error) => {
    //               // The profile is unavailable
    //               console.log(JSON.stringify(body));
    //               console.log("Profile is unavailable:", error);
    //             })
    //             .finally(() => {
    //               console.log("locale: " + user.locale);
    //               users[senderPsid] = user;
    //               i18n.setLocale("en_US");
    //               console.log(
    //                 "New Profile PSID:",
    //                 senderPsid,
    //                 "with locale:",
    //                 i18n.getLocale()
    //               );
    //               return receiveAndReturn(
    //                 users[senderPsid],
    //                 webhookEvent,
    //                 false
    //               );
    //             });
    //         } else {
    //           setDefaultUser(senderPsid);
    //           return receiveAndReturn(users[senderPsid], webhookEvent, false);
    //         }
    //       } else {
    //         i18n.setLocale(users[senderPsid].locale);
    //         console.log(
    //           "Profile already exists PSID:",
    //           senderPsid,
    //           "with locale:",
    //           i18n.getLocale()
    //         );
    //         return receiveAndReturn(users[senderPsid], webhookEvent, false);
    //       }
    //     } else if (user_ref != null && user_ref != undefined) {
    //       // Handle user_ref
    //       setDefaultUser(user_ref);
    //       return receiveAndReturn(users[user_ref], webhookEvent, true);
    //     }
    //   });
    // });

    // Determine which webhooks were triggered and get sender PSIDs and locale, message content and more.
  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
});

app.get("/messaging-webhook", (req, res) => {
  // Parse the query params
  console.log(req);
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];
  console.log("token", token);
  if (mode && token) {
    if (mode === "subscribe") {
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
      console.log("4");
    } else {
      res.sendStatus(403);
    }
  }
});

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
