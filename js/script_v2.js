/* ======================================
   ANJALI SCRIPT v2
   Chat Controller + BrainV2 Connector
   Supports: memory_v2 + emotion_v2 + voice_v2
   ====================================== */

const chatBox = document.getElementById("chatBox");
const input = document.getElementById("userInput");

/* ---------- Message Bubble ---------- */
function addMessage(text, sender) {

    const msg = document.createElement("div");
    msg.className = "msg " + sender;

    msg.innerText = text;
    msg.style.margin = "8px";
    msg.style.padding = "10px";
    msg.style.borderRadius = "10px";
    msg.style.maxWidth = "75%";
    msg.style.wordWrap = "break-word";

    if (sender === "user") {
        msg.style.background = "#cce7ff";
        msg.style.alignSelf = "flex-end";
    } else {
        msg.style.background = "#fff";
        msg.style.border = "1px solid #eee";
        msg.style.alignSelf = "flex-start";
    }

    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}

/* ---------- Send Message ---------- */
async function sendMessage() {

    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";

    try {

        let reply = "";

        /* Use BrainV2 if available */
        if (typeof BrainV2 !== "undefined") {
            reply = await BrainV2.respond(text);
        }
        else if (typeof Brain !== "undefined") {
            reply = await Brain.respond(text);
        }
        else {
            reply = "मैं सोच रही हूँ…";
        }

        addMessage(reply, "bot");

        /* ---------- Speak (TTS) ---------- */
        if (typeof speak === "function") {
            speak(reply);
        }

    } catch (e) {
        console.log("Brain error:", e);
        addMessage("मैं समझ नहीं पाई…", "bot");
    }
}

/* ---------- Enter Key ---------- */
input.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});

/* ---------- Auto Focus ---------- */
window.onload = function () {
    input.focus();
};

/* ---------- Optional: Mic Support ---------- */
function startListening() {
    if (typeof startSTT === "function") {
        startSTT(function (spokenText) {
            input.value = spokenText;
            sendMessage();
        });
    } else {
        alert("Voice input उपलब्ध नहीं है।");
    }
}
