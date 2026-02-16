/* ======================================
   ANJALI BRAIN v2 — FINAL
   Intent + Emotion + Intelligence + Knowledge + Name + Language
   ====================================== */

var BrainV2 = (function () {

    function makeContext(type, emotion) {
        return {
            type: type || "normal",
            emotion: emotion || null
        };
    }

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

    async function respond(userText) {

        var text = (userText || "").toString();
        var context = makeContext("normal", null);
        var baseReply = "";

        /* 1️⃣ Intent Detection (MAIN UNDERSTANDING LAYER) */
        var intent = "normal";
        if (typeof IntentEngineV2 !== "undefined") {
            intent = IntentEngineV2.detect(text);
        }

        /* 2️⃣ Emotion Priority */
        if (intent === "emotion_intent" || intent === "motivation_intent") {

            if (typeof EmotionEngineV2 !== "undefined") {
                var emoType = EmotionEngineV2.detect(text);

                if (emoType) {
                    context = makeContext("emotion", emoType);
                    baseReply = "emotion";
                }
            }
        }

        /* 3️⃣ Love Intent → Emotional + Advice */
        if (!baseReply && intent === "love_intent") {
            if (typeof EmotionEngineV2 !== "undefined") {
                var loveType = EmotionEngineV2.detect(text) || "love";
                context = makeContext("emotion", loveType);
                baseReply = "emotion";
            }
        }

        /* 4️⃣ Advice / Intelligence Layer */
        if (!baseReply && intent === "advice_intent") {
            if (typeof IntelligenceEngineV2 !== "undefined") {
                var intel = IntelligenceEngineV2.respond(text, "");
                if (intel) {
                    context = makeContext("intelligence", null);
                    baseReply = intel;
                }
            }
        }

        /* 5️⃣ Knowledge (Questions + Topic) */
        if (!baseReply &&
            (intent === "knowledge_intent" || intent === "topic_intent")
        ) {
            if (typeof KnowledgeEngineV2 !== "undefined") {
                var knowledge = await KnowledgeEngineV2.resolve(text);
                if (knowledge) {
                    context = makeContext("knowledge", null);
                    baseReply = knowledge;
                }
            }
        }

        /* 6️⃣ Identity */
        if (!baseReply && intent === "identity_intent") {
            var name = detectName(text);
            if (name) {
                context = makeContext("name", null);
                baseReply = "अच्छा… तो तुम्हारा नाम " + name + " है।";
            }
        }

        /* 7️⃣ General Intelligence fallback */
        if (!baseReply && typeof IntelligenceEngineV2 !== "undefined") {
            var fallbackIntel = IntelligenceEngineV2.respond(text, "");
            if (fallbackIntel) {
                context = makeContext("intelligence", null);
                baseReply = fallbackIntel;
            }
        }

        /* 8️⃣ Final fallback */
        if (!baseReply) {
            context = makeContext("normal", null);
            baseReply = "normal";
        }

        /* 9️⃣ Language Polishing */
        if (typeof LanguageEngineV2 !== "undefined") {
            return LanguageEngineV2.transform(baseReply, context);
        }

        return baseReply;
    }

    return {
        respond: respond
    };

})();
