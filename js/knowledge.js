/* ======================================
   ANJALI KNOWLEDGE ENGINE
   Wikipedia Free Knowledge Fetch
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
    };

})();
