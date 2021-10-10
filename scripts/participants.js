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

function validateParticipant(participant) {
    const validation = { isInvalid: false, errorMessage: "" };

    if (participant.name.length === 0) {
        validation.isInvalid = true;
        validation.errorMessage = "Name cannot be empty.";
    }

    if (isNameTaken(participant.name)) {
        validation.isInvalid = true;
        validation.errorMessage +=
            " This name is already being used by another user.";
    }

    return validation;
}

export {
    addParticipant,
    getParticipants,
    saveData,
    updateList,
    validateParticipant,
};
