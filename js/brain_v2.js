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

        try {

            var text = (userText || "").toString();
            var context = makeContext("normal", null);
            var baseReply = "";

            /* 🔥 KNOWLEDGE FIRST */
            try {
                if (typeof KnowledgeEngineV2 !== "undefined") {
                    var knowledge = await KnowledgeEngineV2.resolve(text);
                    if (knowledge) {
                        context = makeContext("knowledge", null);
                        baseReply = knowledge;
                    }
                }
            } catch (e) {
                console.log("Knowledge error:", e);
            }

            /* Emotion */
            try {
                if (!baseReply && typeof EmotionEngineV2 !== "undefined") {
                    var emoType = EmotionEngineV2.detect(text);
                    if (emoType) {
                        context = makeContext("emotion", emoType);
                        baseReply = "emotion";
                    }
                }
            } catch (e) {
                console.log("Emotion error:", e);
            }

            /* Intelligence */
            try {
                if (!baseReply && typeof IntelligenceEngineV2 !== "undefined") {
                    var intel = IntelligenceEngineV2.respond(text, "");
                    if (intel) {
                        context = makeContext("intelligence", null);
                        baseReply = intel;
                    }
                }
            } catch (e) {
                console.log("Intelligence error:", e);
            }

            /* Name */
            try {
                if (!baseReply) {
                    var name = detectName(text);
                    if (name) {
                        context = makeContext("name", null);
                        baseReply = "अच्छा… तो तुम्हारा नाम " + name + " है।";
                    }
                }
            } catch (e) {
                console.log("Name detect error:", e);
            }

            /* Fallback */
            if (!baseReply) {
                context = makeContext("normal", null);
                baseReply = "normal";
            }

            /* Language polish */
            try {
                if (typeof LanguageEngineV2 !== "undefined") {
                    return LanguageEngineV2.transform(baseReply, context);
                }
            } catch (e) {
                console.log("Language error:", e);
            }

            return baseReply;

        } catch (mainError) {
            console.log("Brain crash:", mainError);
            return "मैं अभी ठीक से जवाब नहीं दे पा रही…";
        }
    }

    return {
        respond: respond
    };

})();
