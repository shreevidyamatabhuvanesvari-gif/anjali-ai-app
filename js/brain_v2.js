/* ======================================
   ANJALI BRAIN v2 — ULTRA STABLE MODE
   Strong Knowledge Lock + Topic Detection
   ====================================== */

var BrainV2 = (function () {

    function makeContext(type, emotion) {
        return {
            type: type || "normal",
            emotion: emotion || null
        };
    }

    function isKnowledgeQuery(text) {

        text = (text || "").toLowerCase().trim();

        // 1️⃣ Short topic
        if (text.split(" ").length <= 4 && text.length > 2) {
            return true;
        }

        // 2️⃣ Question words
        if (
            text.includes("क्या") ||
            text.includes("कौन") ||
            text.includes("कहाँ") ||
            text.includes("कहां") ||
            text.includes("कब") ||
            text.includes("किसने") ||
            text.includes("क्यों") ||
            text.includes("कैसे") ||
            text.includes("?")
        ) {
            return true;
        }

        return false;
    }

    function detectName(text) {

        text = (text || "").trim();

        if (text.indexOf("मेरा नाम") === 0) {

            var name = text
                .replace("मेरा नाम", "")
                .replace("है", "")
                .trim();

            if (name.length > 1) {
                if (typeof MemoryEngineV2 !== "undefined") {
                    MemoryEngineV2.setName(name);
                }
                return name;
            }
        }

        return null;
    }

    async function respond(userText) {

        try {

            var text = (userText || "").toString().trim();
            var context = makeContext("normal", null);
            var baseReply = "";

            /* 🔥 KNOWLEDGE FIRST (LOCKED) */
            if (isKnowledgeQuery(text) && typeof KnowledgeEngineV2 !== "undefined") {

                var knowledge = await KnowledgeEngineV2.resolve(text);

                if (knowledge) {

                    // Thinking engine apply
                    if (typeof LanguageThinkingEngineV2 !== "undefined") {
                        return LanguageThinkingEngineV2.transform(knowledge, text);
                    }

                    return knowledge;
                }
            }

            /* Emotion */
            if (typeof EmotionEngineV2 !== "undefined") {

                var emoType = EmotionEngineV2.detect(text);

                if (emoType) {
                    context = makeContext("emotion", emoType);
                    baseReply = "emotion";
                }
            }

            /* Intelligence */
            if (!baseReply && typeof IntelligenceEngineV2 !== "undefined") {

                var intel = IntelligenceEngineV2.respond(text, "");

                if (intel) {
                    context = makeContext("intelligence", null);
                    baseReply = intel;
                }
            }

            /* Name */
            if (!baseReply) {

                var name = detectName(text);

                if (name) {
                    context = makeContext("name", null);
                    baseReply = "अच्छा… तो तुम्हारा नाम " + name + " है।";
                }
            }

            /* Fallback */
            if (!baseReply) {
                baseReply = "normal";
            }

            if (typeof LanguageEngineV2 !== "undefined") {
                return LanguageEngineV2.transform(baseReply, context);
            }

            return baseReply;

        } catch (e) {
            console.log("Brain crash:", e);
            return "मैं अभी ठीक से जवाब नहीं दे पा रही…";
        }
    }

    return {
        respond: respond
    };

})();
