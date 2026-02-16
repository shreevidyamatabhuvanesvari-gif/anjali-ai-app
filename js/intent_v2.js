/* ======================================
   ANJALI INTENT ENGINE v2 — FINAL STRONG
   Level 3+4 Hybrid Understanding
   Handles punctuation + mixed intent
   ====================================== */

var IntentEngineV2 = (function () {

    function normalize(text) {
        return (text || "")
            .toLowerCase()
            .replace(/\?/g, "")
            .replace(/\./g, "")
            .replace(/!/g, "")
            .trim();
    }

    function detect(text) {

        text = normalize(text);

        /* 1️⃣ Knowledge intent (HIGHEST PRIORITY) */
        if (
            text.includes("क्या है") ||
            text.includes("क्या होता है") ||
            text.includes("कौन है") ||
            text.includes("समझाओ") ||
            text.includes("बताओ")
        ) {
            return "knowledge_intent";
        }

        /* 2️⃣ Advice intent */
        if (
            text.includes("कैसे") ||
            text.includes("क्या करूँ") ||
            text.includes("कैसे बताऊँ") ||
            text.includes("सलाह")
        ) {
            return "advice_intent";
        }

        /* 3️⃣ Emotion intent */
        if (
            text.includes("उदास") ||
            text.includes("दुखी") ||
            text.includes("अकेला") ||
            text.includes("परेशान") ||
            text.includes("खुश")
        ) {
            return "emotion_intent";
        }

        /* 4️⃣ Love intent (non-knowledge only) */
        if (
            text.includes("प्यार") &&
            !text.includes("क्या है") &&
            !text.includes("कैसे")
        ) {
            return "love_intent";
        }

        /* 5️⃣ Identity */
        if (
            text.includes("मेरा नाम") ||
            (text.startsWith("मैं ") && text.includes("हूँ"))
        ) {
            return "identity_intent";
        }

        /* 6️⃣ Motivation */
        if (
            text.includes("मन नहीं") ||
            text.includes("कुछ करने का मन")
        ) {
            return "motivation_intent";
        }

        /* 7️⃣ Topic only (1–3 words) */
        var words = text.split(" ");
        if (words.length <= 3) {
            return "topic_intent";
        }

        return "normal";
    }

    return {
        detect: detect
    };

})();
