/* ===============================
   ANJALI PRIVATE LOCAL BRAIN
   =============================== */

const Brain = (function () {

    /* ---------- Storage Keys ---------- */
    const MEMORY_KEY = "anjali_memory_v1";
    const LEARNING_KEY = "anjali_learning_v1";

    /* ---------- Load/Save Helpers ---------- */
    function loadJSON(key, def) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : def;
        } catch {
            return def;
        }
    }

    function saveJSON(key, obj) {
        localStorage.setItem(key, JSON.stringify(obj));
    }

    /* ---------- State ---------- */
    let memory = loadJSON(MEMORY_KEY, {
        user_name: "",
        interests: [],
        last_mood: "",
        notes: []
    });

    let learning = loadJSON(LEARNING_KEY, {
        knowledge: [],   // {topic, explanation, context, interest}
    });

    /* ---------- Utilities ---------- */
    function clean(text) {
        return (text || "").trim().toLowerCase();
    }

    function containsAny(text, arr) {
        return arr.some(w => text.includes(w));
    }

    /* ---------- Name Detection ---------- */
    function detectName(userText) {
        const t = clean(userText);

        let name = "";

        if (t.includes("मेरा नाम")) {
            name = userText.split("मेरा नाम")[1];
        } else if (t.includes("मैं ")) {
            name = userText.split("मैं ")[1];
        }

        if (name) {
            name = name.replace("हूँ", "").replace("है", "").trim();
            if (name.length < 20) {
                memory.user_name = name;
                saveJSON(MEMORY_KEY, memory);
            }
        }
    }

    /* ---------- Emotion Detection ---------- */
    function detectEmotion(userText) {
        const t = clean(userText);

        if (containsAny(t, ["उदास", "अकेला", "मन नहीं", "दुख"])) {
            memory.last_mood = "sad";
        } else if (containsAny(t, ["खुश", "अच्छा", "मज़ा"])) {
            memory.last_mood = "happy";
        } else if (containsAny(t, ["गुस्सा", "परेशान"])) {
            memory.last_mood = "angry";
        } else {
            memory.last_mood = "neutral";
        }

        saveJSON(MEMORY_KEY, memory);
    }

    /* ---------- Local Knowledge Search ---------- */
    function searchLocalKnowledge(userText) {
        const t = clean(userText);

        for (let k of learning.knowledge) {
            if (t.includes(k.topic.toLowerCase())) {
                return k.explanation;
            }
        }
        return null;
    }

    /* ---------- Learning Save (Level 3) ---------- */
    function learn(topic, explanation, userText) {
        learning.knowledge.push({
            topic: topic,
            explanation: explanation,
            context: userText,
            interest: memory.last_mood
        });
        saveJSON(LEARNING_KEY, learning);
    }

    /* ---------- Topic Guess ---------- */
    function guessTopic(userText) {
        const words = userText.split(" ");
        return words.slice(0, 3).join(" ");
    }

    /* ---------- Personality Filter ---------- */
    function personalityWrap(reply) {
        const name = memory.user_name ? memory.user_name + "… " : "सुनो… ";

        // High romantic + intelligent tone
        return `${name}${reply}`;
    }

    /* ---------- Local Emotional Replies ---------- */
    function emotionalLocalReply(userText) {
        const mood = memory.last_mood;

        if (mood === "sad") {
            return "तुम थोड़ा उदास लग रहे हो… अगर चाहो तो मुझसे बात कर सकते हो।";
        }
        if (mood === "happy") {
            return "तुम्हारी खुशी महसूस हो रही है… बताओ क्या अच्छा हुआ?";
        }
        if (mood === "angry") {
            return "लगता है कुछ परेशान कर रहा है… थोड़ा शांत होकर बताओ।";
        }

        return null;
    }

    /* ---------- Global Knowledge Call (Wikipedia summary) ---------- */
    async function fetchGlobalAnswer(userText) {
        try {
            const topic = encodeURIComponent(userText.split(" ").slice(0,3).join(" "));
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

    /* ---------- MAIN RESPONSE ENGINE ---------- */
    async function respond(userText) {
        detectName(userText);
        detectEmotion(userText);

        // 1️⃣ Emotional first
        const emo = emotionalLocalReply(userText);
        if (emo) return personalityWrap(emo);

        // 2️⃣ Local knowledge
        const local = searchLocalKnowledge(userText);
        if (local) return personalityWrap(local);

        // 3️⃣ Global auto search
        const global = await fetchGlobalAnswer(userText);
        if (global) return personalityWrap(global);

        // 4️⃣ Fallback
        return personalityWrap("मैं समझने की कोशिश कर रही हूँ… तुम थोड़ा और समझाओगे?");
    }

    return {
        respond
    };
})();
