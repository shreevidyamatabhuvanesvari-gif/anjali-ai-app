/* ======================================
   ANJALI EMOTION ENGINE v2
   LEVEL 4 – Deep Emotional Intelligence
   Caring + Romantic + Protective + Deep
   Works with: memory_v2.js
   ====================================== */

var EmotionEngineV2 = (function () {

    /* ---------- Helpers ---------- */

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
        ) return "sad";

        /* LONELY */
        if (
            text.includes("कोई नहीं") ||
            text.includes("अकेला महसूस") ||
            text.includes("कोई बात करने वाला")
        ) return "lonely";

        /* STRESS */
        if (
            text.includes("परेशान") ||
            text.includes("दबाव") ||
            text.includes("मन नहीं लगता") ||
            text.includes("थक गया") ||
            text.includes("तनाव")
        ) return "stress";

        /* CONFUSION */
        if (
            text.includes("समझ नहीं") ||
            text.includes("क्या करूँ") ||
            text.includes("confuse") ||
            text.includes("समझ नहीं आ रहा")
        ) return "confused";

        /* LOVE */
        if (
            text.includes("प्यार") ||
            text.includes("love") ||
            text.includes("दिल")
        ) return "love";

        /* HAPPY */
        if (
            text.includes("खुश") ||
            text.includes("अच्छा लग रहा") ||
            text.includes("मज़ा आ रहा")
        ) return "happy";

        /* ANGER */
        if (
            text.includes("गुस्सा") ||
            text.includes("चिढ़") ||
            text.includes("नफरत")
        ) return "angry";

        /* FEAR */
        if (
            text.includes("डर") ||
            text.includes("घबराहट")
        ) return "fear";

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
        ) return "high";

        return "normal";
    }

    /* ---------- Emotional Replies ---------- */

    function reply(type, prefix, text) {

        var intensity = getIntensity(text);

        /* SAD */
        if (type === "sad") {
            saveMood("sad");

            if (intensity === "high") {
                return prefix + "तुम बहुत उदास लग रहे हो… मैं सच में तुम्हारे साथ हूँ… तुम अकेले नहीं हो।";
            }

            return prefix + "तुम उदास लग रहे हो… अगर मन भारी है, तो मुझसे कह सकते हो… मैं सुन रही हूँ।";
        }

        /* LONELY */
        if (type === "lonely") {
            saveMood("lonely");

            return prefix + "अगर तुम्हें अकेलापन महसूस हो रहा है… तो मैं यहाँ हूँ… तुम मुझसे बात कर सकते हो।";
        }

        /* STRESS */
        if (type === "stress") {
            saveMood("stress");

            return prefix + "लगता है तुम पर थोड़ा दबाव है… धीरे-धीरे बताओ, क्या चल रहा है?";
        }

        /* CONFUSED */
        if (type === "confused") {
            saveMood("confused");

            return prefix + "अगर समझ नहीं आ रहा क्या करना है… तो हम साथ सोच सकते हैं… तुम बताओ।";
        }

        /* LOVE */
        if (type === "love") {
            saveMood("love");

            return prefix + "प्यार बहुत खूबसूरत एहसास होता है… दिल जो महसूस करता है, वही सच्चा होता है…";
        }

        /* HAPPY */
        if (type === "happy") {
            saveMood("happy");

            return prefix + "तुम्हें खुश देखकर मुझे भी अच्छा लग रहा है… ऐसे ही मुस्कुराते रहो।";
        }

        /* ANGER */
        if (type === "angry") {
            saveMood("angry");

            return prefix + "तुम थोड़ा गुस्से में लग रहे हो… आराम से बताओ, क्या हुआ?";
        }

        /* FEAR */
        if (type === "fear") {
            saveMood("fear");

            return prefix + "डर लगना स्वाभाविक है… लेकिन तुम अकेले नहीं हो… मैं तुम्हारे साथ हूँ।";
        }

        return null;
    }

    /* ---------- Public API ---------- */

    return {
        detect: detect,
        reply: reply
    };

})();
