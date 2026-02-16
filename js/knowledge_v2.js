/* ======================================
   ANJALI KNOWLEDGE ENGINE v2 — FINAL STABLE
   LEVEL 3 – Concept + Fact Hybrid
   Technology + Psychology + Emotions
   Wikipedia Powered (Robust Topic Extraction)
   ====================================== */

var KnowledgeEngine = (function () {

    async function search(topic) {
        try {
            var url = "https://hi.wikipedia.org/api/rest_v1/page/summary/" + encodeURIComponent(topic);
            var res = await fetch(url);

            if (!res.ok) return null;

            var data = await res.json();

            if (data.extract) {
                return data.extract;
            }

        } catch (e) {
            return null;
        }

        return null;
    }

    return {
        search: search
    }

    /* ---------- Clean Topic ---------- */
    function cleanTopic(text) {

        return (text || "")
            .toLowerCase()
            .replace(/\?/g, "")
            .replace(/\./g, "")
            .replace(/!/g, "")
            .replace("क्या है", "")
            .replace("कौन है", "")
            .replace("क्या होता है", "")
            .replace("बताओ", "")
            .replace("समझाओ", "")
            .trim();
    }

    /* ---------- Topic Guess ---------- */
    function guessTopic(text) {

        let t = cleanTopic(text);

        if (t && t.length > 1) return t;

        return (text || "").trim();
    }

    /* ---------- Domain Detection ---------- */
    function detectDomain(text) {

        text = (text || "").toLowerCase();

        /* Technology */
        if (
            text.includes("ai") ||
            text.includes("कृत्रिम") ||
            text.includes("तकनीक") ||
            text.includes("रोबोट") ||
            text.includes("मशीन") ||
            text.includes("कंप्यूटर")
        ) return "technology";

        /* Psychology */
        if (
            text.includes("मन") ||
            text.includes("सोच") ||
            text.includes("दिमाग") ||
            text.includes("व्यवहार") ||
            text.includes("मानसिक")
        ) return "psychology";

        /* Emotion */
        if (
            text.includes("प्यार") ||
            text.includes("भावना") ||
            text.includes("अकेलापन") ||
            text.includes("उदासी") ||
            text.includes("खुशी")
        ) return "emotion";

        return "general";
    }

    /* ---------- Wikipedia Search ---------- */
    async function search(topicText) {

        try {

            let topic = guessTopic(topicText);

            if (!topic || topic.length < 2) return null;

            const res = await fetch(API + encodeURIComponent(topic));

            if (!res.ok) return null;

            const data = await res.json();

            if (data && data.extract) {
                return data.extract;
            }

            return null;

        } catch (e) {
            console.log("Wiki error:", e);
            return null;
        }
    }

    /* ---------- Knowledge Resolver ---------- */
    async function resolve(text) {

        let topic = guessTopic(text);

        /* 1️⃣ Learning Cache Check */
        if (typeof LearningEngine !== "undefined" && LearningEngine.get) {
            let cached = LearningEngine.get(topic);
            if (cached) return cached;
        }

        /* 2️⃣ Wikipedia Search */
        let info = await search(topic);

        if (info) {

            /* 3️⃣ Save Learning */
            if (typeof LearningEngine !== "undefined" && LearningEngine.set) {
                LearningEngine.set(topic, info);
            }

            return info;
        }

        return null;
    }

    /* ---------- Public API ---------- */
    return {
        search: search,
        resolve: resolve,
        detectDomain: detectDomain
    };

})();
