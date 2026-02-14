const Brain = (function () {

    /* ===== NAME DETECTION ===== */
    function detectName(userText) {

        let text = userText.trim();
        let name = null;

        // मेरा नाम राहुल है
        if (text.startsWith("मेरा नाम")) {
            name = text.replace("मेरा नाम", "")
                       .replace("है", "")
                       .trim();
        }

        // मैं राहुल हूँ
        else if (text.startsWith("मैं ")) {
            name = text.replace("मैं", "")
                       .replace("हूँ", "")
                       .replace("हू", "")
                       .trim();
        }

        // सिर्फ "राहुल"
        else if (text.split(" ").length === 1 && text.length < 15) {
            name = text;
        }

        if (name && name.length > 1 && name.length < 20) {
            MemoryEngine.setName(name);
            return name;
        }

        return null;
    }

    /* ===== EMOTION DETECTION ===== */
    function detectEmotion(text) {

        if (text.includes("उदास") || text.includes("दुख")) {
            MemoryEngine.logMood("sad");
        }
        else if (text.includes("खुश")) {
            MemoryEngine.logMood("happy");
        }
        else if (text.includes("गुस्सा")) {
            MemoryEngine.logMood("angry");
        }
        else {
            MemoryEngine.logMood("neutral");
        }
    }

    /* ===== PERSONALITY PREFIX ===== */
    function wrap(reply) {
        const prefix = MemoryEngine.getCallPrefix();
        return prefix + reply;
    }

    /* ===== EMOTIONAL RESPONSE ===== */
    function emotionalReply() {
        const mood = MemoryEngine.getLastMood();

        if (mood === "sad") {
            return "तुम उदास लग रहे हो… मैं तुम्हारे साथ हूँ।";
        }

        if (mood === "happy") {
            return "तुम खुश लग रहे हो… मुझे अच्छा लग रहा है।";
        }

        if (mood === "angry") {
            return "तुम परेशान हो… आराम से बताओ।";
        }

        return null;
    }

    /* ===== MAIN RESPONSE ENGINE ===== */
    async function respond(userText) {

        // 1️⃣ Name detect FIRST
        const name = detectName(userText);

        if (name) {
            return wrap("अच्छा… तो तुम्हारा नाम " + name + " है। अब मैं तुम्हें इसी नाम से बुलाऊँगी।");
        }

        // 2️⃣ Emotion detect
        detectEmotion(userText);

        // 3️⃣ Emotional reply
        const emo = emotionalReply();
        if (emo) return wrap(emo);

        // 4️⃣ Normal reply
        return wrap("मैं सुन रही हूँ… और बताओ।");
    }

    return { respond };

})();
