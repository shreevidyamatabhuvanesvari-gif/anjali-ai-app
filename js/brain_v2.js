var BrainV2 = (function () {

    async function respond(userText) {

        var text = userText || "";
        var prefix = "सुनो… ";

        if (typeof MemoryEngineV2 !== "undefined") {
            prefix = MemoryEngineV2.getCallPrefix();
        }

        /* 1️⃣ Emotion FIRST */
        if (typeof EmotionEngineV2 !== "undefined") {
            var emoType = EmotionEngineV2.detect(text);

            if (emoType) {
                return EmotionEngineV2.reply(emoType, prefix, text);
            }
        }

        /* 2️⃣ Intelligence SECOND */
        if (typeof IntelligenceEngineV2 !== "undefined") {
            var intelReply = IntelligenceEngineV2.respond(text, prefix);
            if (intelReply) return intelReply;
        }

        /* 3️⃣ Name Detection */
        if (text.indexOf("मेरा नाम") === 0) {

            var name = text
                .replace("मेरा नाम", "")
                .replace("है", "")
                .trim();

            if (typeof MemoryEngineV2 !== "undefined") {
                MemoryEngineV2.setName(name);
            }

            return prefix + "अच्छा… तो तुम्हारा नाम " + name + " है।";
        }

        /* 4️⃣ Normal */
        return prefix + "मैं सुन रही हूँ… और बताओ।";
    }

    return {
        respond: respond
    };

})();
