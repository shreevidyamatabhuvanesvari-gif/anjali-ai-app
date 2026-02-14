function detectName(userText) {

    let text = userText.trim();

    // Lowercase version for checking only
    let t = text.toLowerCase();

    let name = null;

    // 1️⃣ "मेरा नाम राहुल है"
    if (t.startsWith("मेरा नाम")) {
        name = text.replace("मेरा नाम", "")
                   .replace("है", "")
                   .trim();
    }

    // 2️⃣ "मैं राहुल हूँ"
    else if (t.startsWith("मैं ")) {
        name = text.replace("मैं", "")
                   .replace("हूँ", "")
                   .replace("हू", "")
                   .replace("hu", "")
                   .trim();
    }

    // 3️⃣ सिर्फ एक शब्द (जैसे "राहुल")
    else if (text.split(" ").length === 1 && text.length < 15) {
        name = text;
    }

    if (name && name.length < 20) {
        MemoryEngine.setName(name);
        return name;
    }

    return null;
}
