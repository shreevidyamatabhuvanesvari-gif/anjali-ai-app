/* ===============================
   TTS v2 — Mobile Safe Version
   Soft + Cute Female Style
   =============================== */

function speak(text) {

    if (!window.speechSynthesis) {
        alert("TTS supported नहीं है");
        return;
    }

    // Speech stop (अगर पहले से चल रही हो)
    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = "hi-IN";
    speech.rate = 0.9;
    speech.pitch = 1.2;
    speech.volume = 1;

    // Mobile fix: delay से बोलता है
    setTimeout(() => {
        window.speechSynthesis.speak(speech);
    }, 200);
}
