const chatBox = document.getElementById("chatBox");
const input = document.getElementById("userInput");

/* Message Bubble */
function addMessage(text, sender) {

    const msg = document.createElement("div");
    msg.className = "msg " + sender;

    msg.innerText = text;
    msg.style.margin = "8px";
    msg.style.padding = "10px";
    msg.style.borderRadius = "10px";
    msg.style.maxWidth = "75%";

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

/* Send Message */
async function sendMessage() {

    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";

    try {

        const reply = await Brain.respond(text);

        addMessage(reply, "bot");

        if (typeof speak !== "undefined") {
            speak(reply);
        }

    } catch (e) {
        addMessage("मैं समझ नहीं पाई…", "bot");
    }
}

/* Enter Key */
input.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});
