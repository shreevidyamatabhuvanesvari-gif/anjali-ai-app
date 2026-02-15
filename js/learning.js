/* ======================================
   ANJALI LEARNING ENGINE (Level 3)
   Adaptive Knowledge + Interest Tracking
   ====================================== */

var LearningEngine = (function () {

    var KEY = "anjali_learning_v3";

    /* ---------- Load Storage ---------- */
    function load() {
        try {
            var raw = localStorage.getItem(KEY);
            if (raw) return JSON.parse(raw);
        } catch (e) {}
        return { topics: {} };
    }

    /* ---------- Save Storage ---------- */
    function save(data) {
        try {
            localStorage.setItem(KEY, JSON.stringify(data));
        } catch (e) {}
    }

    /* ---------- Topic Cleaner ---------- */
    function normalizeTopic(text) {
        if (!text) return "";

        var t = text.toLowerCase();

        t = t.replace("क्या है", "");
        t = t.replace("कौन है", "");
        t = t.replace("क्या होता है", "");
        t = t.replace("क्या होता", "");
        t = t.replace("क्या", "");

        return t.trim();
    }

    /* ---------- Get Cached Knowledge ---------- */
    function get(text) {

        var topic = normalizeTopic(text);
        if (!topic) return null;

        var db = load();

        if (db.topics[topic]) {
            var item = db.topics[topic];

            item.count = (item.count || 0) + 1;
            item.interest = (item.interest || 0) + 1;
            item.last_time = new Date().toISOString();

            save(db);

            return item.answer || null;
        }

        return null;
    }

    /* ---------- Save Knowledge ---------- */
    function set(text, answer) {

        if (!text || !answer) return;

        var topic = normalizeTopic(text);
        if (!topic) return;

        var db = load();
        var now = new Date().toISOString();

        if (!db.topics[topic]) {
            db.topics[topic] = {
                answer: answer,
                count: 1,
                interest: 1,
                last_time: now
            };
        } else {
            db.topics[topic].answer = answer;
            db.topics[topic].count += 1;
            db.topics[topic].interest += 1;
            db.topics[topic].last_time = now;
        }

        save(db);
    }

    /* ---------- Top Interest Topics ---------- */
    function getTopInterests(limit) {

        var db = load();
        var list = [];

        for (var key in db.topics) {
            list.push({
                topic: key,
                interest: db.topics[key].interest || 0,
                count: db.topics[key].count || 0
            });
        }

        list.sort(function (a, b) {
            return b.interest - a.interest;
        });

        return list.slice(0, limit || 5);
    }

    /* ---------- Export All Data ---------- */
    function exportAll() {
        return load();
    }

    /* ---------- Reset ---------- */
    function resetAll() {
        try {
            localStorage.removeItem(KEY);
        } catch (e) {}
    }

    /* ---------- Public API ---------- */
    return {
        get: get,
        set: set,
        getTopInterests: getTopInterests,
        exportAll: exportAll,
        resetAll: resetAll
    };

})();
