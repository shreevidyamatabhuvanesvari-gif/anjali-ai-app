/* ======================================
   ANJALI BRAIN v2 — FINAL WORKING VERSION
   Knowledge FIRST → Emotion → Intelligence → Name → Normal
   ====================================== */

var BrainV2 = (function () {

    function makeContext(type, emotion) {
        return {
            type: type || "normal",
            emotion: emotion || null
        };
    }

    /* ---------- UNIVERSAL QUESTION DETECTOR ---------- */
    function isKnowledgeQuery(text) {

        text = (text || "").toLowerCase().trim();

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
            text.includes("संख्या") ||
            text.includes("अर्थ") ||
            text.includes("परिभाषा")
        ) {
            return true;
        }

        // 1–2 शब्द = topic
        if (text.split(" ").length <= 2 && text.length > 2) {
            return true;
        }

        return false;
    }

    /* ---------- NAME DETECT ---------- */
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

    /* ---------- MAIN RESPONSE ---------- */
    async function respond(userText) {

        try {

            var text = (userText || "").toString();
            var context = makeContext("normal", null);

            /* =========================
               1️⃣ KNOWLEDGE — ALWAYS FIRST
               ========================= */

            try {

                if (typeof KnowledgeEngineV2 !== "undefined" && isKnowledgeQuery(text)) {

                    var knowledge = await KnowledgeEngineV2.resolve(text);

                    if (knowledge && knowledge.length > 30) {

                        // Language thinking apply
                        if (typeof LanguageThinkingEngineV2 !== "undefined") {
                            return LanguageThinkingEngineV2.transform(knowledge, text);
                        }

                        return knowledge;
                    }
                }

            } catch (e) {
                console.log("Knowledge error:", e);
            }

            /* =========================
               2️⃣ EMOTION
               ========================= */

            try {
                if (typeof EmotionEngineV2 !== "undefined") {

                    var emoType = EmotionEngineV2.detect(text);

                    if (emoType) {
                        context = makeContext("emotion", emoType);
                        return LanguageEngineV2.transform("emotion", context);
                    }
                }
            } catch (e) {}

            /* =========================
               3️⃣ INTELLIGENCE
               ========================= */

            try {
                if (typeof IntelligenceEngineV2 !== "undefined") {

                    var intel = IntelligenceEngineV2.respond(text, "");

                    if (intel) {
                        context = makeContext("intelligence", null);
                        return LanguageEngineV2.transform(intel, context);
                    }
                }
            } catch (e) {}

            /* =========================
               4️⃣ NAME
               ========================= */

            var name = detectName(text);
            if (name) {
                return "अच्छा… तो तुम्हारा नाम " + name + " है।";
            }

            /* =========================
               5️⃣ FINAL FALLBACK
               ========================= */

            if (typeof LanguageEngineV2 !== "undefined") {
                return LanguageEngineV2.transform("normal", context);
            }

            return "मैं सुन रही हूँ…";

        } catch (mainError) {
            console.log("Brain crash:", mainError);
            return "मैं अभी ठीक से जवाब नहीं दे पा रही…";
        }
    }

    return {
        respond: respond
    };

})();
