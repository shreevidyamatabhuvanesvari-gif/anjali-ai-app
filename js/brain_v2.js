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

        /* 1️⃣ Emotion First */
        if (typeof EmotionEngineV2 !== "undefined") {
            var emoType = EmotionEngineV2.detect(text);

            if (emoType) {
                context = makeContext("emotion", emoType);
                baseReply = "emotion"; 
                // signal for language engine
            }
        }

        /* 2️⃣ Intelligence */
        if (baseReply !== "emotion" && typeof IntelligenceEngineV2 !== "undefined") {
            var intel = IntelligenceEngineV2.respond(text, "");
            if (intel) {
                context = makeContext("intelligence", null);
                baseReply = intel;
            }
        }

        /* 3️⃣ Name */
        if (!baseReply) {
            var name = detectName(text);
            if (name) {
                context = makeContext("name", null);
                baseReply = "अच्छा… तो तुम्हारा नाम " + name + " है।";
            }
        }

        /* 4️⃣ Normal */
        if (!baseReply) {
            context = makeContext("normal", null);
            baseReply = "normal";
        }

        /* 5️⃣ Language Transform */
        if (typeof LanguageEngineV2 !== "undefined") {
            return LanguageEngineV2.transform(baseReply, context);
        }

        return baseReply;
    }

    return {
        respond: respond
    };

})();
