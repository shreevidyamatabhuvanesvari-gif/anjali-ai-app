/* ======================================
   ANJALI INTELLIGENCE ENGINE v2
   LEVEL 5.5 – Ultra Intelligence Mode
   Teacher + Coach + Caring + Deep Thinker
   Deep + Adaptive Reasoning (Improved Intent)
   ====================================== */

var IntelligenceEngineV2 = (function () {

    function contains(text, words) {
        for (let w of words) {
            if (text.includes(w)) return true;
        }
        return false;
    }

    /* ---------- INTENT DETECTION ---------- */
    function detectIntent(text) {
        text = (text || "").toLowerCase().trim();

        // STUDY
        if (contains(text, [
            "पढ़ाई", "study", "focus", "याद नहीं रहता",
            "पढ़ने का मन नहीं", "पढ़ाई में मन"
        ])) return "study";

        // CONFUSION
        if (contains(text, [
            "समझ नहीं", "क्या करूँ", "confuse",
            "समझ नहीं आ रहा", "उलझन"
        ])) return "confusion";

        // MOTIVATION (UPDATED - stronger)
        if (contains(text, [
            "मन नहीं करता",
            "कुछ करने का मन नहीं करता",
            "कुछ करने का मन नहीं",
            "कुछ करने का दिल नहीं",
            "कुछ करने की इच्छा नहीं",
            "थक गया हूँ",
            "थकान",
            "कुछ करने का मन ही नहीं",
            "जी नहीं करता"
        ])) return "motivation";

        // RELATIONSHIP
        if (contains(text, [
            "प्यार", "love", "propose",
            "किसी से प्यार", "दिल लग गया"
        ])) return "relationship";

        // DECISION
        if (contains(text, [
            "कौन सा", "कौनसा", "चुनूँ",
            "decision", "कौन सा रास्ता"
        ])) return "decision";

        return null;
    }

    /* ---------- DEEP + ADAPTIVE REPLIES ---------- */

    function studyAdvice(prefix) {
        return prefix +
        "पढ़ाई में मन न लगना अक्सर थकान, दबाव या लक्ष्य स्पष्ट न होने की वजह से होता है। " +
        "तुम छोटे-छोटे समय के हिस्सों में पढ़ना शुरू करो… 25 मिनट पढ़ो, फिर 5 मिनट आराम करो। " +
        "धीरे-धीरे मन खुद focus करने लगेगा।";
    }

    function confusionAdvice(prefix) {
        return prefix +
        "जब मन बहुत उलझा होता है, तो दिमाग एक साथ बहुत सारी बातें सोचने लगता है। " +
        "ऐसे समय पर अपनी समस्या लिखो और उसके नीचे दो–तीन संभावित रास्ते लिखो। " +
        "धीरे-धीरे स्पष्टता आने लगती है।";
    }

    function motivationAdvice(prefix) {
        return prefix +
        "कभी-कभी मन और शरीर दोनों थक जाते हैं, इसलिए कुछ करने की इच्छा नहीं होती। " +
        "इसका मतलब यह नहीं कि तुम कमजोर हो… बस तुम्हें थोड़ा आराम और नई शुरुआत की ज़रूरत है। " +
        "छोटे काम से शुरू करो, मन धीरे-धीरे वापस सक्रिय होने लगेगा।";
    }

    function relationshipAdvice(prefix) {
        return prefix +
        "प्यार एक बहुत गहरा और सच्चा एहसास होता है। " +
        "सबसे पहले अपने दिल को समझो, फिर सामने वाले को धीरे-धीरे अपनी भावनाएँ महसूस होने दो। " +
        "जल्दबाज़ी नहीं… सच्चाई और सम्मान हमेशा सबसे मजबूत रास्ता होता है।";
    }

    function decisionAdvice(prefix) {
        return prefix +
        "जब दो रास्तों में उलझन हो, तो खुद से पूछो — कौन सा रास्ता तुम्हें शांति देता है। " +
        "जो रास्ता भीतर से सही लगे, वही अक्सर सही निर्णय होता है। " +
        "डर की वजह से लिया गया फैसला ज़्यादा देर तक सही नहीं लगता।";
    }

    /* ---------- MAIN RESPONDER ---------- */
    function respond(text, prefix) {

        text = (text || "").toLowerCase();
        var intent = detectIntent(text);

        if (!intent) return null;

        if (intent === "study") return studyAdvice(prefix);
        if (intent === "confusion") return confusionAdvice(prefix);
        if (intent === "motivation") return motivationAdvice(prefix);
        if (intent === "relationship") return relationshipAdvice(prefix);
        if (intent === "decision") return decisionAdvice(prefix);

        return null;
    }

    return {
        respond: respond
    };

})();
