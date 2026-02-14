function detectName(userText) {

    let text = userText.trim();
    let name = null;

    // Emotion words — ये कभी नाम नहीं बनेंगे
    const banned = ["उदास","खुश","दुखी","गुस्सा","परेशान","थका","अकेला","ठीक"];

    // 1️⃣ मेरा नाम राहुल है
    if (text.startsWith("मेरा नाम")) {
        name = text.replace("मेरा नाम", "")
                   .replace("है", "")
                   .trim();
    }

    // 2️⃣ मैं राहुल हूँ
    else if (text.startsWith("मैं ") && text.includes("हूँ")) {
        name = text.replace("मैं", "")
                   .replace("हूँ", "")
                   .trim();
    }

    // अगर नाम मिला
    if (name) {

        // banned words check
        if (banned.includes(name)) {
            return null;
        }

        if (name.length > 1 && name.length < 20) {
            MemoryEngine.setName(name);
            return name;
        }
    }

    return null;
}();
