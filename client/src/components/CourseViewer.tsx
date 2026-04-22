import React from 'react';
import type { CourseResponse } from '../types/course';
import { LessonCard } from './LessonCard';

interface CourseViewerProps {
  course: CourseResponse;
  activeLessonIndex: number;
  setActiveLessonIndex: (index: number) => void;
  onReset: () => void;
}

export const CourseViewer: React.FC<CourseViewerProps> = ({
  course,
  activeLessonIndex,
  setActiveLessonIndex,
  onReset,
}) => {
  const activeLesson = course.lessons[activeLessonIndex];

  return (
    <div className="animate-fade-in" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Fixed Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(15, 15, 15, 0.85)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            padding: '0 1.5rem',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          {/* Brand + Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', overflow: 'hidden' }}>
            <span
              style={{
                color: 'var(--accent)',
                fontSize: '1.25rem',
                filter: 'drop-shadow(0 0 8px rgba(232,201,126,0.4))',
                flexShrink: 0,
              }}
            >
              ✦
            </span>
            <div style={{ overflow: 'hidden' }}>
              <h1
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  lineHeight: 1.2,
                  marginBottom: '0.1rem',
                }}
              >
                {course.courseTitle}
              </h1>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--accent-muted)',
                  background: 'var(--accent-dim)',
                  border: '1px solid var(--border-accent)',
                  borderRadius: '100px',
                  padding: '0.1rem 0.6rem',
                }}
              >
                {course.topic}
              </span>
            </div>
          </div>

          {/* Start Over */}
          <button
            className="btn-ghost"
            onClick={onReset}
            id="start-over-btn"
            style={{ flexShrink: 0, fontSize: '0.82rem', padding: '0.4rem 0.9rem' }}
          >
            ← Sign out
          </button>
        </div>

        {/* Lesson Tabs */}
        <div
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            padding: '0 1.5rem',
            paddingBottom: '0.75rem',
          }}
        >
          <div className="tab-bar">
            {course.lessons.map((lesson, i) => (
              <button
                key={i}
                id={`lesson-tab-${i + 1}`}
                className={`tab-pill${activeLessonIndex === i ? ' tab-pill--active' : ''}`}
                onClick={() => setActiveLessonIndex(i)}
              >
                Lesson {lesson.lessonNumber}
                {activeLessonIndex !== i && (
                  <span
                    style={{
                      marginLeft: '0.4rem',
                      fontSize: '0.72rem',
                      opacity: 0.6,
                      maxWidth: '80px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      display: 'inline-block',
                      verticalAlign: 'middle',
                    }}
                  >
                    · {lesson.title.split(':')[0]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Course Stats Bar */}
      <div
        style={{
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            padding: '0.6rem 1.5rem',
            display: 'flex',
            gap: '1.5rem',
            alignItems: 'center',
          }}
        >
          {[
            { label: 'Lessons', value: course.lessons.length },
            {
              label: 'Est. Time',
              value: `${course.lessons.reduce((a, l) => a + l.estimatedMinutes, 0)} min`,
            },
            {
              label: 'Progress',
              value: `${activeLessonIndex + 1} / ${course.lessons.length}`,
            },
          ].map((stat) => (
            <div key={stat.label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{stat.label}:</span>
              <span style={{ color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 600 }}>
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <main
        style={{
          flex: 1,
          maxWidth: '900px',
          width: '100%',
          margin: '0 auto',
          padding: '2rem 1.5rem',
        }}
      >
        {activeLesson && (
          <LessonCard key={`lesson-${activeLessonIndex}`} lesson={activeLesson} />
        )}

        {/* Lesson Navigation */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '2.5rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border)',
          }}
        >
          <button
            className="btn-ghost"
            disabled={activeLessonIndex === 0}
            onClick={() => setActiveLessonIndex(activeLessonIndex - 1)}
            style={{ opacity: activeLessonIndex === 0 ? 0.3 : 1 }}
          >
            ← Previous Lesson
          </button>

          <button
            className="btn-ghost"
            disabled={activeLessonIndex === course.lessons.length - 1}
            onClick={() => setActiveLessonIndex(activeLessonIndex + 1)}
            style={{ opacity: activeLessonIndex === course.lessons.length - 1 ? 0.3 : 1 }}
          >
            Next Lesson →
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border)',
          padding: '1.25rem 1.5rem',
          textAlign: 'center',
        }}
      >
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
          Built with ✦ AI Course Builder — Knowledge, structured beautifully.
        </p>
      </footer>
    </div>
  );
};
