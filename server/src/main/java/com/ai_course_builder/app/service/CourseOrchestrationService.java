package com.ai_course_builder.app.service;

import com.ai_course_builder.app.Exceptions.CourseGenerationException;
import com.ai_course_builder.app.document.*;
import com.ai_course_builder.app.llm.*;
import com.ai_course_builder.app.repository.CourseRepository;
import com.ai_course_builder.app.repository.LessonRepository;
import com.ai_course_builder.app.repository.PracticeQuestionRepository;
import com.ai_course_builder.app.document.YoutubeVideo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CourseOrchestrationService {

    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final PracticeQuestionRepository practiceQuestionRepository;
    private final LessonGenerationService lessonService;
    private final OutlineGenerationService outlineGenerationService;
    private final QuizGenerationService quizGenerationService;
    private final YoutubeVideoService youtubeVideoService;

    public CourseDocument buildCourse(String topic){
        String normalizedTopic = topic.toLowerCase().trim();

        Optional<CourseDocument> existingCourseOpt = courseRepository.findByNormalizedTopic(normalizedTopic);
        if(existingCourseOpt.isPresent() && existingCourseOpt.get().getStatus() == CourseDocument.CourseStatus.COMPLETED){
            log.info("Course already exists for topic: {}", topic);
            return existingCourseOpt.get();
        }

        CourseDocument course = new CourseDocument();
        course.setId(UUID.randomUUID().toString());
        course.setNormalizedTopic(normalizedTopic);
        course.setOriginalTopic(topic);
        course.setStatus(CourseDocument.CourseStatus.GENERATED);
        courseRepository.save(course);

        try{
            CourseOutline outline = outlineGenerationService.generateCourseOutline(topic);
            course.setCourseTitle(outline.getCourseTitle());

            List<CompletableFuture<String>> lessonFutures = outline
                    .getLessons()
                    .stream()
                    .map(lo -> CompletableFuture.supplyAsync(
                            ()->generateAndSaveLesson(lo,topic,course.getId()))
                    ).collect(Collectors.toList());

            List<String> lessonIds = lessonFutures.stream().map(CompletableFuture::join).toList();

            course.setLessonIds(lessonIds);
            course.setStatus(CourseDocument.CourseStatus.COMPLETED);
            courseRepository.save(course);
            log.info("Course Generation Successful for the topic {}",topic);
            return course;

        }
        catch(Exception e){
            log.error("Course Generation failed for the topic {}",topic);
            course.setStatus(CourseDocument.CourseStatus.FAILED);
            courseRepository.save(course);
            throw new CourseGenerationException("Course Generation failed for the topic " + topic);
        }
    }

    private String generateAndSaveLesson(LessonOutline lo, String topic, String courseId){

        String lessonId = UUID.randomUUID().toString();
        CompletableFuture<GeneratedLessonContent> contentFuture = CompletableFuture.supplyAsync(
                () -> lessonService.generateLessonContent(topic,lo)
        );
        CompletableFuture<List<GeneratedQuizQuestions>> quizFuture =
                CompletableFuture.supplyAsync(
                        () -> quizGenerationService.generateQuizQuestions(lo));
        GeneratedLessonContent content = contentFuture.join();
        List<GeneratedQuizQuestions> quizQuestions = quizFuture.join();
        YoutubeVideo video = youtubeVideoService.findYoutubeVideo(lo.getSearchQuery());
        List<String> practiceIds = savePracticeQuestions(
                content, lessonId, courseId);

        // Build and save lesson
        LessonDocument lesson = buildLessonDocument(
                lessonId, courseId, lo, content, quizQuestions, video, practiceIds);
        lessonRepository.save(lesson);

        log.info("Saved lesson: {}", lo.getTitle());
        return lessonId;
    }
    private List<String> savePracticeQuestions(
            GeneratedLessonContent content,
            String lessonId,
            String courseId) {

        List<PracticeQuestionDocument> docs = new ArrayList<>();
        List<GeneratedPracticeQuestion> questions = content.getPracticeQuestions();

        for (int i = 0; i < questions.size(); i++) {
            GeneratedPracticeQuestion q = questions.get(i);
            PracticeQuestionDocument doc = new PracticeQuestionDocument();
            doc.setId(UUID.randomUUID().toString());
            doc.setLessonId(lessonId);
            doc.setCourseId(courseId);
            doc.setQuestion(q.getQuestion());
            doc.setHint(q.getHint());
            doc.setAnswer(q.getAnswer());
            doc.setOrderIndex(i);
            docs.add(doc);
        }

        practiceQuestionRepository.saveAll(docs);
        return docs.stream()
                .map(PracticeQuestionDocument::getId)
                .collect(Collectors.toList());
    }

    private LessonDocument buildLessonDocument(
            String lessonId,
            String courseId,
            LessonOutline lo,
            GeneratedLessonContent content,
            List<GeneratedQuizQuestions> quizQuestions,
            YoutubeVideo video,
            List<String> practiceIds) {

        // Map content
        LessonContent lessonContent = new LessonContent();
        lessonContent.setIntroduction(content.getIntroduction());
        lessonContent.setMainContent(content.getMainContent());
        lessonContent.setSummary(content.getSummary());

        // Map quiz questions
        List<QuizQuestion> quiz = quizQuestions.stream().map(q -> {
            QuizQuestion qq = new QuizQuestion();
            qq.setId(UUID.randomUUID().toString());
            qq.setQuestion(q.getQuestion());
            qq.setOptions(q.getOptions());
            qq.setCorrectAnswer(q.getCorrectAnswer());
            return qq;
        }).collect(Collectors.toList());

        LessonDocument lesson = new LessonDocument();
        lesson.setId(lessonId);
        lesson.setCourseId(courseId);
        lesson.setLessonNumber(lo.getLessonNumber());
        lesson.setTitle(lo.getTitle());
        lesson.setObjective(lo.getObjective());
        lesson.setKeyConcepts(lo.getKeyConcepts());
        lesson.setEstimatedMinutes(lo.getEstimatedMin());
        lesson.setSearchQuery(lo.getSearchQuery());
        lesson.setContent(lessonContent);
        lesson.setVideo(video);
        lesson.setQuiz(quiz);
        lesson.setPracticeQuestionIds(practiceIds);

        return lesson;
    }
}
