var KnowledgeEngineV2 = (function () {

    const API_SUMMARY = "https://hi.wikipedia.org/api/rest_v1/page/summary/";
    const API_SEARCH = "https://hi.wikipedia.org/w/api.php?action=query&list=search&srsearch=";

    function normalize(text) {
        return (text || "")
            .toLowerCase()
            .replace(/\?/g, "")
            .replace(/,/g, "")
            .replace(/  +/g, " ")
            .trim();
    }

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
        } catch {
            return null;
        }
    }

    /* ---------- SEARCH FALLBACK ---------- */
    async function searchTopic(text) {
        try {
            let url = API_SEARCH + encodeURIComponent(text) + "&format=json&origin=*";
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
        } catch {
            return null;
        }
    }

    /* ---------- DEEP RESOLVE ---------- */
    async function resolve(text) {

        let topic = guessTopic(text);

        /* 1️⃣ Direct summary */
        let info = await fetchSummary(topic);
        if (info) return info;

        /* 2️⃣ Search Wikipedia for best title */
        let bestTitle = await searchTopic(topic);
        if (bestTitle) {
            info = await fetchSummary(bestTitle);
            if (info) return info;
        }

        /* 3️⃣ Try first word */
        let first = topic.split(" ")[0];
        if (first.length > 2) {
            info = await fetchSummary(first);
            if (info) return info;
        }

        return null;
    }

    return {
        resolve: resolve
    };

})();
