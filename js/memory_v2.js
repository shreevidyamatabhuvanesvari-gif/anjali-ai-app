/* ======================================
   ANJALI MEMORY v2 — STABLE CORE
   Identity + Mood + Interests + Topics
   Research Safe Version
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

    /* ---------- Safe Load ---------- */
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
            console.log("Memory load error:", e);
        }
    }

    /* ---------- Safe Save ---------- */
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

        name = name
            .replace("मेरा नाम", "")
            .replace("है", "")
            .trim();

        if (name.length < 2) return;

        data.name = name;
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
        if (data.name) {
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

        /* Attachment Growth (capped) */
        data.attachmentLevel += 0.1;
        if (data.attachmentLevel > 100) {
            data.attachmentLevel = 100;
        }

        save();
    }

    function getLastMood() {
        return data.lastMood || "";
    }

    /* ---------- Interests ---------- */
    function addInterest(topic) {
        if (!topic) return;

        topic = topic.trim();

        if (topic.length < 2) return;

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

        topic = topic.trim();

        /* avoid recent duplicate */
        var last = data.topics[data.topics.length - 1];
        if (last && last.text === topic) return;

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

    /* ---------- Reset ---------- */
    function reset() {
        localStorage.removeItem(STORAGE_KEY);
        location.reload();
    }

    /* ---------- Init ---------- */
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
