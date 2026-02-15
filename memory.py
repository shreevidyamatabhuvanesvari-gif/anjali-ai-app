# =====================================
# MEMORY ENGINE v2 (Python)
# =====================================

class MemoryEngine:

    def __init__(self):
        self.name = ""
        self.mood = ""
        self.interests = []

    def set_name(self, name: str):
        self.name = name

    def get_name(self):
        return self.name

    def set_mood(self, mood: str):
        self.mood = mood

    def get_mood(self):
        return self.mood

    def add_interest(self, topic: str):
        if topic not in self.interests:
            self.interests.append(topic)

    def prefix(self):
        if self.name:
            return f"{self.name}… सुनो "
        return "सुनो… "
