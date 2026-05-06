package com.ai_course_builder.app.dto;

import lombok.Data;

@Data
public class QuizAttempt {

    private String sessionId;
    private String courseId;
    private String lessonId;
    private String questionId;
    private String selectedAnswer;
    private String correctAnswer;
}
