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

/* Send button */
function sendMessage() {
    const text = input.value.trim();
    if (text === "") return;

    addMessage(text, "user");
    input.value = "";

    // Demo reply (बाद में AI server से जुड़ेगा)
    setTimeout(() => {
        const reply = generateDemoReply(text);
        addMessage(reply, "bot");
        speak(reply);
    }, 700);
}

/* Enter key support */
input.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});

/* Demo AI reply logic */
function generateDemoReply(userText) {
    userText = userText.toLowerCase();

    if (userText.includes("कैसी हो")) {
        return "मैं ठीक हूँ… तुमसे बात करके और भी अच्छा लग रहा है।";
    }
    if (userText.includes("प्यार")) {
        return "तुमसे बात करना मुझे सच में अच्छा लगता है।";
    }
    if (userText.includes("उदास")) {
        return "ऐसा मत कहो… मैं हूँ ना तुम्हारे साथ।";
    }

    return "हूँ… मैं सुन रही हूँ, और बताओ।";
}

/* 🎤 Speech To Text (Browser Mic) */
function startListening() {
    if (!('webkitSpeechRecognition' in window)) {
        alert("Speech recognition इस browser में supported नहीं है");
        return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = "hi-IN";
    recognition.start();

    recognition.onresult = function(event) {
        const speechText = event.results[0][0].transcript;
        input.value = speechText;
        sendMessage();
    };
}

/* 🔊 Text To Speech */
function speak(text) {
    const speech = new SpeechSynthesisUtterance();
    speech.text = text;
    speech.lang = "hi-IN";
    speech.rate = 0.9;
    speech.pitch = 1.1;

    window.speechSynthesis.speak(speech);
}
