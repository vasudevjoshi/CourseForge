Generate a structured course outline for the topic: "{topic}"

Create exactly 3 lessons. Return ONLY this JSON structure with no extra text:
{
  "courseTitle": "string",
  "topic": "string",
  "lessons": [
    {
      "lessonNumber": 1,
      "title": "string",
      "objective": "string - one clear learning goal",
      "keyConcepts": ["concept1", "concept2", "concept3"],
      "estimatedMinutes": 20,
      "searchQuery": "string - optimized YouTube search query for this lesson"
    }
  ]
}