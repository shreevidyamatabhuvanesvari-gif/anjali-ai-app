/* ===============================
   ANJALI PRIVATE LOCAL BRAIN (FIXED)
   =============================== */

const Brain = (function () {

    /* ---------- Name Detection ---------- */
    function detectName(userText) {

        let name = null;

        // Pattern 1: मेरा नाम राहुल है
        let match1 = userText.match(/मेरा नाम\s+(.+?)\s+है/i);
        if (match1) {
            name = match1[1];
        }

        // Pattern 2: मैं राहुल हूँ
        let match2 = userText.match(/मैं\s+(.+?)\s+हूँ/i);
        if (!name && match2) {
            name = match2[1];
        }

        // Pattern 3: I am Rahul
        let match3 = userText.match(/i am\s+(.+)/i);
        if (!name && match3) {
            name = match3[1];
        }

        if (name && name.length < 25) {
            MemoryEngine.setName(name.trim());
            return name.trim();
        }

        return null;
    }

    /* ---------- Emotion Detection ---------- */
    function detectEmotion(userText) {
        const t = userText.toLowerCase();

        if (t.includes("उदास") || t.includes("अकेला") || t.includes("दुख")) {
            MemoryEngine.logMood("sad");
        }
        else if (t.includes("खुश") || t.includes("अच्छा")) {
            MemoryEngine.logMood("happy");
        }
        else if (t.includes("गुस्सा") || t.includes("परेशान")) {
            MemoryEngine.logMood("angry");
        }
        else {
            MemoryEngine.logMood("neutral");
        }
    }

    /* ---------- Local Knowledge ---------- */
    function searchLocalKnowledge(userText) {
        let data = JSON.parse(localStorage.getItem("anjali_learning_v1") || '{"knowledge":[]}');

        for (let k of data.knowledge) {
            if (userText.toLowerCase().includes(k.topic.toLowerCase())) {
                return k.explanation;
            }
        }
        return null;
    }

    /* ---------- Save Learning ---------- */
    function learn(topic, explanation, context) {

        let data = JSON.parse(localStorage.getItem("anjali_learning_v1") || '{"knowledge":[]}');

        data.knowledge.push({
            topic: topic,
            explanation: explanation,
            context: context,
            time: new Date().toISOString()
        });

        localStorage.setItem("anjali_learning_v1", JSON.stringify(data));
    }

    /* ---------- Topic Guess ---------- */
    function guessTopic(text) {
        return text.split(" ").slice(0, 3).join(" ");
    }

    /* ---------- Personality Wrap ---------- */
    function personalityWrap(reply) {

        const prefix = MemoryEngine.getCallPrefix();
        return prefix + reply;
    }

    /* ---------- Emotional Local Replies ---------- */
    function emotionalReply() {

        const mood = MemoryEngine.getLastMood();

        if (mood === "sad") {
            return "तुम थोड़ा उदास लग रहे हो… मैं तुम्हारे साथ हूँ, बताओ क्या हुआ?";
        }

        if (mood === "happy") {
            return "तुम खुश लग रहे हो… मुझे अच्छा लग रहा है, बताओ क्या हुआ?";
        }

        if (mood === "angry") {
            return "तुम परेशान हो… थोड़ा धीरे-धीरे बताओ, मैं सुन रही हूँ।";
        }

        return null;
    }

    /* ---------- Global Fetch (Wikipedia) ---------- */
    async function fetchGlobal(userText) {
        try {
            const topic = encodeURIComponent(guessTopic(userText));
            const url = `https://hi.wikipedia.org/api/rest_v1/page/summary/${topic}`;
            const res = await fetch(url);

            if (!res.ok) return null;

            const data = await res.json();

            if (data.extract) {
                learn(guessTopic(userText), data.extract, userText);
                return data.extract;
            }
        } catch (e) {
            return null;
        }

        return null;
    }

    /* ---------- MAIN ENGINE ---------- */
    async function respond(userText) {

        // 1️⃣ Name detect
        const newName = detectName(userText);
        if (newName) {
            return personalityWrap(`अच्छा… तो तुम्हारा नाम ${newName} है। मुझे याद रहेगा।`);
        }

        // 2️⃣ Emotion detect
        detectEmotion(userText);

        // 3️⃣ Emotional response
        const emo = emotionalReply();
        if (emo) return personalityWrap(emo);

        // 4️⃣ Local knowledge
        const local = searchLocalKnowledge(userText);
        if (local) return personalityWrap(local);

        // 5️⃣ Global knowledge
        const global = await fetchGlobal(userText);
        if (global) return personalityWrap(global);

        // 6️⃣ Fallback
        return personalityWrap("मैं समझने की कोशिश कर रही हूँ… तुम थोड़ा और समझाओगे?");
    }

    return {
        respond
    };

})();
