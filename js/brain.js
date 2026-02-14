function detectName(userText) {

    let text = userText.trim();
    let name = null;

    // मेरा नाम राहुल है
    if (text.startsWith("मेरा नाम")) {
        name = text.replace("मेरा नाम", "")
                   .replace("है", "")
                   .trim();
    }

    // मैं राहुल हूँ
    else if (text.startsWith("मैं ")) {
        name = text.replace("मैं", "")
                   .replace("हूँ", "")
                   .replace("हू", "")
                   .trim();
    }

    // ❌ single-word rule हटा दिया गया

    if (name && name.length > 1 && name.length < 20) {
        MemoryEngine.setName(name);
        return name;
    }

    return null;
}
