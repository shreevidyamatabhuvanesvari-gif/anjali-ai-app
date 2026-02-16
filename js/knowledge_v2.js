/* ======================================
   ANJALI KNOWLEDGE ENGINE v2 — FINAL FIXED
   Wikipedia Concept + Fact Hybrid
   ====================================== */

var KnowledgeEngineV2 = (function () {

    const API = "https://hi.wikipedia.org/api/rest_v1/page/summary/";

    /* ---------- Clean Topic ---------- */
    function cleanTopic(text) {
        return (text || "")
            .toLowerCase()
            .replace("क्या है", "")
            .replace("कौन है", "")
            .replace("कहाँ है", "")
            .replace("कहां है", "")
            .replace("क्या होता है", "")
            .replace("बताओ", "")
            .replace("समझाओ", "")
            .trim();
    }

    /* ---------- Guess Topic ---------- */
    function guessTopic(text) {

        let t = cleanTopic(text);

        if (t.length > 2) return t;

        return (text || "").trim();
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
        if (typeof LearningEngineV2 !== "undefined" && LearningEngineV2.get) {
            let cached = LearningEngineV2.get(topic);
            if (cached) return cached;
        }

        /* 2️⃣ Wikipedia Search */
        let info = await search(topic);

        if (info) {

            /* 3️⃣ Save Learning */
            if (typeof LearningEngineV2 !== "undefined" && LearningEngineV2.set) {
                LearningEngineV2.set(topic, info);
            }

            return info;
        }

        return null;
    }

    return {
        search: search,
        resolve: resolve
    };

})();
