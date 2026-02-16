var KnowledgeEngineV2 = (function () {

    const API = "https://hi.wikipedia.org/api/rest_v1/page/summary/";

    function extractTopic(text) {

        text = (text || "")
            .toLowerCase()
            .replace("क्या है", "")
            .replace("क्या होता है", "")
            .replace("कौन है", "")
            .replace("बताओ", "")
            .replace("समझाओ", "")
            .replace(/\?/g, "")
            .trim();

        return text;
    }

    async function resolve(text) {

        let topic = extractTopic(text);

        if (!topic || topic.length < 2) return null;

        try {
            const res = await fetch(API + encodeURIComponent(topic));

            if (!res.ok) return null;

            const data = await res.json();

            if (data.extract) {
                return data.extract;
            }

            return null;

        } catch (e) {
            return null;
        }
    }

    return {
        resolve: resolve
    };

})();
