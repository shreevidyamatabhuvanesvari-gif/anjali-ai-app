const Brain = (function () {

    function detectName(userText) {

        const text = userText.trim();

        let name = null;

        // मेरा नाम राहुल है
        let m1 = text.match(/मेरा नाम\s+(.+?)\s*(है|ho|hai)?$/i);
        if (m1) name = m1[1];

        // मैं राहुल हूँ
        let m2 = text.match(/मैं\s+(.+?)\s*(हूँ|hu|hoon)?$/i);
        if (!name && m2) name = m2[1];

        // सिर्फ नाम (छोटा text)
        if (!name && text.length < 15 && !text.includes(" ")) {
            name = text;
        }

        if (name && name.length < 25) {
            MemoryEngine.setName(name.trim());
            return name.trim();
        }

        return null;
    }

    function detectEmotion(text) {
        const t = text.toLowerCase();

        if (t.includes("उदास") || t.includes("दुख")) {
            MemoryEngine.logMood("sad");
        } else if (t.includes("खुश")) {
            MemoryEngine.logMood("happy");
        } else if (t.includes("गुस्सा")) {
            MemoryEngine.logMood("angry");
        } else {
            MemoryEngine.logMood("neutral");
        }
    }

    function personalityWrap(reply) {
        const prefix = MemoryEngine.getCallPrefix();
        return prefix + reply;
    }

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

    async function respond(userText) {

        const newName = detectName(userText);

        if (newName) {
            return personalityWrap(`अच्छा… तो तुम्हारा नाम ${newName} है। अब मैं तुम्हें इसी नाम से बुलाऊँगी।`);
        }

        detectEmotion(userText);

        const emo = emotionalReply();
        if (emo) return personalityWrap(emo);

        return personalityWrap("मैं सुन रही हूँ… और बताओ।");
    }

    return { respond };

})();
