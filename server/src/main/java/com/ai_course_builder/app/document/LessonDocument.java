package com.ai_course_builder.app.document;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "lessons")
public class LessonDocument {
    @Id
    private String id;

    @Indexed
    private String courseId;

    private int lessonNumber;
    private String title;
    private String objective;
    private List<String> keyConcepts;
    private int estimatedMinutes;
    private String searchQuery;


    private LessonContent content;
    private YoutubeVideo video;
    private List<QuizQuestion> quiz;

    private List<String> practiceQuestions = new ArrayList<>();


}
