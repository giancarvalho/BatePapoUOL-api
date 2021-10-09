import express from "express";
import cors from "cors";
import fs from "fs";

import {
    addParticipant,
    getParticipants,
    isNameTaken,
} from "./scripts/participants.js";

const app = express();
app.use(express.json());

app.post("/participants", (req, res) => {
    const participant = req.body;
    if (isNameTaken(participant.name)) {
        res.status(400).json({
            error: "This name is already being used by another user",
        });
    }

    addParticipant(participant);
    res.send("User joined the chat.");
});

app.get("/participants", (req, res) => {
    const participants = getParticipants();
    res.send(participants);
});

app.listen(4000);
