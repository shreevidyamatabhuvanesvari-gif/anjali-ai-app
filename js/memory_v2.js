/* ======================================
   ANJALI MEMORY v2
   Identity + Mood + Interest + Personality Base
   Level 2 (Advanced) + Level 3 Ready
   ====================================== */

var MemoryEngineV2 = (function () {

    const STORAGE_KEY = "anjali_memory_v2";

    /* ---------- Default Structure ---------- */
    var data = {
        name: "",
        callStyle: "soft",
        moods: [],
        interests: [],
        topics: [],
        lastMood: "",
        attachmentLevel: 0,
        createdAt: new Date().toISOString()
    };

    /* ---------- Load Memory ---------- */
    function load() {
        try {
            var saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                data = JSON.parse(saved);
            }
        } catch (e) {
            console.log("Memory load error:", e);
        }
    }

    /* ---------- Save Memory ---------- */
    function save() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.log("Memory save error:", e);
        }
    }

    /* ---------- Name System ---------- */
    function setName(name) {
        if (!name) return;

        data.name = name.trim();
        save();
    }

    function getName() {
        return data.name || "";
    }

    function hasName() {
        return data.name && data.name.length > 0;
    }

    /* ---------- Call Prefix ---------- */
    function getCallPrefix() {
        if (data.name && data.name.length > 0) {
            return data.name + "… सुनो ";
        }
        return "सुनो… ";
    }

    /* ---------- Mood System ---------- */
    function logMood(mood) {
        if (!mood) return;

        data.lastMood = mood;

        data.moods.push({
            mood: mood,
            time: new Date().toISOString()
        });

        if (data.moods.length > 50) {
            data.moods.shift();
        }

        // attachment growth
        data.attachmentLevel += 0.1;

        save();
    }

    function getLastMood() {
        return data.lastMood || "";
    }

    /* ---------- Interest System ---------- */
    function addInterest(topic) {
        if (!topic) return;

        topic = topic.trim();

        if (data.interests.indexOf(topic) === -1) {
            data.interests.push(topic);
            save();
        }
    }

    function getInterests() {
        return data.interests || [];
    }

    /* ---------- Topic Tracking ---------- */
    function addTopic(topic) {
        if (!topic) return;

        data.topics.push({
            text: topic,
            time: new Date().toISOString()
        });

        if (data.topics.length > 100) {
            data.topics.shift();
        }

        save();
    }

    function getTopics() {
        return data.topics || [];
    }

    /* ---------- Attachment Level ---------- */
    function getAttachmentLevel() {
        return data.attachmentLevel || 0;
    }

    /* ---------- Reset Memory ---------- */
    function reset() {
        localStorage.removeItem(STORAGE_KEY);
        location.reload();
    }

    /* ---------- Initial Load ---------- */
    load();

    /* ---------- Public API ---------- */
    return {
        setName: setName,
        getName: getName,
        hasName: hasName,
        getCallPrefix: getCallPrefix,
        logMood: logMood,
        getLastMood: getLastMood,
        addInterest: addInterest,
        getInterests: getInterests,
        addTopic: addTopic,
        getTopics: getTopics,
        getAttachmentLevel: getAttachmentLevel,
        reset: reset
    };

})();
