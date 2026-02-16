var KnowledgeEngineV2 = (function () {

    const API = "https://hi.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts&exintro=1&explaintext=1&titles=";

    function cleanTopic(text) {
        return (text || "")
            .replace("क्या है", "")
            .replace("कौन है", "")
            .replace("कहाँ है", "")
            .replace("कहां है", "")
            .replace("?", "")
            .trim();
    }

    async function resolve(text) {

        try {

            let topic = cleanTopic(text);
            if (!topic || topic.length < 1) return null;

            const res = await fetch(API + encodeURIComponent(topic));
            const data = await res.json();

            const pages = data.query.pages;
            const pageId = Object.keys(pages)[0];

            if (pageId && pages[pageId].extract) {
                return pages[pageId].extract;
            }

        } catch (e) {
            console.log("Wiki error:", e);
        }

        return null;
    }

    return {
        resolve: resolve
    };

})();
