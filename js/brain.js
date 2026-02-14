const Brain = (function () {

    function safeNameSave(name) {
        if (typeof MemoryEngine !== "undefined") {
            MemoryEngine.setName(name);
        }
    }

    function safeMoodSave(mood) {
        if (typeof MemoryEngine !== "undefined") {
            MemoryEngine.logMood(mood);
        }
    }

    function getPrefix() {
        if (typeof MemoryEngine !== "undefined") {
            return MemoryEngine.getCallPrefix();
        }
        return "सुनो… ";
    }

    function detectName(userText) {

    const text = userText.trim();

    // Words that can NEVER be names
    const bannedWords = [
        "उदास","खुश","दुखी","गुस्सा","परेशान","थका",
        "अकेला","ठीक","बीमार","टेंशन","चुप","ठीक हूँ"
    ];

    let name = null;

    // Rule 1: "मेरा नाम राहुल है"
    if (text.startsWith("मेरा नाम")) {
        name = text
            .replace("मेरा नाम", "")
            .replace("है", "")
            .trim();
    }

    // Rule 2: "मैं राहुल हूँ"
    else if (text.startsWith("मैं ") && text.endsWith("हूँ")) {
        name = text
            .replace("मैं", "")
            .replace("हूँ", "")
            .trim();
    }

    if (!name) return null;

    // अगर banned word है → reject
    if (bannedWords.includes(name)) {
        return null;
    }

    // length validation
    if (name.length < 2 || name.length > 20) {
        return null;
    }

    MemoryEngine.setName(name);
    return name;
}
        }

        if (text.startsWith("मैं ") && text.includes("हूँ")) {
            let name = text.replace("मैं", "")
                           .replace("हूँ", "")
                           .trim();

            if (name.length > 1 && name.length < 20) {
                safeNameSave(name);
                return name;
            }
        }

        return null;
    }

    function detectEmotion(text) {

        if (text.includes("उदास") || text.includes("दुख")) {
            safeMoodSave("sad");
            return "तुम उदास लग रहे हो… मैं तुम्हारे साथ हूँ।";
        }

        if (text.includes("खुश")) {
            safeMoodSave("happy");
            return "तुम खुश लग रहे हो… अच्छा लग रहा है।";
        }

        if (text.includes("गुस्सा")) {
            safeMoodSave("angry");
            return "तुम परेशान लग रहे हो… आराम से बताओ।";
        }

        return null;
    }

    async function respond(userText) {

        const name = detectName(userText);
        if (name) {
            return getPrefix() + "अच्छा… तो तुम्हारा नाम " + name + " है। अब मैं तुम्हें इसी नाम से बुलाऊँगी।";
        }

        const emo = detectEmotion(userText);
        if (emo) {
            return getPrefix() + emo;
        }

        return getPrefix() + "मैं सुन रही हूँ… और बताओ।";
    }

    return { respond };

})();
