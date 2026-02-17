/* ======================================
   ANJALI LANGUAGE THINKING ENGINE v2 — STABLE
   Light Thinking Mode
   No Topic Distortion
   ====================================== */

var LanguageThinkingEngineV2 = (function () {

    function compress(text) {
        if (!text) return "";

        if (text.length > 350) {
            text = text.substring(0, 350) + "...";
        }

        return text;
    }

    function soften(text) {

        var starters = [
            "सुनो… ",
            "देखो… ",
            "मैं तुम्हें सरल तरीके से बताती हूँ… ",
            "अगर आसान भाषा में समझें तो… "
        ];

        var s = starters[Math.floor(Math.random() * starters.length)];
        return s + text;
    }

    function transform(knowledgeText, userText) {

        if (!knowledgeText) return "";

        // 1️⃣ Wiki text को intact रखें
        var base = compress(knowledgeText);

        // 2️⃣ सिर्फ tone जोड़ें
        base = soften(base);

        return base;
    }

    return {
        transform: transform
    };

})();
