/* ======================================
   ANJALI ANSWER SELECTOR ENGINE v2
   Smart Sentence Picker
   Extracts best line from Wikipedia text
   ====================================== */

var AnswerSelectorEngineV2 = (function () {

    /* ---------- Split into Sentences ---------- */
    function splitSentences(text) {
        if (!text) return [];

        return text
            .replace(/\n/g, " ")
            .split(/[।.!?]/)
            .map(s => s.trim())
            .filter(s => s.length > 15);
    }

    /* ---------- Keyword Score ---------- */
    function score(sentence, query) {

        var q = query.toLowerCase();
        var s = sentence.toLowerCase();

        var words = q.split(" ");
        var score = 0;

        words.forEach(w => {
            if (w.length > 2 && s.includes(w)) {
                score += 2;
            }
        });

        if (s.includes("राजधानी")) score += 3;
        if (s.includes("संख्या")) score += 3;
        if (s.includes("कब")) score += 3;

        return score;
    }

    /* ---------- Best Sentence Finder ---------- */
    function pickBest(text, query) {

        var sentences = splitSentences(text);
        if (sentences.length === 0) return text;

        var best = sentences[0];
        var bestScore = 0;

        sentences.forEach(s => {
            var sc = score(s, query);
            if (sc > bestScore) {
                bestScore = sc;
                best = s;
            }
        });

        return best;
    }

    return {
        pickBest: pickBest
    };

})();
