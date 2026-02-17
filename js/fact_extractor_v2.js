/* ======================================
   ANJALI FACT EXTRACTOR v2
   Variable Length Answer Builder
   Short + Medium + Deep Control
   ====================================== */

var FactExtractorV2 = (function () {

    /* ---------- Clean Text ---------- */
    function clean(text) {
        if (!text) return "";

        return text
            .replace(/\s+/g, " ")
            .replace(/\n/g, " ")
            .trim();
    }

    /* ---------- Detect Depth Needed ---------- */
    function detectDepth(question) {

        question = (question || "").toLowerCase();

        // Deep questions
        if (
            question.includes("कैसे") ||
            question.includes("क्यों") ||
            question.includes("अंतर") ||
            question.includes("समझाओ") ||
            question.includes("विवरण")
        ) return "deep";

        // Medium
        if (
            question.includes("क्या है") ||
            question.includes("कौन है") ||
            question.includes("कहाँ") ||
            question.includes("कब")
        ) return "medium";

        // Default short
        return "short";
    }

    /* ---------- Extract Fact ---------- */
    function extract(text, question) {

        text = clean(text);
        if (!text) return "";

        let sentences = text.split("।");

        let depth = detectDepth(question);

        /* SHORT → 1 sentence */
        if (depth === "short") {
            return sentences[0] + "।";
        }

        /* MEDIUM → 2 sentences */
        if (depth === "medium") {
            return sentences.slice(0, 2).join("।") + "।";
        }

        /* DEEP → 3–4 sentences */
        return sentences.slice(0, 4).join("।") + "।";
    }

    return {
        extract: extract
    };

})();
