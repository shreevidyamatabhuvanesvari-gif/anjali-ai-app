/* ======================================
   ANJALI ANSWER SELECTOR v2 — SMART FILTER
   Context Based Line Picker
   ====================================== */

var AnswerSelectorEngineV2 = (function () {

    function splitLines(text) {
        return text.split("।");
    }

    function score(line, query) {

        line = line.toLowerCase();
        query = query.toLowerCase();

        var s = 0;

        /* YEAR detection */
        if (query.includes("कब") || query.includes("वर्ष")) {
            if (line.match(/\d{3,4}/)) s += 5;
        }

        /* NUMBER detection */
        if (query.includes("कितने") || query.includes("संख्या")) {
            if (line.match(/\d/)) s += 4;
        }

        /* PERSON detection */
        if (query.includes("कौन")) {
            if (line.includes("थे") || line.includes("हैं")) s += 2;
        }

        /* LOCATION */
        if (query.includes("कहाँ") || query.includes("राजधानी")) {
            if (line.includes("स्थित") || line.includes("राजधानी")) s += 3;
        }

        /* word overlap bonus */
        var words = query.split(" ");
        words.forEach(function (w) {
            if (line.includes(w)) s += 1;
        });

        return s;
    }

    function pickBest(text, query) {

        if (!text) return text;

        var lines = splitLines(text);

        var best = lines[0];
        var bestScore = 0;

        lines.forEach(function (l) {
            var sc = score(l, query);
            if (sc > bestScore) {
                bestScore = sc;
                best = l;
            }
        });

        return best.trim() + "।";
    }

    return {
        pickBest: pickBest
    };

})();
