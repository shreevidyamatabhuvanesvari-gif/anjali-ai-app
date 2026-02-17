/* ======================================
   BHARAT ENGINE v2
   BharatKosh Topic Detection + Direct Answer
   Works with: bharat_data_v2.js
   ====================================== */

var BharatEngineV2 = (function () {

    /* ---------- Normalize ---------- */
    function normalize(text) {
        return (text || "")
            .toLowerCase()
            .replace(/\?/g, "")
            .replace(/,/g, "")
            .replace(/  +/g, " ")
            .trim();
    }

    /* ---------- Find Matching Topic ---------- */
    function findTopic(text) {

        if (typeof BharatKoshDataV2 === "undefined") return null;

        let input = normalize(text);

        for (let topic in BharatKoshDataV2) {

            let t = topic.toLowerCase();

            // direct match
            if (input.includes(t)) {
                return topic;
            }

            // partial match (single word)
            let words = input.split(" ");
            for (let w of words) {
                if (t.includes(w) && w.length > 2) {
                    return topic;
                }
            }
        }

        return null;
    }

    /* ---------- Resolve ---------- */
    function resolve(text) {

        try {

            let topic = findTopic(text);

            if (topic) {
                return BharatKoshDataV2[topic];
            }

            return null;

        } catch (e) {
            console.log("BharatEngine error:", e);
            return null;
        }
    }

    return {
        resolve: resolve
    };

})();
