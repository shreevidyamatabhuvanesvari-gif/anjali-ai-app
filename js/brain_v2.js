/* ======================================
   ANJALI BRAIN v2 — FINAL (Language Integrated)
   Router: Emotion → Intelligence → Name → Normal
   All replies pass through LanguageEngineV2
   ====================================== */

var BrainV2 = (function () {

    /* ---------- Context Builder ---------- */
    function makeContext(type, emotion) {
        return {
            type: type || "normal",
            emotion: emotion || null
        };
    }

    /* ---------- Name Detection ---------- */
    function detectName(text) {
        text = (text || "").trim();

        if (text.indexOf("मेरा नाम") === 0) {
            var name = text.replace("मेरा नाम", "").replace("है", "").trim();

            if (name.length > 1) {
                if (typeof MemoryEngineV2 !== "undefined" && MemoryEngineV2.setName) {
                    MemoryEngineV2.setName(name);
                }
                return name;
            }
        }

        return null;
    }

    /* ---------- Normal Base Reply ---------- */
    function normalBase() {
        return "मैं सुन रही हूँ… और बताओ।";
    }

    /* ---------- MAIN ENGINE ---------- */
    async function respond(userText) {

        var text = (userText || "").toString();
        var baseReply = "";
        var context = makeContext("normal", null);

        /* 1️⃣ Emotion First */
        if (typeof EmotionEngineV2 !== "undefined" && EmotionEngineV2.detect) {
            var emoType = EmotionEngineV2.detect(text);
            if (emoType) {
                context = makeContext("emotion", emoType);
                baseReply = ""; // Language engine will build full reply
            }
        }

        /* 2️⃣ Intelligence */
        if (!context.emotion && typeof IntelligenceEngineV2 !== "undefined") {
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
                baseReply = "अच्छा… तो तुम्हारा नाम " + name + " है।";
                context = makeContext("name", null);
            }
        }

        if (!baseReply && !context.emotion) {
    baseReply = normalBase();
    context = makeContext("normal", null);
}

        /* 5️⃣ Language Layer (FINAL TRANSFORM) */
        if (typeof LanguageEngineV2 !== "undefined" && LanguageEngineV2.transform) {
            try {
                return LanguageEngineV2.transform(baseReply, context);
            } catch (e) {
                console.log("Language transform error:", e);
            }
        }

        return baseReply;
    }

    return {
        respond: respond
    };

})();
