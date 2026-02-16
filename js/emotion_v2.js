/* ======================================
   ANJALI EMOTION ENGINE v2 (FINAL CLEAN)
   LEVEL 4 – Deep Emotional Detection ONLY
   NO FIXED REPLIES
   Works with: memory_v2.js + language_v2.js
   ====================================== */

var EmotionEngineV2 = (function () {

    /* ---------- Save Mood to Memory ---------- */

    function saveMood(mood) {
        if (typeof MemoryEngineV2 !== "undefined" && MemoryEngineV2.logMood) {
            MemoryEngineV2.logMood(mood);
        }
    }

    /* ---------- Emotion Detection ---------- */

    function detect(text) {

        text = (text || "").toLowerCase();

        /* SAD */
        if (
            text.includes("उदास") ||
            text.includes("दुखी") ||
            text.includes("दिल टूट") ||
            text.includes("रो") ||
            text.includes("अकेला")
        ) {
            saveMood("sad");
            return "sad";
        }

        /* LONELY */
        if (
            text.includes("कोई नहीं") ||
            text.includes("अकेला महसूस") ||
            text.includes("कोई बात करने वाला")
        ) {
            saveMood("lonely");
            return "lonely";
        }

        /* STRESS */
        if (
            text.includes("परेशान") ||
            text.includes("दबाव") ||
            text.includes("मन नहीं लगता") ||
            text.includes("थक गया") ||
            text.includes("तनाव")
        ) {
            saveMood("stress");
            return "stress";
        }

        /* CONFUSED */
        if (
            text.includes("समझ नहीं") ||
            text.includes("क्या करूँ") ||
            text.includes("confuse") ||
            text.includes("समझ नहीं आ रहा")
        ) {
            saveMood("confused");
            return "confused";
        }

        /* LOVE */
        if (
            text.includes("प्यार") ||
            text.includes("love") ||
            text.includes("दिल")
        ) {
            saveMood("love");
            return "love";
        }

        /* HAPPY */
        if (
            text.includes("खुश") ||
            text.includes("अच्छा लग रहा") ||
            text.includes("मज़ा आ रहा")
        ) {
            saveMood("happy");
            return "happy";
        }

        /* ANGER */
        if (
            text.includes("गुस्सा") ||
            text.includes("चिढ़") ||
            text.includes("नफरत")
        ) {
            saveMood("angry");
            return "angry";
        }

        /* FEAR */
        if (
            text.includes("डर") ||
            text.includes("घबराहट")
        ) {
            saveMood("fear");
            return "fear";
        }

        return null;
    }

    /* ---------- Intensity Detection ---------- */

    function getIntensity(text) {

        text = (text || "").toLowerCase();

        if (
            text.includes("बहुत") ||
            text.includes("काफी") ||
            text.includes("ज़्यादा") ||
            text.includes("टूट गया")
        ) {
            return "high";
        }

        return "normal";
    }

    /* ---------- Public API ---------- */

    return {
        detect: detect,
        getIntensity: getIntensity
    };

})();
