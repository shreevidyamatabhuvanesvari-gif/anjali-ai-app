/* ======================================
   ANJALI CORE BRAIN ENGINE (FINAL SAFE)
   Local Private Server + Learning Cache
   Works with: memory.js + knowledge.js + learning.js
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

    /* ---------- Knowledge Intent ---------- */
    function isKnowledgeQuery(text) {
        return (
            text.indexOf("क्या है") > -1 ||
            text.indexOf("कौन है") > -1 ||
            text.indexOf("क्या होता है") > -1
        );
    }

    /* ---------- Extract Topic ---------- */
    function extractTopic(text) {
        return (text || "")
            .toLowerCase()
            .replace("क्या है", "")
            .replace("कौन है", "")
            .replace("क्या होता है", "")
            .trim();
    }

    /* ---------- Knowledge Handler ---------- */
    async function handleKnowledge(text) {

        if (!isKnowledgeQuery(text)) return null;

        var topicText = (text || "").toString();

        /* 1️⃣ Local Learning Check */
        if (typeof LearningEngine !== "undefined" && LearningEngine.get) {
            var cached = LearningEngine.get(topicText);
            if (cached) return cached;
        }

        /* 2️⃣ Wikipedia Search */
        if (typeof KnowledgeEngine !== "undefined" && KnowledgeEngine.search) {
            var topic = extractTopic(topicText);

            if (topic.length > 2) {
                var info = await KnowledgeEngine.search(topic);

                if (info) {

                    /* 3️⃣ Save Learning */
                    if (typeof LearningEngine !== "undefined" && LearningEngine.set) {
                        LearningEngine.set(topicText, info);
                    }

                    return info;
                }
            }
        }

        return null;
    }

    /* ---------- Normal Conversation ---------- */
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

    /* ---------- MAIN ENGINE ---------- */
    async function respond(userText) {

        var text = (userText || "").toString();

        var name = detectName(text);
        if (name) {
            return getPrefix() + "अच्छा… तो तुम्हारा नाम " + name + " है। अब मैं तुम्हें इसी नाम से बुलाऊँगी।";
        }

        var emo = detectEmotion(text);
        if (emo) {
            return getPrefix() + emo;
        }

        var interest = detectInterest(text);
        if (interest) {
            return getPrefix() + interest;
        }

        var knowledge = await handleKnowledge(text);
        if (knowledge) {
            return getPrefix() + knowledge;
        }

        return getPrefix() + normalReply(text);
    }

    return {
        respond: respond
    };

})();
