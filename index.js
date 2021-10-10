import express from "express";
import cors from "cors";

import {
    addParticipant,
    getParticipants,
    isNameTaken,
} from "./scripts/participants.js";
import {
    addMessage,
    getMessages,
    validateMessage,
} from "./scripts/messages.js";
import confirmStatus from "./scripts/status.js";
const app = express();

app.use(express.json());
app.use(cors());

app.post("/participants", (req, res) => {
    const participant = req.body;

    if (participant.name.length === 0) {
        res.status(400).json({
            error: "Name cannot be empty",
        });
        return;
    }

    if (isNameTaken(participant.name)) {
        res.status(400).json({
            error: "This name is already being used by another user",
        });
        return;
    }

    addParticipant(participant);
    res.send("User joined the chat.");
});

app.get("/participants", (req, res) => {
    const participants = getParticipants();
    res.send(participants);
});

app.post("/messages", (req, res) => {
    const messageData = req.body;
    const username = req.headers.user;
    const messageValidation = validateMessage(messageData);

    if (messageValidation.isInvalid) {
        res.status(400).json({
            error: messageValidation.errorMessage,
        });
        return;
    }

    addMessage({ user: username, messageData });
    res.send("Message sent.");
});

app.get("/messages", (req, res) => {
    const limit = req.query.limit;
    const username = req.headers.user;

    const messages = getMessages(username, limit);

    res.send(messages);
});

app.post("/status", (req, res) => {
    const user = req.headers.user;

    const confirmation = confirmStatus(user);

    if (!confirmation) {
        res.status(400).json({
            error: "Invalid request. User doesn't exist or is no longer in the chat.",
        });
        return;
    }

    res.send("Ok.");
});

app.listen(4000);
