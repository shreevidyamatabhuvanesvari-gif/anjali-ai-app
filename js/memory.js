/* ===============================
   ANJALI ADVANCED MEMORY ENGINE
   Local Private Memory Server
   =============================== */

var MemoryEngine = (function () {

    var KEY = "anjali_memory_v2";

    /* ---------- Load / Save ---------- */
    function load() {
        try {
            var raw = localStorage.getItem(KEY);
            if (raw) return JSON.parse(raw);
        } catch (e) {}
        return defaultMemory();
    }

    function save(data) {
        try {
            localStorage.setItem(KEY, JSON.stringify(data));
        } catch (e) {}
    }

    function defaultMemory() {
        return {
            name: "",
            moods: [],
            interests: [],
            habits: [],
            notes: [],
            last_seen: ""
        };
    }

    /* ---------- Name ---------- */
    function setName(name) {
        var m = load();
        m.name = name;
        save(m);
    }

    function getName() {
        return load().name || "";
    }

    function getCallPrefix() {
        var name = getName();
        if (name) return name + "… सुनो ";
        return "सुनो… ";
    }

    /* ---------- Mood ---------- */
    function logMood(mood) {
        var m = load();
        m.moods.push({
            mood: mood,
            time: new Date().toISOString()
        });
        save(m);
    }

    function getLastMood() {
        var m = load();
        if (m.moods.length === 0) return "";
        return m.moods[m.moods.length - 1].mood;
    }

    /* ---------- Interests ---------- */
    function addInterest(topic) {
        if (!topic) return;
        var m = load();
        if (m.interests.indexOf(topic) === -1) {
            m.interests.push(topic);
            save(m);
        }
    }

    function getInterests() {
        return load().interests;
    }

    /* ---------- Habits ---------- */
    function addHabit(habit) {
        if (!habit) return;
        var m = load();
        if (m.habits.indexOf(habit) === -1) {
            m.habits.push(habit);
            save(m);
        }
    }

    function getHabits() {
        return load().habits;
    }

    /* ---------- Notes / Learning ---------- */
    function addNote(note) {
        if (!note) return;
        var m = load();
        m.notes.push({
            text: note,
            time: new Date().toISOString()
        });
        save(m);
    }

    function getNotes() {
        return load().notes;
    }

    /* ---------- Presence ---------- */
    function updateLastSeen() {
        var m = load();
        m.last_seen = new Date().toISOString();
        save(m);
    }

    function getLastSeen() {
        return load().last_seen;
    }

    /* ---------- Admin Tools ---------- */
    function exportMemory() {
        return load();
    }

    function resetAll() {
        try {
            localStorage.removeItem(KEY);
        } catch (e) {}
    }

    /* ---------- Public API ---------- */
    return {
        setName: setName,
        getName: getName,
        getCallPrefix: getCallPrefix,

        logMood: logMood,
        getLastMood: getLastMood,

        addInterest: addInterest,
        getInterests: getInterests,

        addHabit: addHabit,
        getHabits: getHabits,

        addNote: addNote,
        getNotes: getNotes,

        updateLastSeen: updateLastSeen,
        getLastSeen: getLastSeen,

        exportMemory: exportMemory,
        resetAll: resetAll
    };

})();
