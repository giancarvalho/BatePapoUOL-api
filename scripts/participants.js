import dayjs from "dayjs";
import fs from "fs";
import path from "path";
import { addMessage } from "./messages.js";

const participantsPath = path.resolve("../backend/database/participants.json");
let participantsList = JSON.parse(fs.readFileSync(participantsPath));

function saveData(participants) {
    fs.writeFileSync(participantsPath, JSON.stringify(participants));
}

function addParticipant(participant) {
    const participantData = { ...participant, lastStatus: Date.now() };
    participantsList.push(participantData);
    addMessage({
        messageData: {
            from: participantData.name,
            to: "Todos",
            text: "entra na sala...",
            type: "message",
            time: dayjs(participantData.lastStatus).format("HH:mm:ss"),
        },
    });
    saveData(participantsList);
}

function isNameTaken(name) {
    return participantsList.some((participant) => participant.name === name);
}

function getParticipants() {
    return participantsList;
}

function updateList(newParticipantList) {
    participantsList = newParticipantList;
    return participantsList;
}

export { addParticipant, isNameTaken, getParticipants, saveData, updateList };
