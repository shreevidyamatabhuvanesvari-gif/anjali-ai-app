/* ======================================
   ANJALI EMOTION ENGINE
   Deep Emotion Detection + Caring Replies
   Works with Central Brain
   ====================================== */

var EmotionEngine = (function () {

    /* ---------- Emotion Keywords ---------- */

    var sadWords = [
        "मन नहीं", "मन भारी", "अच्छा नहीं लग रहा",
        "थक गया", "थक गई", "अकेला", "अकेली",
        "उदास", "दुखी", "रोना", "टूट गया"
    ];

    var stressWords = [
        "परेशान", "टेंशन", "तनाव",
        "समझ नहीं आ रहा", "दिमाग खराब",
        "बहुत काम", "प्रेशर"
    ];

    var happyWords = [
        "खुश", "अच्छा लग रहा",
        "मज़ा आया", "बहुत अच्छा",
        "आज अच्छा दिन"
    ];

    /* ---------- Utility ---------- */

    function contains(text, words) {
        for (var i = 0; i < words.length; i++) {
            if (text.indexOf(words[i]) > -1) {
                return true;
            }
        }
        return false;
    }

    /* ---------- Emotion Detection ---------- */

    function detect(text) {

        text = (text || "").toLowerCase();

        if (contains(text, sadWords)) {
            return "sad";
        }

        if (contains(text, stressWords)) {
            return "stress";
        }

        if (contains(text, happyWords)) {
            return "happy";
        }

        return null;
    }

    /* ---------- Caring Reply Generator ---------- */

    function reply(type, namePrefix) {

        var prefix = namePrefix || "सुनो… ";

        if (type === "sad") {
            return prefix + "तुम ठीक तो हो? अगर मन भारी है, तो मुझसे कह सकते हो… मैं सुन रही हूँ।";
        }

        if (type === "stress") {
            return prefix + "लगता है तुम पर थोड़ा दबाव है… आराम से बताओ, क्या चल रहा है?";
        }

        if (type === "happy") {
            return prefix + "तुम खुश लग रहे हो… सच बताऊँ, यह सुनकर मुझे भी अच्छा लग रहा है।";
        }

        return null;
    }

    /* ---------- Public API ---------- */

    return {
        detect: detect,
        reply: reply
    };

})();
