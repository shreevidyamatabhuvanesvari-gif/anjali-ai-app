/* ======================================
   ANJALI LANGUAGE ENGINE v2
   Hybrid Model (Fragments + Context Mix)
   Emotion First + Presence + Comfort
   Soft Feminine + Shuddh Hindi
   High Variation Mode
   ====================================== */

var LanguageEngineV2 = (function () {

    /* ---------- Random Helper ---------- */
    function pick(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    /* ---------- Dynamic Address ---------- */
    function getAddress() {

        if (typeof MemoryEngineV2 !== "undefined") {
            var name = MemoryEngineV2.getName && MemoryEngineV2.getName();

            if (name) {
                var styles = [
                    name + "…",
                    name + "… सुनो",
                    name + "…"
                ];
                return pick(styles) + " ";
            }
        }

        var generic = [
            "सुनो… ",
            "मैं सुन रही हूँ… ",
            "बताओ… "
        ];

        return pick(generic);
    }

    /* ---------- Emotion Tone Bank ---------- */

    var sadOpeners = [
        "मुझे महसूस हो रहा है कि तुम्हारा मन भारी है।",
        "तुम्हारी बातों में एक उदासी सी झलक रही है।",
        "लगता है तुम भीतर से थोड़ा थके हुए हो।"
    ];

    var presenceLines = [
        "मैं यहीं हूँ।",
        "तुम अकेले नहीं हो।",
        "मैं तुम्हारी बात सुन रही हूँ।"
    ];

    var comfortLines = [
        "ऐसे समय में खुद को दोष मत दो।",
        "मन कभी-कभी बिना कारण भी उदास हो जाता है।",
        "धीरे-धीरे सब ठीक हो जाता है।"
    ];

    var happyLines = [
        "तुम्हारी खुशी महसूस हो रही है।",
        "तुम्हारी बातों में हल्कापन सा है।",
        "यह सुनकर अच्छा लगा।"
    ];

    var stressLines = [
        "लगता है तुम पर थोड़ा दबाव है।",
        "शायद मन बहुत कुछ सोच रहा है।",
        "तुम्हें थोड़ा आराम की ज़रूरत है।"
    ];

    /* ---------- Emotion Builder ---------- */
    function buildEmotionReply(emotionType) {

        var address = getAddress();

        if (emotionType === "sad") {
            return address +
                pick(sadOpeners) + " " +
                pick(presenceLines) + " " +
                pick(comfortLines);
        }

        if (emotionType === "happy") {
            return address +
                pick(happyLines) + " " +
                pick(presenceLines);
        }

        if (emotionType === "stress") {
            return address +
                pick(stressLines) + " " +
                pick(presenceLines) + " " +
                pick(comfortLines);
        }

        return null;
    }

    /* ---------- Intelligence Tone Wrapper ---------- */
    function wrapIntelligence(text) {

        var address = getAddress();

        var softStarts = [
            "मैं एक बात कहना चाहती हूँ।",
            "यदि तुम चाहो तो एक सुझाव दूँ?",
            "शायद यह तुम्हारी मदद कर सके।"
        ];

        return address + pick(softStarts) + " " + text;
    }

    /* ---------- Normal Conversation Style ---------- */
    var normalLines = [
        "मैं सुन रही हूँ… और बताओ।",
        "तुम जो कहना चाहो, कह सकते हो।",
        "मैं ध्यान से सुन रही हूँ।"
    ];

    function buildNormal() {
        return getAddress() + pick(normalLines);
    }

    /* ---------- MAIN TRANSFORM ---------- */
    function transform(baseReply, context) {

        if (!context) return baseReply;

        // Emotion priority
        if (context.emotion) {
            var emoText = buildEmotionReply(context.emotion);
            if (emoText) return emoText;
        }

        // Intelligence tone
        if (context.type === "intelligence") {
            return wrapIntelligence(baseReply);
        }

        // Default normal tone
        return buildNormal();
    }

    return {
        transform: transform
    };

})();
