package com.ai_course_builder.app.document;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "quiz_attempts")
public class QuizAttemptDocument {
    @Id
    private String id;

    private String courseId;
    private String lessonId;
    private String questionId;
    private String sessionId;
    private boolean correct;
    private String selectedAnswer;

    private LocalDateTime createdAt;
}
