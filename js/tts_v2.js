/* ===============================
   TTS v2 — Text To Speech
   Soft + Cute Female Style
   =============================== */

function speak(text) {

    if (!window.speechSynthesis) return;

    const speech = new SpeechSynthesisUtterance();

    speech.text = text;
    speech.lang = "hi-IN";

    /* Soft + Cute feel */
    speech.rate = 0.9;
    speech.pitch = 1.2;
    speech.volume = 1;

    window.speechSynthesis.speak(speech);
}
