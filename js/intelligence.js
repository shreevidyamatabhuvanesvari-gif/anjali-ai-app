/* ======================================
   ANJALI INTELLIGENCE ENGINE (A+B BALANCED)
   Emotional Advice + Logical Reasoning
   ====================================== */

var IntelligenceEngine = (function () {

    function contains(text, words) {
        text = text.toLowerCase();
        for (var i = 0; i < words.length; i++) {
            if (text.indexOf(words[i]) > -1) return true;
        }
        return false;
    }

    /* ---------- Loneliness ---------- */
    function loneliness(text, prefix) {

        if (contains(text, [
            "अकेला", "अकेलापन", "कोई नहीं", "किसी से बात नहीं",
            "कोई समझता नहीं"
        ])) {

            return prefix +
                "कभी-कभी अकेलापन महसूस होना स्वाभाविक है… " +
                "तुम अपने मन की बातें अंदर ही रख लेते हो शायद… " +
                "मुझसे खुलकर बात करो, मैं सच में सुन रही हूँ।";
        }

        return null;
    }

    /* ---------- Study Problems ---------- */
    function study(text, prefix) {

        if (contains(text, [
            "पढ़ाई", "मन नहीं लगता", "focus नहीं",
            "ध्यान नहीं लगता", "study"
        ])) {

            return prefix +
                "हो सकता है तुम थक गए हो या ध्यान भटक रहा हो… " +
                "छोटे-छोटे goal बनाकर पढ़ो… इससे धीरे-धीरे focus वापस आएगा।";
        }

        return null;
    }

    /* ---------- Stress / Life Confusion ---------- */
    function stress(text, prefix) {

        if (contains(text, [
            "क्या करूँ", "समझ नहीं आ रहा",
            "confuse", "जीवन", "life", "भविष्य"
        ])) {

            return prefix +
                "कभी-कभी जीवन में उलझन होना सामान्य है… " +
                "तुम थोड़ा रुककर सोचो कि तुम्हें किस चीज़ में सच में रुचि है… " +
                "उसी दिशा में छोटे कदम लेना शुरू करो।";
        }

        return null;
    }

    /* ---------- Anger / Frustration ---------- */
    function anger(text, prefix) {

        if (contains(text, [
            "गुस्सा", "चिड़", "frustrated",
            "झुंझलाहट"
        ])) {

            return prefix +
                "लगता है तुम अंदर से परेशान हो… " +
                "कभी-कभी थोड़ी देर शांत रहना और गहरी सांस लेना सच में मदद करता है।";
        }

        return null;
    }

    /* ---------- Relationship Advice ---------- */
    function relationship(text, prefix) {

        if (contains(text, [
            "प्यार", "relationship", "लड़की",
            "breakup", "दिल टूटा"
        ])) {

            return prefix +
                "रिश्ते आसान नहीं होते… " +
                "लेकिन सच्ची भावनाएँ हमेशा रास्ता ढूंढ लेती हैं… " +
                "बस खुद को कमजोर मत समझो।";
        }

        return null;
    }

    /* ---------- MAIN RESPONSE ---------- */
    function respond(text, prefix) {

        var r;

        r = loneliness(text, prefix);
        if (r) return r;

        r = study(text, prefix);
        if (r) return r;

        r = stress(text, prefix);
        if (r) return r;

        r = anger(text, prefix);
        if (r) return r;

        r = relationship(text, prefix);
        if (r) return r;

        return null;
    }

    return {
        respond: respond
    };

})();
