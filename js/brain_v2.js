/* ======================================
   ANJALI BRAIN v2 — UNIVERSAL FACT MODE
   Knowledge → Fact Filter → Thinking → Emotion
   ====================================== */

var BrainV2 = (function () {

    function isKnowledgeQuery(text) {
        text = (text || "").toLowerCase().trim();

        if (text.split(" ").length <= 3 && text.length > 2)
            return true;

        return (
            text.includes("?") ||
            text.includes("क्या") ||
            text.includes("कौन") ||
            text.includes("कहाँ") ||
            text.includes("कहां") ||
            text.includes("कब") ||
            text.includes("कितने") ||
            text.includes("कितनी") ||
            text.includes("राजधानी")
        );
    }

    function cleanQuery(text) {
        return (text || "")
            .replace("क्या है", "")
            .replace("कौन है", "")
            .replace("कहाँ है", "")
            .replace("कहां है", "")
            .replace("कब", "")
            .replace("?", "")
            .trim();
    }

    /* ---------- UNIVERSAL FACT FILTER ---------- */
    function extractFact(text, question) {

        if (!text) return text;

        question = question.toLowerCase();

        /* YEAR */
        if (question.includes("कब")) {
            var yearMatch = text.match(/\b(1[5-9][0-9]{2}|20[0-9]{2})\b/);
            if (yearMatch) return "यह घटना लगभग " + yearMatch[0] + " के आसपास हुई थी।";
        }

        /* NUMBER */
        if (question.includes("कितने") || question.includes("संख्या")) {
            var numMatch = text.match(/[0-9]+/);
            if (numMatch) return "इसकी संख्या लगभग " + numMatch[0] + " मानी जाती है।";
        }

        /* CAPITAL */
        if (question.includes("राजधानी")) {
            if (text.includes("दिल्ली")) return "भारत की राजधानी नई दिल्ली है।";
            if (text.includes("लखनऊ")) return "उत्तर प्रदेश की राजधानी लखनऊ है।";
            if (text.includes("भोपाल")) return "मध्य प्रदेश की राजधानी भोपाल है।";
        }

        return null;
    }

    /* ---------- NAME DETECTION ---------- */
    function detectName(text) {

        text = (text || "").trim();

        if (text.indexOf("मेरा नाम") === 0) {
            var name = text.replace("मेरा नाम", "").replace("है", "").trim();

            if (name.length > 1) {
                if (typeof MemoryEngineV2 !== "undefined") {
                    MemoryEngineV2.setName(name);
                }
                return name;
            }
        }

        return null;
    }

    /* ---------- MAIN RESPONSE ---------- */
    async function respond(userText) {

        try {

            var text = (userText || "").toString();

            /* 🔥 KNOWLEDGE FIRST */
            if (isKnowledgeQuery(text) && typeof KnowledgeEngineV2 !== "undefined") {

                var cleaned = cleanQuery(text);

                var knowledge =
                    await KnowledgeEngineV2.resolve(cleaned) ||
                    await KnowledgeEngineV2.resolve(text);

                if (knowledge) {

                    /* ⭐ BEST LINE SELECT */
                    if (typeof AnswerSelectorEngineV2 !== "undefined") {
                        knowledge = AnswerSelectorEngineV2.pickBest(knowledge, text);
                    }

                    /* ⭐ UNIVERSAL FACT FILTER */
                    var fact = extractFact(knowledge, text);
                    if (fact) return fact;

                    /* ⭐ THINKING ENGINE */
                    if (typeof LanguageThinkingEngineV2 !== "undefined") {
                        return LanguageThinkingEngineV2.transform(knowledge, text);
                    }

                    return knowledge;
                }
            }

            /* Emotion */
            if (typeof EmotionEngineV2 !== "undefined") {
                var emoType = EmotionEngineV2.detect(text);
                if (emoType) return "emotion";
            }

            /* Name */
            var name = detectName(text);
            if (name) {
                return "अच्छा… तो तुम्हारा नाम " + name + " है।";
            }

            return "मैं सुन रही हूँ… और बताओ।";

        } catch (e) {
            console.log("Brain crash:", e);
            return "मैं अभी ठीक से जवाब नहीं दे पा रही…";
        }
    }

    return {
        respond: respond
    };

})();
