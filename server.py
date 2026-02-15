# =====================================
# ANJALI v2 - PYTHON BRAIN SERVER
# =====================================

from fastapi import FastAPI
from pydantic import BaseModel

from memory import MemoryEngine

app = FastAPI()
memory = MemoryEngine()

class UserMessage(BaseModel):
    text: str

@app.post("/chat")
async def chat(msg: UserMessage):

    text = msg.text.strip()

    # ---- Name Detection ----
    if text.startswith("मेरा नाम"):
        name = text.replace("मेरा नाम", "").replace("है", "").strip()
        if len(name) > 1:
            memory.set_name(name)
            return {
                "reply": f"{name}… सुनो अच्छा… तो तुम्हारा नाम {name} है। अब मैं तुम्हें इसी नाम से बुलाऊँगी।"
            }

    # ---- Emotion Detection ----
    if "उदास" in text or "अकेला" in text:
        memory.set_mood("sad")
        return {
            "reply": f"{memory.prefix()}तुम अकेला महसूस कर रहे हो… मैं यहीं हूँ।"
        }

    # ---- Default Reply ----
    return {
        "reply": f"{memory.prefix()}मैं सुन रही हूँ… और बताओ।"
    }
