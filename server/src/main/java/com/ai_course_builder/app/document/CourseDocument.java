package com.ai_course_builder.app.document;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection= "courses")
public class CourseDocument {

    @Id
    private String id;
    @Indexed(unique = true)
    private String normalizedTopic;

    private String originalTopic;
    private String courseTitle;

    private List<String> lessonIds = new ArrayList<>();
    private CourseStatus status;
    private String createdAt;
    private String updatedAt;

    public enum CourseStatus{
        GENERATED,
        FAILED,
        COMPLETED
    }

}
