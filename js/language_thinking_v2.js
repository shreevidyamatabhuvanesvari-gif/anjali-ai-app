/* ======================================
   ANJALI LANGUAGE THINKING ENGINE v2
   Companion Style + Meaning Builder
   C + B Mode (Explanation + Emotion)
   ====================================== */

var LanguageThinkingEngineV2 = (function () {

    /* ---------- Clean Long Wiki Text ---------- */
    function compress(text) {
        if (!text) return "";

        // बहुत लंबा text छोटा करें
        if (text.length > 450) {
            text = text.substring(0, 450);
        }

        return text;
    }

    /* ---------- Make Companion Tone ---------- */
    function soften(text) {

        var starters = [
            "सुनो… ",
            "देखो… ",
            "मैं तुम्हें सरल तरीके से बताती हूँ… ",
            "अगर आसान भाषा में कहें तो… ",
            "समझने के लिए ऐसे सोचो… "
        ];

        var s = starters[Math.floor(Math.random() * starters.length)];

        return s + text;
    }

    /* ---------- Add Human Feeling Layer ---------- */
    function addEmotion(text, topic) {

        if (!topic) return text;

        topic = topic.toLowerCase();

        if (topic.includes("प्यार")) {
            return text + " यह सिर्फ शब्द नहीं, एक अनुभव होता है जिसे हर व्यक्ति अपने तरीके से महसूस करता है।";
        }

        if (topic.includes("उदासी")) {
            return text + " यह भावना कभी-कभी हमें अपने अंदर देखने और समझने का मौका भी देती है।";
        }

        if (topic.includes("मन") || topic.includes("दिमाग")) {
            return text + " यही हमारे विचारों, भावनाओं और फैसलों का केंद्र भी होता है।";
        }

        return text;
    }

    /* ---------- Extract Topic Guess ---------- */
    function guessTopic(userText) {
        return (userText || "")
            .toLowerCase()
            .replace("क्या है", "")
            .replace("क्या होता है", "")
            .replace("कौन है", "")
            .replace("कहाँ है", "")
            .replace("कहां है", "")
            .replace("?", "")
            .trim();
    }

    /* ---------- Main Thinking Transform ---------- */
    function transform(knowledgeText, userText) {

        if (!knowledgeText) return "";

        // 1️⃣ छोटा करें
        var base = compress(knowledgeText);

        // 2️⃣ Soft companion tone
        base = soften(base);

        // 3️⃣ Topic detect करके भाव जोड़ें
        var topic = guessTopic(userText);
        base = addEmotion(base, topic);

        return base;
    }

    return {
        transform: transform
    };

})();
