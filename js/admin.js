const logsBox = document.getElementById("logsBox");

/* Log show करने का function */
function addLog(text) {
    const time = new Date().toLocaleTimeString();
    logsBox.innerHTML += `<div>🕒 ${time} — ${text}</div>`;
    logsBox.scrollTop = logsBox.scrollHeight;
}

/* Personality Save */
function savePersonality() {
    const text = document.getElementById("personalityText").value;
    localStorage.setItem("anjali_personality", text);
    addLog("Personality updated");
}

/* Emotion Mode Save */
function saveEmotion() {
    const mode = document.getElementById("emotionLevel").value;
    localStorage.setItem("anjali_emotion_mode", mode);
    addLog("Emotion mode set to: " + mode);
}

/* Learning Mode Save */
function saveLearning() {
    const mode = document.getElementById("learningMode").value;
    localStorage.setItem("anjali_learning", mode);
    addLog("Learning system: " + mode);
}

/* Voice Style Save */
function saveVoice() {
    const voice = document.getElementById("voiceStyle").value;
    localStorage.setItem("anjali_voice", voice);
    addLog("Voice style changed to: " + voice);
}

/* Page load होने पर saved settings load */
window.onload = function() {
    const p = localStorage.getItem("anjali_personality");
    const e = localStorage.getItem("anjali_emotion_mode");
    const l = localStorage.getItem("anjali_learning");
    const v = localStorage.getItem("anjali_voice");

    if (p) document.getElementById("personalityText").value = p;
    if (e) document.getElementById("emotionLevel").value = e;
    if (l) document.getElementById("learningMode").value = l;
    if (v) document.getElementById("voiceStyle").value = v;

    addLog("Admin panel loaded");
};
