var KnowledgeEngineV2 = (function () {

    const API = "https://hi.wikipedia.org/api/rest_v1/page/summary/";

    function cleanTopic(text) {
        return (text || "")
            .replace("क्या है", "")
            .replace("कौन है", "")
            .replace("कहाँ है", "")
            .replace("कहां है", "")
            .replace("क्या होता है", "")
            .replace("बताओ", "")
            .replace("समझाओ", "")
            .replace("?", "")
            .trim();
    }

    async function resolve(text) {

        try {

            let topic = cleanTopic(text);

            if (!topic || topic.length < 1) return null;

            /* Try exact topic */
            let res = await fetch(API + encodeURIComponent(topic));

            if (res.ok) {
                let data = await res.json();
                if (data && data.extract) {
                    return data.extract;
                }
            }

            /* Try first word fallback */
            let firstWord = topic.split(" ")[0];

            if (firstWord && firstWord.length > 1) {
                let res2 = await fetch(API + encodeURIComponent(firstWord));
                if (res2.ok) {
                    let data2 = await res2.json();
                    if (data2 && data2.extract) {
                        return data2.extract;
                    }
                }
            }

        } catch (e) {
            console.log("Knowledge error:", e);
        }

        return null;
    }

    return {
        resolve: resolve
    };

})();
