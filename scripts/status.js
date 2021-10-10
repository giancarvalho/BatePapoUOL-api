import dayjs from "dayjs";
import { addMessage } from "./messages.js";
import { getParticipants, saveData } from "./participants.js";

let participants = getParticipants();

export default function confirmStatus(user) {
    return participants.some((participant) => participant.name === user);
}

function updateParticipants() {
    const offlineParticipants = [];

    participants = participants.filter((participant) => {
        const isOffline = (Date.now() - participant.lastStatus) / 1000 > 10;

        if (isOffline) {
            offlineParticipants.push(participant);
        }

        return !isOffline;
    });

    createOfflineMessage(offlineParticipants);

    saveData(participants);
}

function createOfflineMessage(offlineParticipants) {
    offlineParticipants.forEach((participant) =>
        addMessage({
            messageData: {
                from: participant.name,
                to: "Todos",
                text: "sai da sala...",
                type: "message",
                time: dayjs(Date.now()).format("HH:mm:ss"),
            },
        })
    );
}

setInterval(updateParticipants, 15000);
