/* ======================================
   ANJALI INTENT ENGINE v2 — FINAL STABLE
   LEVEL 4 Understanding Layer
   Knowledge + Topic + Emotion + Advice + Identity
   ====================================== */

var IntentEngineV2 = (function () {

    function detect(text) {

        text = (text || "").toLowerCase().trim();

        if (!text) return "normal";

        /* ---------- 1️⃣ Emotion Intent (FIRST) ---------- */
        if (
            text.includes("उदास") ||
            text.includes("दुखी") ||
            text.includes("अकेला") ||
            text.includes("खुश") ||
            text.includes("डर") ||
            text.includes("परेशान")
        ) return "emotion_intent";

        /* ---------- 2️⃣ Love Intent ---------- */
        if (
            text.includes("प्यार") ||
            text.includes("love")
        ) return "love_intent";

        /* ---------- 3️⃣ Advice Intent ---------- */
        if (
            text.includes("क्या करूँ") ||
            text.includes("कैसे करूँ") ||
            text.includes("सलाह") ||
            text.includes("help")
        ) return "advice_intent";

        /* ---------- 4️⃣ Identity Intent ---------- */
        if (
            text.includes("मेरा नाम") ||
            (text.includes("मैं") && text.includes("हूँ"))
        ) return "identity_intent";

        /* ---------- 5️⃣ Knowledge Question ---------- */
        if (
            text.includes("क्या है") ||
            text.includes("क्या होता है") ||
            text.includes("कौन है") ||
            text.includes("कहाँ है") ||
            text.includes("कहां है") ||
            text.includes("क्यों") ||
            text.includes("कैसे") ||
            text.includes("?")
        ) return "knowledge_intent";

        /* ---------- 6️⃣ Topic Only (Single/Short word) ---------- */
        let words = text.split(" ").filter(w => w.length > 0);

        if (words.length <= 2 && text.length > 2) {
            return "topic_intent";
        }

        return "normal";
    }

    return {
        detect: detect
    };

})();
