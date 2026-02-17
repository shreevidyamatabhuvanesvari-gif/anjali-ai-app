/* ======================================
   ANJALI BRAIN v2 — FINAL REAL FIX (STABLE)
   Knowledge Priority Lock + Error Safe
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
                if (typeof MemoryEngineV2 !== "undefined" && MemoryEngineV2.setName) {
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

            /* =================================================
               🔥 KNOWLEDGE FIRST — HARD LOCK (FINAL FIX)
               ================================================= */

            try {

                if (typeof KnowledgeEngineV2 !== "undefined" && KnowledgeEngineV2.resolve) {

                    var cleaned = text
                        .replace("क्या है", "")
                        .replace("कौन है", "")
                        .replace("कहाँ है", "")
                        .replace("कहां है", "")
                        .replace("क्या होता है", "")
                        .replace("बताओ", "")
                        .replace("समझाओ", "")
                        .replace(/\?/g, "")
                        .trim();

                    var knowledge =
                        await KnowledgeEngineV2.resolve(cleaned) ||
                        await KnowledgeEngineV2.resolve(text);

                    /* ⭐ DIRECT RETURN — NO LANGUAGE PROCESSING */
                    if (knowledge && knowledge.length > 20) {
                        return knowledge;
                    }
                }

            } catch (e) {
                console.log("Knowledge error:", e);
            }

            /* ================= Emotion Layer ================= */

            try {
                if (typeof EmotionEngineV2 !== "undefined" && EmotionEngineV2.detect) {

                    var emoType = EmotionEngineV2.detect(text);

                    if (emoType) {
                        context = makeContext("emotion", emoType);
                        baseReply = "emotion";
                    }
                }
            } catch (e) {
                console.log("Emotion error:", e);
            }

            /* ================= Intelligence Layer ================= */

            try {
                if (!baseReply &&
                    typeof IntelligenceEngineV2 !== "undefined" &&
                    IntelligenceEngineV2.respond) {

                    var intel = IntelligenceEngineV2.respond(text, "");

                    if (intel) {
                        context = makeContext("intelligence", null);
                        baseReply = intel;
                    }
                }
            } catch (e) {
                console.log("Intelligence error:", e);
            }

            /* ================= Name Detection ================= */

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

            /* ================= Final Fallback ================= */

            if (!baseReply) {
                baseReply = "normal";
            }

            /* ================= Language Polish ================= */

            try {
                if (typeof LanguageEngineV2 !== "undefined" && LanguageEngineV2.transform) {
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
