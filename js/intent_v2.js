/* ======================================
   ANJALI INTENT ENGINE v2
   LEVEL 3+4 Hybrid
   Deep Understanding + Psychological Intent
   ====================================== */

var IntentEngineV2 = (function () {

    function normalize(text) {
        return (text || "").toLowerCase().trim();
    }

    /* ---------- Helper Checks ---------- */

    function hasAny(text, words) {
        for (var i = 0; i < words.length; i++) {
            if (text.includes(words[i])) return true;
        }
        return false;
    }

    /* ---------- Intent Detection ---------- */

    function detect(text) {

        text = normalize(text);

        if (!text) return "normal";

        /* 1️⃣ Identity */
        if (
            text.startsWith("मेरा नाम") ||
            (text.startsWith("मैं ") && text.includes("हूँ"))
        ) {
            return "identity_intent";
        }

        /* 2️⃣ Knowledge */
        if (
            hasAny(text, ["क्या है", "कौन है", "क्या होता है", "समझाओ", "बताओ"])
        ) {
            return "knowledge_intent";
        }

        /* 3️⃣ Advice / Guidance */
        if (
            hasAny(text, [
                "क्या करूँ",
                "कैसे करूँ",
                "कैसे बताऊँ",
                "कैसे कहूँ",
                "सलाह",
                "मदद"
            ])
        ) {
            return "advice_intent";
        }

        /* 4️⃣ Love / Relationship */
        if (
            hasAny(text, [
                "प्यार",
                "love",
                "दिल",
                "relationship",
                "उससे",
                "इज़हार"
            ])
        ) {
            return "love_intent";
        }

        /* 5️⃣ Emotional State */
        if (
            hasAny(text, [
                "उदास",
                "दुखी",
                "अकेला",
                "परेशान",
                "तनाव",
                "थक गया",
                "खुश",
                "डर"
            ])
        ) {
            return "emotion_intent";
        }

        /* 6️⃣ Motivation */
        if (
            hasAny(text, [
                "मन नहीं लगता",
                "कुछ करने का मन नहीं",
                "कुछ करने का मन नहीं करता",
                "थक गया हूँ",
                "उत्साह नहीं"
            ])
        ) {
            return "motivation_intent";
        }

        /* 7️⃣ Existential / Deep Thinking */
        if (
            hasAny(text, [
                "जीवन का मतलब",
                "मैं कौन हूँ",
                "जीने का कारण",
                "सब क्यों",
                "अस्तित्व"
            ])
        ) {
            return "existential_intent";
        }

        /* 8️⃣ Topic Only (1–3 words) */
        var words = text.split(" ");
        if (
            words.length <= 3 &&
            !hasAny(text, ["मैं", "मेरा", "क्या", "कैसे"])
        ) {
            return "topic_intent";
        }

        return "normal";
    }

    /* ---------- Public API ---------- */

    return {
        detect: detect
    };

})();
