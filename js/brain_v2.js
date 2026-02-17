/* ======================================
   ANJALI BRAIN v2 — FINAL REAL FIX
   Knowledge Priority Lock
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

        try {

            var text = (userText || "").toString();
            var context = makeContext("normal", null);
            var baseReply = "";

            /* 🔥 KNOWLEDGE FIRST */
            try {
                if (typeof KnowledgeEngineV2 !== "undefined") {

                    var cleaned = text
                        .replace("क्या है", "")
                        .replace("कौन है", "")
                        .replace("कहाँ है", "")
                        .replace("कहां है", "")
                        .replace("क्या होता है", "")
                        .replace("?", "")
                        .trim();

                    var knowledge =
                        await KnowledgeEngineV2.resolve(cleaned) ||
                        await KnowledgeEngineV2.resolve(text);

                    if (knowledge) {
                        return knowledge;   // ⭐⭐⭐ DIRECT RETURN (MOST IMPORTANT FIX)
                    }
                }
            } catch (e) {
                console.log("Knowledge error:", e);
            }

            /* Emotion */
            try {
                if (typeof EmotionEngineV2 !== "undefined") {
                    var emoType = EmotionEngineV2.detect(text);
                    if (emoType) {
                        context = makeContext("emotion", emoType);
                        baseReply = "emotion";
                    }
                }
            } catch (e) {}

            /* Intelligence */
            try {
                if (!baseReply && typeof IntelligenceEngineV2 !== "undefined") {
                    var intel = IntelligenceEngineV2.respond(text, "");
                    if (intel) {
                        context = makeContext("intelligence", null);
                        baseReply = intel;
                    }
                }
            } catch (e) {}

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

            /* Language Polish */
            if (typeof LanguageEngineV2 !== "undefined") {
                return LanguageEngineV2.transform(baseReply, context);
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
