import fs from "fs";
import path from "path";

const messagesPath = path.resolve("../backend/database/messages.json");
const messagesList = JSON.parse(fs.readFileSync(messagesPath));

function saveData() {
    fs.writeFileSync(messagesPath, JSON.stringify(messagesList));
}

function addMessage(messageData) {
    messagesList.push(messageData);

    saveData();
}

export { addMessage };
