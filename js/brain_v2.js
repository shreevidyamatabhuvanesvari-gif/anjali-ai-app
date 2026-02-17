/* ======================================
   ANJALI CENTRAL BRAIN — FINAL ULTRA + INTELLIGENCE (BALANCED)
   Intelligence → Emotion → Knowledge → Normal
   + Answer Selector Integration
   + Language Thinking Integration
   ====================================== */

var Brain = (function () {

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

    function classify(text) {
        text = (text || "").toLowerCase();

        if (text.indexOf("मेरा नाम") === 0 || (text.indexOf("मैं ") === 0 && text.indexOf("हूँ") > -1))
            return "name";

        if (text.indexOf("मुझे पसंद है") > -1)
            return "interest";

        if (
            text.indexOf("क्या है") > -1 ||
            text.indexOf("कौन है") > -1 ||
            text.indexOf("क्या होता है") > -1 ||
            text.indexOf("कब") > -1 ||
            text.indexOf("कहाँ") > -1 ||
            text.indexOf("कहां") > -1
        )
            return "knowledge";

        return "normal";
    }

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

    function extractTopic(text) {
        return (text || "")
            .toLowerCase()
            .replace("क्या है", "")
            .replace("कौन है", "")
            .replace("क्या होता है", "")
            .replace("कब", "")
            .replace("कहाँ", "")
            .replace("कहां", "")
            .replace("?", "")
            .trim();
    }

    async function handleKnowledge(text) {

        var topicText = (text || "").toString();

        if (typeof LearningEngine !== "undefined" && LearningEngine.get) {
            var cached = LearningEngine.get(topicText);
            if (cached) return cached;
        }

        if (typeof KnowledgeEngine !== "undefined" && KnowledgeEngine.search) {

            var topic = extractTopic(topicText);

            if (topic.length > 2) {
                var info = await KnowledgeEngine.search(topic);
                if (info) {

                    // ⭐ NEW — Best sentence selector
                    if (typeof AnswerSelectorEngineV2 !== "undefined") {
                        info = AnswerSelectorEngineV2.pickBest(info, text);
                    }

                    // ⭐ NEW — Language thinking polish
                    if (typeof LanguageThinkingEngineV2 !== "undefined") {
                        info = LanguageThinkingEngineV2.transform(info, text);
                    }

                    LearningEngine.set(topicText, info);
                    return info;
                }
            }

            var firstWord = topic.split(" ")[0];

            if (firstWord && firstWord.length > 2) {
                var info2 = await KnowledgeEngine.search(firstWord);
                if (info2) {

                    if (typeof AnswerSelectorEngineV2 !== "undefined") {
                        info2 = AnswerSelectorEngineV2.pickBest(info2, text);
                    }

                    if (typeof LanguageThinkingEngineV2 !== "undefined") {
                        info2 = LanguageThinkingEngineV2.transform(info2, text);
                    }

                    LearningEngine.set(topicText, info2);
                    return info2;
                }
            }
        }

        return null;
    }

    function isTopicOnly(text) {
        var clean = (text || "").trim();
        var wordCount = clean.split(" ").length;

        if (wordCount > 3) return false;

        if (
            clean.indexOf("क्या") > -1 ||
            clean.indexOf("कौन") > -1 ||
            clean.indexOf("कैसे") > -1
        ) return false;

        return true;
    }

    function normalReply(text) {
        text = (text || "").toLowerCase();

        if (text.indexOf("कैसी हो") > -1)
            return "मैं ठीक हूँ… तुमसे बात करके अच्छा लग रहा है।";

        if (text.indexOf("क्या कर रही हो") > -1)
            return "मैं तुमसे बात कर रही हूँ… और तुम्हें सुन रही हूँ।";

        return "मैं सुन रही हूँ… और बताओ।";
    }

    async function respond(userText) {

        var text = (userText || "").toString();
        var prefix = getPrefix();

        /* 1️⃣ Intelligence FIRST */
        if (typeof IntelligenceEngine !== "undefined") {
            var intelReply = IntelligenceEngine.respond(text, prefix);
            if (intelReply) return intelReply;
        }

        /* 2️⃣ Deep Emotion */
        if (typeof EmotionEngine !== "undefined") {
            var emoType = EmotionEngine.detect(text);
            if (emoType) {
                var deepReply = EmotionEngine.reply(emoType, prefix);
                return deepReply;
            }
        }

        /* 3️⃣ Basic Emotion */
        var basicEmo = detectEmotion(text);
        if (basicEmo) return prefix + basicEmo;

        /* 4️⃣ Name */
        var name = detectName(text);
        if (name) {
            return prefix + "अच्छा… तो तुम्हारा नाम " + name + " है। अब मैं तुम्हें इसी नाम से बुलाऊँगी।";
        }

        /* 5️⃣ Interest */
        var interest = detectInterest(text);
        if (interest) return prefix + interest;

        /* 6️⃣ Knowledge */
        if (classify(text) === "knowledge") {
            var knowledge = await handleKnowledge(text);
            if (knowledge) return prefix + knowledge;
        }

        /* 7️⃣ Topic Detection */
        if (isTopicOnly(text)) {
            var topicInfo = await handleKnowledge(text);
            if (topicInfo) return prefix + topicInfo;
        }

        return prefix + normalReply(text);
    }

    return {
        respond: respond
    };

})();
