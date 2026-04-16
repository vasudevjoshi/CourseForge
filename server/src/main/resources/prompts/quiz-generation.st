Generate a quiz for the following lesson:

Lesson Title: {lessonTitle}
Key Concepts: {keyConcepts}
Learning Objective: {objective}

Return ONLY a JSON array of exactly 3 multiple choice questions with no extra text:
[
  {
    "question": "string",
    "options": ["option A", "option B", "option C", "option D"],
    "correctAnswer": "string - must exactly match one of the options"
  }
]