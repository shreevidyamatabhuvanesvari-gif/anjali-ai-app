const chatBox = document.getElementById("chatBox");
const input = document.getElementById("userInput");

function addMessage(text, sender) {
    const msg = document.createElement("div");
    msg.className = "msg " + sender;

    msg.innerText = text;
    msg.style.margin = "8px";
    msg.style.padding = "10px";
    msg.style.borderRadius = "10px";
    msg.style.maxWidth = "75%";

    if (sender === "user") {
        msg.style.background = "#ffd6e7";
        msg.style.alignSelf = "flex-end";
    } else {
        msg.style.background = "#fff";
        msg.style.border = "1px solid #eee";
        msg.style.alignSelf = "flex-start";
    }

    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}

/* ===== MAIN SEND ===== */
async function sendMessage() {
    const text = input.value.trim();
    if (text === "") return;

    addMessage(text, "user");
    input.value = "";

    try {
        console.log("Sending to brain:", text);

        const reply = await Brain.respond(text);

        console.log("Brain reply:", reply);

        addMessage(reply, "bot");
        speak(reply);

    } catch (err) {
        console.error("BRAIN ERROR:", err);

        addMessage("⚠️ Error: " + err.message, "bot");
    }
}

/* Enter key */
input.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});

/* 🎤 STT */
function startListening() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("Voice input support नहीं है");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "hi-IN";
    recognition.start();

    recognition.onresult = function(event) {
        const speechText = event.results[0][0].transcript;
        input.value = speechText;
        sendMessage();
    };
}

/* 🔊 TTS */
function speak(text) {
    if (!window.speechSynthesis) return;

    const speech = new SpeechSynthesisUtterance();
    speech.text = text;
    speech.lang = "hi-IN";
    speech.rate = 0.9;
    speech.pitch = 1.1;

    window.speechSynthesis.speak(speech);
        }
