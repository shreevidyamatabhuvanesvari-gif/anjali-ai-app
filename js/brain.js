/* ===============================
   js/brain.js  (Production-Safe)
   =============================== */

var Brain = (function () {

    /* ---------- Safe helpers ---------- */
    function hasMemory() {
        return (typeof MemoryEngine !== "undefined");
    }

    function getPrefix() {
        try {
            if (hasMemory() && typeof MemoryEngine.getCallPrefix === "function") {
                return MemoryEngine.getCallPrefix();
            }
        } catch (e) {}
        return "सुनो… ";
    }

    function saveName(name) {
        try {
            if (hasMemory() && typeof MemoryEngine.setName === "function") {
                MemoryEngine.setName(name);
            }
        } catch (e) {}
    }

    function saveMood(mood) {
        try {
            if (hasMemory() && typeof MemoryEngine.logMood === "function") {
                MemoryEngine.logMood(mood);
            }
        } catch (e) {}
    }

    /* ---------- Name Detection (Intent-based) ---------- */
    function detectName(text) {
        if (!text) return null;

        var t = text.trim();

        // Words that should NEVER be treated as names
        var banned = [
            "उदास","खुश","दुखी","गुस्सा","परेशान",
            "थका","अकेला","ठीक","बीमार","चुप","टेंशन"
        ];

        var name = null;

        // Case 1: "मेरा नाम राहुल है"
        if (t.indexOf("मेरा नाम") === 0) {
            name = t
                .replace("मेरा नाम", "")
                .replace("है", "")
                .trim();
        }
        // Case 2: "मैं राहुल हूँ"
        else if (t.indexOf("मैं ") === 0 && t.indexOf("हूँ") > -1) {
            name = t
                .replace("मैं", "")
                .replace("हूँ", "")
                .trim();
        }

        if (!name) return null;

        // Basic validation
        if (name.length < 2 || name.length > 20) return null;
        if (banned.indexOf(name) > -1) return null;

        saveName(name);
        return name;
    }

    /* ---------- Emotion Detection ---------- */
    function detectEmotion(text) {
        if (!text) return null;

        if (text.indexOf("उदास") > -1 || text.indexOf("दुख") > -1) {
            saveMood("sad");
            return "तुम उदास लग रहे हो… मैं तुम्हारे साथ हूँ।";
        }

        if (text.indexOf("खुश") > -1) {
            saveMood("happy");
            return "तुम खुश लग रहे हो… मुझे अच्छा लग रहा है।";
        }

        if (text.indexOf("गुस्सा") > -1) {
            saveMood("angry");
            return "तुम परेशान लग रहे हो… आराम से बताओ।";
        }

        return null;
    }

    /* ---------- Main Engine ---------- */
    async function respond(userText) {
        var text = (userText || "").toString();

        // 1) Name intent
        var name = detectName(text);
        if (name) {
            return getPrefix() + "अच्छा… तो तुम्हारा नाम " + name + " है। अब मैं तुम्हें इसी नाम से बुलाऊँगी।";
        }

        // 2) Emotion intent
        var emo = detectEmotion(text);
        if (emo) {
            return getPrefix() + emo;
        }

        // 3) Default conversational line
        return getPrefix() + "मैं सुन रही हूँ… और बताओ।";
    }

    return {
        respond: respond
    };

})();
