package com.ai_course_builder.app.service;

import com.ai_course_builder.app.Exceptions.LLMValidationException;
import com.ai_course_builder.app.llm.GeneratedQuizQuestions;
import com.ai_course_builder.app.llm.LessonOutline;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.ai.converter.BeanOutputConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.Resource;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;

import java.lang.reflect.Type;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class QuizGenerationService {

    private final ChatClient chatClient;

    @Value("classpath:prompts/quiz-generation.st")
    private Resource quizContentPrompt;

    @Retryable(maxAttempts = 2, backoff = @Backoff(delay=1000))
    public List<GeneratedQuizQuestions> generateQuizQuestions(LessonOutline lessonOutline){
        log.info("Generating Quiz for the lesson:{}",lessonOutline.getTitle());

        BeanOutputConverter<List<GeneratedQuizQuestions>> converter = new BeanOutputConverter<>(new ParameterizedTypeReference<List<GeneratedQuizQuestions>>() {});

        PromptTemplate template = new PromptTemplate(quizContentPrompt);
        String prompt = template.render(Map.of(
                "lessonTitle", lessonOutline.getTitle(),
                "keyConcepts", String.join(", ", lessonOutline.getKeyConcepts()),
                "objective", lessonOutline.getObjective()
        ));
        String response = chatClient.prompt().user(prompt).call().content();

        List<GeneratedQuizQuestions> questions= converter.convert(response);
        validateQuiz(questions,lessonOutline.getTitle());
        return questions;
    }
    private void validateQuiz(List<GeneratedQuizQuestions> questions,String title){
        if(questions==null || questions.isEmpty()) throw new LLMValidationException("Questions not generated for the lesson Title:{}" +title);
        for(GeneratedQuizQuestions question:questions){
            if(question.getOptions() == null || question.getOptions().size() !=4) throw new LLMValidationException("Each Question should have 4 Options " + question.getQuestion());
            if(question.getCorrectAnswer() == null || question.getCorrectAnswer().isBlank()) throw new LLMValidationException("Question has no correct answer" + question.getQuestion());
        }
    }

}
