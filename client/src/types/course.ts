export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface YouTubeVideo {
  videoId: string;
  title: string;
  channelName: string;
}

export interface LessonContent {
  introduction: string;
  mainContent: string;
  summary: string;
  practiceQuestions: {
    question: string;
    hint: string;
    answer: string;
  }[];
}

export interface Lesson {
  lessonNumber: number;
  title: string;
  objective: string;
  keyConcepts: string[];
  estimatedMinutes: number;
  content: LessonContent;
  video: YouTubeVideo | null;
  quiz: QuizQuestion[];
}

export interface CourseResponse {
  courseTitle: string;
  topic: string;
  lessons: Lesson[];
}

export type GenerationStatus =
  | 'idle'
  | 'generating_outline'
  | 'generating_lessons'
  | 'finding_videos'
  | 'generating_quizzes'
  | 'done'
  | 'error';
