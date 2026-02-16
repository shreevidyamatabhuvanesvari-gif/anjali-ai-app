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

        /* 🔥 ALWAYS TRY KNOWLEDGE FIRST */
        if (typeof KnowledgeEngineV2 !== "undefined") {
            var knowledge = await KnowledgeEngineV2.resolve(text);
            if (knowledge) {
                context = makeContext("knowledge", null);
                baseReply = knowledge;
            }
        }

        /* Emotion */
        if (!baseReply && typeof EmotionEngineV2 !== "undefined") {
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
            context = makeContext("normal", null);
            baseReply = "normal";
        }

        /* Language polish */
        if (typeof LanguageEngineV2 !== "undefined") {
            return LanguageEngineV2.transform(baseReply, context);
        }

        return baseReply;
    }

    return {
        respond: respond
    };

})();
