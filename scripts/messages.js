import fs from "fs";
import path from "path";
import dayjs from "dayjs";
import { getParticipants } from "./participants.js";
const messagesPath = path.resolve("../backend/database/messages.json");
const messagesList = JSON.parse(fs.readFileSync(messagesPath));

function saveData() {
    fs.writeFileSync(messagesPath, JSON.stringify(messagesList));
}

function getMessages(user, limit) {
    const messages = filterMessages(user);
    return messages.slice(0, limit);
}

function addMessage({ user, messageData }) {
    if (user) {
        messagesList.push({
            ...messageData,
            from: user,
            time: dayjs(Date.now()).format("HH:mm:ss"),
        });
    } else {
        messagesList.push(messageData);
    }

    saveData();
}

function filterMessages(user) {
    const messages = messagesList.filter(
        (message) =>
            message.type === "message" ||
            message.to === user ||
            message.from === user
    );

    return messages;
}

function validateMessage(messageData) {
    const validation = { isInvalid: false, errorMessage: "" };

    if (messageData.to.length === 0 || messageData.text.length === 0) {
        validation.isInvalid = true;
        validation.errorMessage += " Text and recipient cannot be empty.";
    }

    if (
        messageData.type !== "message" &&
        messageData.type !== "private_message"
    ) {
        validation.isInvalid = true;
        validation.errorMessage += " Text and recipient cannot be empty.";
    }

    if (
        !getParticipants().some(
            (participant) => participant.name === messageData.to
        )
    ) {
        validation.isInvalid = true;
        validation.errorMessage += `There isn't a user called ${messageData.to} in this chat`;
    }

    return validation;
}

export { addMessage, getMessages, validateMessage };
