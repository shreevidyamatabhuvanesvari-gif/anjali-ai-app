/* ======================================
   ANJALI BRAIN v2 — UNIVERSAL KNOWLEDGE MODE
   Knowledge → Emotion → Intelligence → Name
   Strong Universal Detection
   ====================================== */

var BrainV2 = (function () {

    function makeContext(type, emotion) {
        return {
            type: type || "normal",
            emotion: emotion || null
        };
    }

    /* ---------- UNIVERSAL KNOWLEDGE DETECTOR ---------- */
    function isKnowledgeQuery(text) {

        text = (text || "").toLowerCase().trim();

        // बहुत छोटे शब्द = topic
        if (text.split(" ").length <= 2 && text.length > 2) {
            return true;
        }

        // Question markers
        if (
            text.includes("?") ||
            text.includes("क्या") ||
            text.includes("कौन") ||
            text.includes("कहाँ") ||
            text.includes("कहां") ||
            text.includes("कब") ||
            text.includes("क्यों") ||
            text.includes("कैसे") ||
            text.includes("कितना") ||
            text.includes("कितने") ||
            text.includes("कितनी") ||
            text.includes("संख्या") ||
            text.includes("अर्थ") ||
            text.includes("परिभाषा") ||
            text.includes("बताओ") ||
            text.includes("समझाओ")
        ) {
            return true;
        }

        return false;
    }

    /* ---------- Name Detection ---------- */
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

    /* ---------- MAIN RESPONSE ENGINE ---------- */
    async function respond(userText) {

        try {

            var text = (userText || "").toString();
            var context = makeContext("normal", null);
            var baseReply = "";

            /* 🔥 1️⃣ UNIVERSAL KNOWLEDGE FIRST */
            try {

                if (isKnowledgeQuery(text) && typeof KnowledgeEngineV2 !== "undefined") {

                    var cleaned = text
                        .replace("क्या है", "")
                        .replace("कौन है", "")
                        .replace("कहाँ है", "")
                        .replace("कहां है", "")
                        .replace("क्या होता है", "")
                        .replace("बताओ", "")
                        .replace("समझाओ", "")
                        .replace("?", "")
                        .trim();

                    var knowledge =
                        await KnowledgeEngineV2.resolve(cleaned) ||
                        await KnowledgeEngineV2.resolve(text);

                    if (knowledge) {
                        return knowledge;   // ⭐ Direct return
                    }
                }

            } catch (e) {
                console.log("Knowledge error:", e);
            }

            /* 2️⃣ Emotion */
            try {
                if (typeof EmotionEngineV2 !== "undefined") {

                    var emoType = EmotionEngineV2.detect(text);

                    if (emoType) {
                        context = makeContext("emotion", emoType);
                        baseReply = "emotion";
                    }
                }
            } catch (e) {
                console.log("Emotion error:", e);
            }

            /* 3️⃣ Intelligence */
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

            /* 4️⃣ Name */
            try {
                if (!baseReply) {

                    var name = detectName(text);

                    if (name) {
                        context = makeContext("name", null);
                        baseReply = "अच्छा… तो तुम्हारा नाम " + name + " है।";
                    }
                }
            } catch (e) {
                console.log("Name error:", e);
            }

            /* 5️⃣ Fallback */
            if (!baseReply) {
                baseReply = "normal";
            }

            /* 6️⃣ Language polish */
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
