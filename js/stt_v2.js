/* ===============================
   STT v2 — Speech To Text
   Browser Mic Based (Testing Mode)
   =============================== */

function startListening() {

    if (!('webkitSpeechRecognition' in window)) {
        alert("Speech recognition इस browser में supported नहीं है");
        return;
    }

    const recognition = new webkitSpeechRecognition();

    recognition.lang = "hi-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.start();

    recognition.onresult = function(event) {
        const speechText = event.results[0][0].transcript;

        const input = document.getElementById("userInput");
        input.value = speechText;

        sendMessage();
    };

    recognition.onerror = function() {
        alert("Mic error आया, दुबारा कोशिश करें");
    };
}
