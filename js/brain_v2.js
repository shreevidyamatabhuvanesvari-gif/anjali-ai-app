/* ======================================
   ANJALI BRAIN v2 — FINAL HARD FIX
   Knowledge ALWAYS CHECKED FIRST
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

        /* 1️⃣ ALWAYS TRY KNOWLEDGE FIRST */
        if (typeof KnowledgeEngineV2 !== "undefined") {
            var knowledge = await KnowledgeEngineV2.resolve(text);
            if (knowledge) {
                context = makeContext("knowledge", null);
                baseReply = knowledge;
            }
        }

        /* 2️⃣ Intent Detection */
        var intent = "normal";
        if (!baseReply && typeof IntentEngineV2 !== "undefined") {
            intent = IntentEngineV2.detect(text);
        }

        /* 3️⃣ Advice */
        if (!baseReply && intent === "advice_intent") {
            if (typeof IntelligenceEngineV2 !== "undefined") {
                var intel = IntelligenceEngineV2.respond(text, "");
                if (intel) {
                    context = makeContext("intelligence", null);
                    baseReply = intel;
                }
            }
        }

        /* 4️⃣ Emotion */
        if (!baseReply && typeof EmotionEngineV2 !== "undefined") {
            var emoType = EmotionEngineV2.detect(text);
            if (emoType) {
                context = makeContext("emotion", emoType);
                baseReply = "emotion";
            }
        }

        /* 5️⃣ Identity */
        if (!baseReply) {
            var name = detectName(text);
            if (name) {
                context = makeContext("name", null);
                baseReply = "अच्छा… तो तुम्हारा नाम " + name + " है।";
            }
        }

        /* 6️⃣ Intelligence fallback */
        if (!baseReply && typeof IntelligenceEngineV2 !== "undefined") {
            var fallbackIntel = IntelligenceEngineV2.respond(text, "");
            if (fallbackIntel) {
                context = makeContext("intelligence", null);
                baseReply = fallbackIntel;
            }
        }

        /* 7️⃣ Final fallback */
        if (!baseReply) {
            context = makeContext("normal", null);
            baseReply = "normal";
        }

        /* 8️⃣ Language polish */
        if (typeof LanguageEngineV2 !== "undefined") {
            return LanguageEngineV2.transform(baseReply, context);
        }

        return baseReply;
    }

    return {
        respond: respond
    };

})();
