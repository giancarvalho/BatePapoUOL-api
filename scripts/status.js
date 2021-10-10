import dayjs from "dayjs";
import { addMessage } from "./messages.js";
import { saveData, getParticipants, updateList } from "./participants.js";

let participantsList = getParticipants();

export default function confirmStatus(user) {
    let confirmation = false;
    participantsList.forEach((participant) => {
        if (participant.name === user) {
            participant.lastStatus = Date.now();
            confirmation = true;
        }
    });

    return confirmation;
}

function updateParticipants() {
    const offlineParticipants = [];
    const now = Date.now();
    const newParticipantsList = participantsList.filter((participant) => {
        const isOffline = (now - participant.lastStatus) / 1000 > 10;

        if (isOffline) {
            offlineParticipants.push(participant);
        } else {
            participant.lastStatus = now;
        }

        return !isOffline;
    });

    participantsList = updateList(newParticipantsList);
    createOfflineMessage(offlineParticipants);

    saveData(participantsList);
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
