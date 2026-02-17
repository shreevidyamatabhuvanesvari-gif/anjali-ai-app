/* ======================================
   ANJALI KNOWLEDGE ENGINE v2 — FINAL STABLE
   Strong Topic Detection + Multi Fallback
   Wikipedia Powered
   ====================================== */

var KnowledgeEngineV2 = (function () {

    const API = "https://hi.wikipedia.org/api/rest_v1/page/summary/";

    /* ---------- Normalize ---------- */
    function normalize(text) {
        return (text || "")
            .toLowerCase()
            .replace(/\?/g, "")
            .replace(/,/g, "")
            .replace(/  +/g, " ")
            .trim();
    }

    /* ---------- Clean Topic ---------- */
    function cleanTopic(text) {
        return normalize(text)
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

        let topic = cleanTopic(text);

        if (topic.length > 1) return topic;

        return normalize(text);
    }

    /* ---------- Wikipedia Search ---------- */
    async function search(topicText) {

        try {

            let topic = guessTopic(topicText);

            if (!topic) return null;

            console.log("Searching Wiki for:", topic);

            let res = await fetch(API + encodeURIComponent(topic));

            if (!res.ok) {
                console.log("Wiki not found:", topic);
                return null;
            }

            let data = await res.json();

            if (data && data.extract) {
                console.log("Wiki FOUND:", topic);
                return data.extract;
            }

            return null;

        } catch (e) {
            console.log("Wiki error:", e);
            return null;
        }
    }

    /* ---------- Resolver ---------- */
    async function resolve(text) {

        let topic = guessTopic(text);

        /* 1️⃣ Full topic */
        let info = await search(topic);
        if (info) return info;

        /* 2️⃣ First word fallback */
        let firstWord = topic.split(" ")[0];

        if (firstWord.length > 2) {
            info = await search(firstWord);
            if (info) return info;
        }

        return null;
    }

    return {
        resolve: resolve,
        search: search
    };

})();
