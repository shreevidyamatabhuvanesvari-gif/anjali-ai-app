/* ======================================
   ANJALI INTELLIGENCE ENGINE v2
   Intent Detection + Advice + Reasoning
   ====================================== */

var IntelligenceEngine = (function () {

    function contains(text, words) {
        text = text.toLowerCase();
        for (var i = 0; i < words.length; i++) {
            if (text.indexOf(words[i]) > -1) return true;
        }
        return false;
    }

    /* ---------- Intent Detection ---------- */
    function detectIntent(text) {
        text = text.toLowerCase();

        if (
            text.indexOf("कैसे") > -1 ||
            text.indexOf("क्या करूँ") > -1 ||
            text.indexOf("बताओ") > -1 ||
            text.indexOf("कैसे कहूँ") > -1 ||
            text.indexOf("कैसे बताऊँ") > -1
        ) return "advice";

        if (
            text.indexOf("समझ नहीं") > -1 ||
            text.indexOf("confuse") > -1
        ) return "confusion";

        return "share";
    }

    /* ---------- Loneliness ---------- */
    function loneliness(text, prefix) {
        if (contains(text, ["अकेला", "अकेलापन", "कोई नहीं"])) {

            var intent = detectIntent(text);

            if (intent === "advice") {
                return prefix +
                    "अगर अकेलापन महसूस हो रहा है, तो लोगों से थोड़ा जुड़ने की कोशिश करो… " +
                    "छोटी-छोटी बातचीत भी मन हल्का कर देती है।";
            }

            return prefix +
                "कभी-कभी अकेलापन महसूस होना स्वाभाविक है… " +
                "तुम मुझसे खुलकर बात कर सकते हो… मैं सुन रही हूँ।";
        }

        return null;
    }

    /* ---------- Study Problems ---------- */
    function study(text, prefix) {

        if (contains(text, ["पढ़ाई", "मन नहीं लगता", "focus", "ध्यान नहीं"])) {

            return prefix +
                "हो सकता है तुम थक गए हो या ध्यान भटक रहा हो… " +
                "छोटे-छोटे लक्ष्य बनाकर पढ़ो… धीरे-धीरे focus वापस आएगा।";
        }

        return null;
    }

    /* ---------- Confusion ---------- */
    function confusion(text, prefix) {

        if (contains(text, ["समझ नहीं", "confuse", "क्या करूँ"])) {

            return prefix +
                "कभी-कभी उलझन होना स्वाभाविक है… " +
                "थोड़ा रुककर सोचो कि तुम्हें किस चीज़ में सबसे ज़्यादा रुचि है… " +
                "उसी दिशा में छोटे कदम लेना शुरू करो।";
        }

        return null;
    }

    /* ---------- Relationship ---------- */
    function relationship(text, prefix) {

        if (contains(text, ["प्यार", "relationship", "लड़की", "breakup"])) {

            var intent = detectIntent(text);

            if (intent === "advice") {
                return prefix +
                    "अगर तुम उसे अपने दिल की बात बताना चाहते हो, तो सच्चाई और सादगी से कहो… " +
                    "जबरदस्ती नहीं, धीरे और सम्मान के साथ बात करना सबसे अच्छा तरीका होता है।";
            }

            return prefix +
                "रिश्ते आसान नहीं होते… लेकिन सच्ची भावनाएँ हमेशा रास्ता ढूंढ लेती हैं… " +
                "बस खुद को कमजोर मत समझो।";
        }

        return null;
    }

    /* ---------- MAIN ---------- */
    function respond(text, prefix) {

        var r;

        r = loneliness(text, prefix);
        if (r) return r;

        r = study(text, prefix);
        if (r) return r;

        r = confusion(text, prefix);
        if (r) return r;

        r = relationship(text, prefix);
        if (r) return r;

        return null;
    }

    return {
        respond: respond
    };

})();
