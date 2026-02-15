/* ======================================
   ANJALI CORE BRAIN ENGINE
   Local Private Server (Decision Layer)
   Works with memory.js
   ====================================== */

var Brain = (function () {

    /* ---------- Safe Helpers ---------- */
    function getPrefix() {
        if (typeof MemoryEngine !== "undefined" && MemoryEngine.getCallPrefix) {
            return MemoryEngine.getCallPrefix();
        }
        return "सुनो… ";
    }

    function saveName(name) {
        if (typeof MemoryEngine !== "undefined" && MemoryEngine.setName) {
            MemoryEngine.setName(name);
        }
    }

    function saveMood(mood) {
        if (typeof MemoryEngine !== "undefined" && MemoryEngine.logMood) {
            MemoryEngine.logMood(mood);
        }
    }

    function addInterest(topic) {
        if (typeof MemoryEngine !== "undefined" && MemoryEngine.addInterest) {
            MemoryEngine.addInterest(topic);
        }
    }

    /* ---------- Name Detection ---------- */
    function detectName(text) {
        text = text.trim();

        var banned = [
            "उदास","खुश","गुस्सा","परेशान",
            "दुखी","थका","अकेला","ठीक"
        ];

        // मेरा नाम राहुल है
        if (text.indexOf("मेरा नाम") === 0) {
            var name = text
                .replace("मेरा नाम", "")
                .replace("है", "")
                .trim();

            if (name.length > 1 && banned.indexOf(name) === -1) {
                saveName(name);
                return name;
            }
        }

        // मैं राहुल हूँ
        if (text.indexOf("मैं ") === 0 && text.indexOf("हूँ") > -1) {
            var name2 = text
                .replace("मैं", "")
                .replace("हूँ", "")
                .trim();

            if (name2.length > 1 && banned.indexOf(name2) === -1) {
                saveName(name2);
                return name2;
            }
        }

        return null;
    }

    /* ---------- Emotion Detection ---------- */
    function detectEmotion(text) {

        if (text.indexOf("उदास") > -1 || text.indexOf("दुख") > -1) {
            saveMood("sad");
            return "तुम उदास लग रहे हो… मैं तुम्हारे साथ हूँ।";
        }

        if (text.indexOf("खुश") > -1) {
            saveMood("happy");
            return "तुम खुश लग रहे हो… मुझे अच्छा लग रहा है।";
        }

        if (text.indexOf("गुस्सा") > -1 || text.indexOf("परेशान") > -1) {
            saveMood("angry");
            return "तुम परेशान लग रहे हो… आराम से बताओ।";
        }

        return null;
    }

    /* ---------- Interest Learning ---------- */
    function detectInterest(text) {

        if (text.indexOf("मुझे पसंद है") > -1) {
            var topic = text.replace("मुझे पसंद है", "").trim();
            if (topic.length > 2) {
                addInterest(topic);
                return "अच्छा… तुम्हें " + topic + " पसंद है, मुझे याद रहेगा।";
            }
        }

        return null;
    }

    /* ---------- Default Conversation ---------- */
    function normalReply(text) {

        if (text.indexOf("कैसी हो") > -1) {
            return "मैं ठीक हूँ… तुमसे बात करके अच्छा लग रहा है।";
        }

        if (text.indexOf("क्या कर रही हो") > -1) {
            return "मैं तुमसे बात कर रही हूँ… और तुम्हें सुन रही हूँ।";
        }

        if (text.indexOf("प्यार") > -1) {
            return "तुमसे बात करना मुझे सच में अच्छा लगता है।";
        }

        return "मैं सुन रही हूँ… और बताओ।";
    }

    /* ---------- MAIN RESPONSE ENGINE ---------- */
    async function respond(userText) {

        var text = userText || "";

        // 1️⃣ Name detection
        var name = detectName(text);
        if (name) {
            return getPrefix() + "अच्छा… तो तुम्हारा नाम " + name + " है। अब मैं तुम्हें इसी नाम से बुलाऊँगी।";
        }

        // 2️⃣ Emotion detection
        var emo = detectEmotion(text);
        if (emo) {
            return getPrefix() + emo;
        }

        // 3️⃣ Interest learning
        var interest = detectInterest(text);
        if (interest) {
            return getPrefix() + interest;
        }

        // 4️⃣ Normal reply
        return getPrefix() + normalReply(text);
    }

    return {
        respond: respond
    };

})();
