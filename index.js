import express from "express";
import cors from "cors";
import dayjs from "dayjs";

const app = express();
app.use(express.json());

app.post("/participants", (req, res) => {
    const participant = req.body;
    if (isNameTaken(participant.name)) {
        res.status(400).json({
            error: "This name is already being used by another user",
        });
    }

    const participantData = { ...participant, lastStatus: Date.now() };
    participants.push(participantData);
    messages.push({
        from: participantData.name,
        to: "Todos",
        text: "entra na sala...",
        type: "status",
        time: dayjs(participantData.lastStatus).format("HH:MM:SS"),
    });
    res.send(messages);
});

app.get("/participants", (req, res) => {
    res.send(participants);
});

app.listen(4000);

function isNameTaken(name) {
    return participants.some((participant) => participant.name === name);
}

const participants = [];

const messages = [];
