/* ======================================
   ANJALI LEARNING ENGINE v2
   Local Knowledge Memory
   Saves learned facts from Wikipedia
   Level 3 – Research Stable
   ====================================== */

var LearningEngineV2 = (function () {

    const STORAGE_KEY = "anjali_learning_v2";

    var data = {
        knowledge: {},
        history: []
    };

    /* ---------- Load ---------- */
    function load() {
        try {
            var saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                var parsed = JSON.parse(saved);
                if (parsed && typeof parsed === "object") {
                    data = parsed;
                }
            }
        } catch (e) {
            console.log("Learning load error:", e);
        }
    }

    /* ---------- Save ---------- */
    function save() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.log("Learning save error:", e);
        }
    }

    /* ---------- Normalize Topic ---------- */
    function normalize(text) {
        return (text || "")
            .toLowerCase()
            .replace(/\?/g, "")
            .replace(/,/g, "")
            .replace(/  +/g, " ")
            .trim();
    }

    /* ---------- Get Learned Knowledge ---------- */
    function get(topic) {
        topic = normalize(topic);

        if (!topic) return null;

        if (data.knowledge[topic]) {
            return data.knowledge[topic];
        }

        return null;
    }

    /* ---------- Save Knowledge ---------- */
    function set(topic, info) {
        topic = normalize(topic);

        if (!topic || !info) return;

        data.knowledge[topic] = info;

        data.history.push({
            topic: topic,
            time: new Date().toISOString()
        });

        if (data.history.length > 200) {
            data.history.shift();
        }

        save();
    }

    /* ---------- Get All Learned Topics ---------- */
    function getAllTopics() {
        return Object.keys(data.knowledge);
    }

    /* ---------- Learning Size ---------- */
    function size() {
        return Object.keys(data.knowledge).length;
    }

    /* ---------- Reset ---------- */
    function reset() {
        localStorage.removeItem(STORAGE_KEY);
        location.reload();
    }

    /* ---------- Init ---------- */
    load();

    /* ---------- Public API ---------- */
    return {
        get: get,
        set: set,
        getAllTopics: getAllTopics,
        size: size,
        reset: reset
    };

})();
