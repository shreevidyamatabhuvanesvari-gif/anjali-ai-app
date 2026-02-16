/* ======================================
   ANJALI INTENT ENGINE v2 — FINAL FIX
   LEVEL 4 Understanding Layer
   ====================================== */

var IntentEngineV2 = (function () {

    function detect(text) {

        text = (text || "").toLowerCase().trim();

        /* ---------- Knowledge Intent ---------- */
        if (
            text.includes("क्या है") ||
            text.includes("कौन है") ||
            text.includes("कहाँ है") ||
            text.includes("कहां है") ||
            text.includes("कौन हो") ||
            text.includes("क्यों") ||
            text.includes("कैसे") ||
            text.includes("?")
        ) return "knowledge_intent";

        /* ---------- Topic Only (Single word / short text) ---------- */
        if (text.split(" ").length <= 2 && text.length > 2) {
            return "topic_intent";
        }

        /* ---------- Emotion Intent ---------- */
        if (
            text.includes("उदास") ||
            text.includes("दुखी") ||
            text.includes("अकेला") ||
            text.includes("खुश") ||
            text.includes("डर") ||
            text.includes("परेशान")
        ) return "emotion_intent";

        /* ---------- Love Intent ---------- */
        if (
            text.includes("प्यार") ||
            text.includes("love")
        ) return "love_intent";

        /* ---------- Advice Intent ---------- */
        if (
            text.includes("क्या करूँ") ||
            text.includes("कैसे करूँ") ||
            text.includes("सलाह") ||
            text.includes("help")
        ) return "advice_intent";

        /* ---------- Identity Intent ---------- */
        if (
            text.includes("मेरा नाम") ||
            text.includes("मैं ") && text.includes("हूँ")
        ) return "identity_intent";

        return "normal";
    }

    return {
        detect: detect
    };

})();
