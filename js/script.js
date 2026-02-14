const chatBox = document.getElementById("chatBox");
const input = document.getElementById("userInput");

/* Chat bubble add करने का function */
function addMessage(text, sender) {
    const msg = document.createElement("div");
    msg.className = "msg " + sender;

    msg.innerText = text;
    msg.style.margin = "8px";
    msg.style.padding = "10px";
    msg.style.borderRadius = "10px";
    msg.style.maxWidth = "75%";
    msg.style.display = "block";

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

/* ===========================
   MAIN SEND MESSAGE (Brain call)
   =========================== */
async function sendMessage() {
    const text = input.value.trim();
    if (text === "") return;

    addMessage(text, "user");
    input.value = "";

    try {
        // 🧠 Local Private Brain Call
        const reply = await Brain.respond(text);

        addMessage(reply, "bot");
        speak(reply);

    } catch (err) {
        const fallback = "मैं अभी ठीक से जवाब नहीं दे पा रही… थोड़ी देर बाद फिर कोशिश करो।";
        addMessage(fallback, "bot");
        speak(fallback);
    }
}

/* Enter key support */
input.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});

/* ===========================
   🎤 TEMPORARY STT (Mic Input)
   =========================== */
function startListening() {

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("आपके browser में voice input support नहीं है");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "hi-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.start();

    recognition.onresult = function(event) {
        const speechText = event.results[0][0].transcript;
        input.value = speechText;
        sendMessage();
    };

    recognition.onerror = function() {
        alert("Voice recognition error");
    };
}

/* ===========================
   🔊 TEMPORARY TTS
   =========================== */
function speak(text) {

    if (!window.speechSynthesis) return;

    const speech = new SpeechSynthesisUtterance();
    speech.text = text;
    speech.lang = "hi-IN";

    // Soft + cute tone
    speech.rate = 0.9;
    speech.pitch = 1.2;
    speech.volume = 1;

    window.speechSynthesis.speak(speech);
}
