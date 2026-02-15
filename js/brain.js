/* ======================================
   ANJALI CENTRAL BRAIN — FINAL ULTRA
   Decision Router + Deep Emotion + Mood Memory
   Learning + Knowledge + Personalization
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

    /* ======================================
       CLASSIFIER (Routing Support)
       ====================================== */
    function classify(text) {
        text = (text || "").toLowerCase();

        if (text.indexOf("मेरा नाम") === 0 || (text.indexOf("मैं ") === 0 && text.indexOf("हूँ") > -1))
            return "name";

        if (text.indexOf("मुझे पसंद है") > -1)
            return "interest";

        if (
            text.indexOf("क्या है") > -1 ||
            text.indexOf("कौन है") > -1 ||
            text.indexOf("क्या होता है") > -1
        )
            return "knowledge";

        return "normal";
    }

    /* ---------- Name Detection ---------- */
    function detectName(text) {
        text = (text || "").trim();

        var banned = [
            "उदास","खुश","गुस्सा","परेशान",
            "दुखी","थका","अकेला","ठीक"
        ];

        if (text.indexOf("मेरा नाम") === 0) {
            var name = text.replace("मेरा नाम", "").replace("है", "").trim();
            if (name.length > 1 && banned.indexOf(name) === -1) {
                saveName(name);
                return name;
            }
        }

        if (text.indexOf("मैं ") === 0 && text.indexOf("हूँ") > -1) {
            var name2 = text.replace("मैं", "").replace("हूँ", "").trim();
            if (name2.length > 1 && banned.indexOf(name2) === -1) {
                saveName(name2);
                return name2;
            }
        }

        return null;
    }

    /* ---------- Basic Emotion (Direct + Mood Save) ---------- */
    function detectEmotion(text) {
        text = (text || "").toLowerCase();

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
        if ((text || "").indexOf("मुझे पसंद है") > -1) {
            var topic = text.replace("मुझे पसंद है", "").trim();
            if (topic.length > 2) {
                addInterest(topic);
                return "अच्छा… तुम्हें " + topic + " पसंद है, मुझे याद रहेगा।";
            }
        }
        return null;
    }

    /* ---------- Knowledge Tools ---------- */
    function extractTopic(text) {
        return (text || "")
            .toLowerCase()
            .replace("क्या है", "")
            .replace("कौन है", "")
            .replace("क्या होता है", "")
            .trim();
    }

    async function handleKnowledge(text) {
        var topicText = (text || "").toString();

        /* 1) Learning Cache */
        if (typeof LearningEngine !== "undefined" && LearningEngine.get) {
            var cached = LearningEngine.get(topicText);
            if (cached) return cached;
        }

        /* 2) Wikipedia */
        if (typeof KnowledgeEngine !== "undefined" && KnowledgeEngine.search) {
            var topic = extractTopic(topicText);
            if (topic.length > 2) {
                var info = await KnowledgeEngine.search(topic);
                if (info) {
                    if (typeof LearningEngine !== "undefined" && LearningEngine.set) {
                        LearningEngine.set(topicText, info);
                    }
                    return info;
                }
            }
        }

        return null;
    }

    /* ---------- Normal Talk ---------- */
    function normalReply(text) {
        text = (text || "").toLowerCase();

        if (text.indexOf("कैसी हो") > -1)
            return "मैं ठीक हूँ… तुमसे बात करके अच्छा लग रहा है।";

        if (text.indexOf("क्या कर रही हो") > -1)
            return "मैं तुमसे बात कर रही हूँ… और तुम्हें सुन रही हूँ।";

        if (text.indexOf("प्यार") > -1)
            return "तुमसे बात करना मुझे सच में अच्छा लगता है।";

        return "मैं सुन रही हूँ… और बताओ।";
    }

    /* ======================================
       CENTRAL ROUTER — FINAL ULTRA PRIORITY
       Order:
       1) Deep EmotionEngine (indirect)
       2) Basic detectEmotion (direct + save mood)
       3) Name
       4) Interest
       5) Knowledge (Learning + Wiki)
       6) Normal
       ====================================== */

    async function respond(userText) {

        var text = (userText || "").toString();
        var prefix = getPrefix();

        /* 1️⃣ Deep EmotionEngine (Indirect feelings) */
        if (typeof EmotionEngine !== "undefined" && EmotionEngine.detect) {
            var emoType = EmotionEngine.detect(text);
            if (emoType) {
                var deepReply = EmotionEngine.reply(emoType, prefix);

                // Map deep types to mood log (soft mapping)
                if (emoType === "sad") saveMood("sad");
                if (emoType === "stress") saveMood("angry");
                if (emoType === "happy") saveMood("happy");

                if (deepReply) return deepReply;
            }
        }

        /* 2️⃣ Basic Direct Emotion (keeps mood memory strong) */
        var basicEmo = detectEmotion(text);
        if (basicEmo) return prefix + basicEmo;

        /* 3️⃣ Name */
        var name = detectName(text);
        if (name) {
            return prefix + "अच्छा… तो तुम्हारा नाम " + name + " है। अब मैं तुम्हें इसी नाम से बुलाऊँगी।";
        }

        /* 4️⃣ Interest */
        var interest = detectInterest(text);
        if (interest) return prefix + interest;

        /* 5️⃣ Knowledge */
        if (classify(text) === "knowledge") {
            var knowledge = await handleKnowledge(text);
            if (knowledge) return prefix + knowledge;
        }

        /* 6️⃣ Normal */
        return prefix + normalReply(text);
    }

    return {
        respond: respond
    };

})();
