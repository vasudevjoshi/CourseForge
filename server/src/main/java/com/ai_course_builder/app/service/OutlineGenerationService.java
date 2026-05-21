package com.ai_course_builder.app.service;


import com.ai_course_builder.app.Exceptions.LLMValidationException;
import com.ai_course_builder.app.llm.CourseOutline;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.ai.converter.BeanOutputConverter;
import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.core.io.Resource;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Recover;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class OutlineGenerationService {

    private final ChatClient chatClient;

    @Value("classpath:prompts/course-outline.st")
    private Resource courseOutlinePrompt;

    @Retryable(maxAttempts = 2, backoff = @Backoff(delay = 1000))
    public CourseOutline generateCourseOutline(String topic) {
        log.info("Generating the Course Outline for the topic:{}",topic);
        BeanOutputConverter<CourseOutline> converter = new  BeanOutputConverter<>(CourseOutline.class);

        PromptTemplate promptTemplate = new PromptTemplate((courseOutlinePrompt));
        String prompt = promptTemplate.render(Map.of("topic",topic));

        String response = chatClient.prompt().user(prompt).call().content();

        log.debug("llm outline response {}", response);

        CourseOutline outline = converter.convert(response);
        validateOutline(outline);
        log.debug("Successfully generated the lessosns: {}",outline.getLessons().size() );
        return outline;

    }
    private void validateOutline(CourseOutline outline){
        if(outline == null) throw new LLMValidationException("LLM returned null outline");
        if(outline.getLessons() == null || outline.getLessons().isEmpty()) throw new LLMValidationException("Outline has no lessons");
        if(outline.getLessons().size() < 2) throw new LLMValidationException("Outline has less than 2 lessons");
    }
    @Recover
    public CourseOutline recoverOutline(Exception e,String topic){
        log.error("Outline generation failed after multiple tries for the topice:{}",topic);
        throw new LLMValidationException("Failed to generate outline after multiple retries for the topic: {}",topic);
    }
}
