/* ======================================
   ANJALI MEMORY ENGINE (Advanced Local)
   ====================================== */

const MemoryEngine = (function () {

    const KEY = "anjali_memory_v2";

    /* ---------- Default Structure ---------- */
    let memory = load() || {
        user_name: "",
        call_style: "सुनो",
        interests: [],
        habits: [],
        moods: [],
        notes: [],
        last_seen: ""
    };

    /* ---------- Load / Save ---------- */
    function load() {
        try {
            return JSON.parse(localStorage.getItem(KEY));
        } catch {
            return null;
        }
    }

    function save() {
        localStorage.setItem(KEY, JSON.stringify(memory));
    }

    /* ---------- Name ---------- */
    function setName(name) {
        if (!name) return;
        memory.user_name = name.trim();
        save();
    }

    function getName() {
        return memory.user_name || "";
    }

    /* ---------- Call Style ---------- */
    function setCallStyle(style) {
        memory.call_style = style;
        save();
    }

    function getCallPrefix() {
        const name = memory.user_name;
        const call = memory.call_style || "सुनो";

        if (name) return `${name}… ${call} `;
        return `${call}… `;
    }

    /* ---------- Interests ---------- */
    function addInterest(topic) {
        if (!topic) return;
        if (!memory.interests.includes(topic)) {
            memory.interests.push(topic);
            save();
        }
    }

    function getInterests() {
        return memory.interests;
    }

    /* ---------- Habits ---------- */
    function addHabit(habit) {
        if (!habit) return;
        if (!memory.habits.includes(habit)) {
            memory.habits.push(habit);
            save();
        }
    }

    function getHabits() {
        return memory.habits;
    }

    /* ---------- Mood History ---------- */
    function logMood(mood) {
        if (!mood) return;
        memory.moods.push({
            mood: mood,
            time: new Date().toISOString()
        });
        save();
    }

    function getLastMood() {
        if (memory.moods.length === 0) return "";
        return memory.moods[memory.moods.length - 1].mood;
    }

    /* ---------- Notes (Personal facts) ---------- */
    function addNote(note) {
        if (!note) return;
        memory.notes.push({
            text: note,
            time: new Date().toISOString()
        });
        save();
    }

    function getNotes() {
        return memory.notes;
    }

    /* ---------- Presence ---------- */
    function updateLastSeen() {
        memory.last_seen = new Date().toISOString();
        save();
    }

    function getLastSeen() {
        return memory.last_seen;
    }

    /* ---------- Export / Reset (Admin future use) ---------- */
    function exportMemory() {
        return memory;
    }

    function resetMemory() {
        localStorage.removeItem(KEY);
        memory = load() || {};
    }

    return {
        setName,
        getName,
        setCallStyle,
        getCallPrefix,
        addInterest,
        getInterests,
        addHabit,
        getHabits,
        logMood,
        getLastMood,
        addNote,
        getNotes,
        updateLastSeen,
        getLastSeen,
        exportMemory,
        resetMemory
    };

})();
