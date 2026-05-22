package com.ai_course_builder.app.service;

import com.ai_course_builder.app.Exceptions.LLMValidationException;
import com.ai_course_builder.app.llm.CourseOutline;
import com.ai_course_builder.app.llm.LessonOutline;
import com.ai_course_builder.app.llm.GeneratedLessonContent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.ai.converter.BeanOutputConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class LessonGenerationService {

    private final ChatClient chatClient;

    @Value("classpath:prompts/lesson-content.st")
    private Resource lessonContentPrompt;

    @Retryable(maxAttempts = 2, backoff = @Backoff(delay = 1000))
    public GeneratedLessonContent generateLessonContent(String topic, LessonOutline lessonOutline){
        log.info("Generating lesso n content for topic: {} and lesson outline: {}", topic, lessonOutline);

        BeanOutputConverter<GeneratedLessonContent> converter = new BeanOutputConverter<>(GeneratedLessonContent.class);

        PromptTemplate promptTemplate = new PromptTemplate(lessonContentPrompt);
        String prompt = promptTemplate.render(Map.of("topic", topic, "lessonOutline", lessonOutline));

        String response = chatClient.prompt().user(prompt).call().content();

        GeneratedLessonContent content = converter.convert(response);
        validateContent(content,topic);
        return content;
    }

    private void validateContent(GeneratedLessonContent content,String topic){
        if(content == null) throw new LLMValidationException("Null content for the topic: {}" + topic);
        if(content.getMainContent()== null || content.getMainContent().isBlank()) throw new LLMValidationException("Empty main content for the lesson" + topic);
        if(content.getPracticeQuestions() == null || content.getPracticeQuestions().isEmpty()) throw new LLMValidationException("Lesson has no pratice Questions" +topic);
    }

}
