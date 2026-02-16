/* ======================================
   ANJALI KNOWLEDGE ENGINE v2 — FINAL WORKING
   Wikipedia + Learning Cache
   ====================================== */

var KnowledgeEngineV2 = (function () {

    const API = "https://hi.wikipedia.org/api/rest_v1/page/summary/";

    /* ---------- Clean Topic ---------- */
    function cleanTopic(text) {
        return (text || "")
            .toLowerCase()
            .replace(/\?/g, "")
            .replace(/क्या है/g, "")
            .replace(/कौन है/g, "")
            .replace(/क्या होता है/g, "")
            .replace(/बताओ/g, "")
            .replace(/समझाओ/g, "")
            .trim();
    }

    /* ---------- Guess Topic ---------- */
    function guessTopic(text) {

        var topic = cleanTopic(text);

        if (topic.length > 1) return topic;

        return text.trim();
    }

    /* ---------- Wikipedia Search ---------- */
    async function search(topicText) {

        try {

            var topic = guessTopic(topicText);

            if (!topic || topic.length < 2) return null;

            const res = await fetch(API + encodeURIComponent(topic));

            if (!res.ok) return null;

            const data = await res.json();

            if (data.extract) return data.extract;

            return null;

        } catch (e) {
            console.log("Wiki error:", e);
            return null;
        }
    }

    /* ---------- Main Resolver ---------- */
    async function resolve(text) {

        var topic = guessTopic(text);

        /* 1️⃣ Learning Cache (FIXED NAME) */
        if (typeof LearningEngineV2 !== "undefined" && LearningEngineV2.get) {
            var cached = LearningEngineV2.get(topic);
            if (cached) return cached;
        }

        /* 2️⃣ Wikipedia */
        var info = await search(topic);

        if (info) {

            /* 3️⃣ Save Learning (FIXED NAME) */
            if (typeof LearningEngineV2 !== "undefined" && LearningEngineV2.set) {
                LearningEngineV2.set(topic, info);
            }

            return info;
        }

        return null;
    }

    return {
        resolve: resolve
    };

})();
