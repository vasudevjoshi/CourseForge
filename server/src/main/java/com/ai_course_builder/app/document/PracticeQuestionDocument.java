package com.ai_course_builder.app.document;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "practice_questions")
public class PracticeQuestionDocument {
    @Id
    private String id;

    private String lessonId;
    private String courseId;

    private String question;
    private String answer;
    private String hint;
    private int orderIndex;
}
