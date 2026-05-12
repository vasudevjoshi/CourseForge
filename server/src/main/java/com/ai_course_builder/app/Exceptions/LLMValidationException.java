package com.ai_course_builder.app.Exceptions;

public class LLMValidationException extends RuntimeException{
    public LLMValidationException(String message) {
        super(message);
    }
}
