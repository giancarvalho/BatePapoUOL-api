import fs from "fs";
import path from "path";
import dayjs from "dayjs";

const messagesPath = path.resolve("../backend/database/messages.json");
const messagesList = JSON.parse(fs.readFileSync(messagesPath));

function saveData() {
    fs.writeFileSync(messagesPath, JSON.stringify(messagesList));
}

function getMessages(user, limit) {
    const messages = filterMessages(user);
    return messages.slice(0, limit);
}

function addMessage(user, messageData) {
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
    const messages = messagesList.filter((message) => {
        if (
            message.to === user ||
            message.from === user ||
            message.type === "message"
        ) {
            return true;
        } else {
            return false;
        }
    });

    return messages;
}

export { addMessage, getMessages };
