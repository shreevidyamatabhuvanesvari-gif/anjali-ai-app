/* ======================================
   ANJALI KNOWLEDGE ENGINE v2 — FINAL STABLE
   Wikipedia Summary + Smart Search + Learning Cache
   ====================================== */

var KnowledgeEngineV2 = (function () {

    const API_SUMMARY = "https://hi.wikipedia.org/api/rest_v1/page/summary/";
    const API_SEARCH = "https://hi.wikipedia.org/w/api.php?action=query&list=search&srsearch=";

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

    function guessTopic(text) {
        let topic = cleanTopic(text);
        if (topic.length > 1) return topic;
        return normalize(text);
    }

    /* ---------- SUMMARY FETCH ---------- */
    async function fetchSummary(topic) {
        try {
            let res = await fetch(API_SUMMARY + encodeURIComponent(topic));
            if (!res.ok) return null;

            let data = await res.json();
            if (data && data.extract) return data.extract;

            return null;
        } catch (e) {
            console.log("Summary fetch error:", e);
            return null;
        }
    }

    /* ---------- SEARCH FALLBACK ---------- */
    async function searchTopic(text) {
        try {
            let url =
                API_SEARCH +
                encodeURIComponent(text) +
                "&format=json&origin=*";

            let res = await fetch(url);
            if (!res.ok) return null;

            let data = await res.json();

            if (
                data.query &&
                data.query.search &&
                data.query.search.length > 0
            ) {
                return data.query.search[0].title;
            }

            return null;
        } catch (e) {
            console.log("Search error:", e);
            return null;
        }
    }

    /* ---------- MAIN RESOLVE ---------- */
    async function resolve(text) {

        try {

            let topic = guessTopic(text);

            /* 0️⃣ Learning cache check */
            if (typeof LearningEngineV2 !== "undefined" && LearningEngineV2.get) {
                let cached = LearningEngineV2.get(topic);
                if (cached) return cached;
            }

            /* 1️⃣ Direct summary */
            let info = await fetchSummary(topic);
            if (info) {
                if (typeof LearningEngineV2 !== "undefined" && LearningEngineV2.set) {
                    LearningEngineV2.set(topic, info);
                }
                return info;
            }

            /* 2️⃣ Wikipedia search */
            let bestTitle = await searchTopic(topic);
            if (bestTitle) {
                info = await fetchSummary(bestTitle);
                if (info) {
                    if (typeof LearningEngineV2 !== "undefined" && LearningEngineV2.set) {
                        LearningEngineV2.set(topic, info);
                    }
                    return info;
                }
            }

            /* 3️⃣ First word fallback */
            let first = topic.split(" ")[0];
            if (first.length > 2) {
                info = await fetchSummary(first);
                if (info) {
                    if (typeof LearningEngineV2 !== "undefined" && LearningEngineV2.set) {
                        LearningEngineV2.set(topic, info);
                    }
                    return info;
                }
            }

            return null;

        } catch (e) {
            console.log("Knowledge resolve error:", e);
            return null;
        }
    }

    return {
        resolve: resolve
    };

})();
