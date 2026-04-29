package com.ai_course_builder.app.document;

import lombok.Data;

import java.util.List;

@Data
public class QuizQuestion {
    private String id;
    private String question;
    private List<String> options;
    private String correctAnswer;
}
