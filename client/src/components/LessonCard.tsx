import React, { useState, useReducer } from 'react';
import type { Lesson, QuizQuestion } from '../types/course';

// ─── Types ──────────────────────────────────────────────────────────────────

interface LessonCardProps {
  lesson: Lesson;
}

type InnerTab = 'content' | 'video' | 'quiz';

interface QuizState {
  selected: (string | null)[];
  submitted: boolean[];
}

type QuizAction =
  | { type: 'SELECT'; questionIdx: number; answer: string }
  | { type: 'RESET'; count: number };

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'SELECT': {
      if (state.submitted[action.questionIdx]) return state;
      const newSelected = [...state.selected];
      const newSubmitted = [...state.submitted];
      newSelected[action.questionIdx] = action.answer;
      newSubmitted[action.questionIdx] = true;
      return { selected: newSelected, submitted: newSubmitted };
    }
    case 'RESET':
      return {
        selected: Array(action.count).fill(null),
        submitted: Array(action.count).fill(false),
      };
    default:
      return state;
  }
}

// ─── Accordion Item ───────────────────────────────────────────────────────────

interface AccordionItemProps {
  question: string;
  hint: string;
  answer: string;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ question, hint, answer }) => {
  const [expanded, setExpanded] = useState<'closed' | 'hint' | 'answer'>('closed');

  const handleToggle = () => {
    setExpanded((prev) => {
      if (prev === 'closed') return 'hint';
      if (prev === 'hint') return 'answer';
      return 'closed';
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <button className="accordion-btn" onClick={handleToggle} id={`accordion-${question.slice(0, 20)}`}>
        <span style={{ flex: 1, marginRight: '0.5rem' }}>{question}</span>
        <span style={{ color: 'var(--accent)', fontSize: '0.75rem', flexShrink: 0 }}>
          {expanded === 'closed' ? '↓ Hint' : expanded === 'hint' ? '↓ Answer' : '↑ Close'}
        </span>
      </button>

      {expanded !== 'closed' && (
        <div
          className="animate-fade-in-up card-elevated"
          style={{ padding: '0.9rem 1.1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          <div>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--accent-muted)',
              }}
            >
              Hint
            </span>
            <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', marginTop: '0.25rem', lineHeight: 1.6 }}>
              {hint}
            </p>
          </div>

          {expanded === 'answer' && (
            <div
              className="animate-fade-in"
              style={{ borderTop: '1px solid var(--border)', paddingTop: '0.5rem' }}
            >
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--success)',
                }}
              >
                Answer
              </span>
              <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', marginTop: '0.25rem', lineHeight: 1.6 }}>
                {answer}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Prose Renderer ───────────────────────────────────────────────────────────

const ProseContent: React.FC<{ text: string }> = ({ text }) => {
  const paragraphs = text.split('\n').filter((p) => p.trim() !== '');

  return (
    <div className="prose-content">
      {paragraphs.map((para, i) => {
        // bold: **text**
        const parts = para.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
        return (
          <p key={i}>
            {parts.map((part, j) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={j}>{part.slice(2, -2)}</strong>;
              }
              if (part.startsWith('`') && part.endsWith('`')) {
                return <code key={j}>{part.slice(1, -1)}</code>;
              }
              return <React.Fragment key={j}>{part}</React.Fragment>;
            })}
          </p>
        );
      })}
    </div>
  );
};

// ─── Quiz Tab ─────────────────────────────────────────────────────────────────

const QuizTab: React.FC<{ quiz: QuizQuestion[] }> = ({ quiz }) => {
  const [state, dispatch] = useReducer(quizReducer, {
    selected: Array(quiz.length).fill(null),
    submitted: Array(quiz.length).fill(false),
  });

  const score = quiz.filter((q, i) => state.selected[i] === q.correctAnswer).length;
  const allAnswered = state.submitted.every(Boolean);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {quiz.map((q, qi) => (
        <div key={qi} className="card-elevated" style={{ padding: '1.25rem' }}>
          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: '1rem',
              lineHeight: 1.5,
            }}
          >
            <span style={{ color: 'var(--accent-muted)', marginRight: '0.5rem' }}>
              Q{qi + 1}.
            </span>
            {q.question}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {q.options.map((opt, oi) => {
              const isSelected = state.selected[qi] === opt;
              const isCorrect = q.correctAnswer === opt;
              const isSubmitted = state.submitted[qi];

              let optClass = 'quiz-option';
              if (isSubmitted) {
                if (isCorrect) optClass += ' quiz-option--correct';
                else if (isSelected && !isCorrect) optClass += ' quiz-option--wrong';
              }

              return (
                <button
                  key={oi}
                  className={optClass}
                  id={`quiz-q${qi}-opt${oi}`}
                  disabled={isSubmitted}
                  onClick={() => dispatch({ type: 'SELECT', questionIdx: qi, answer: opt })}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                    }}
                  >
                    <span
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        border: '1.5px solid currentColor',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        flexShrink: 0,
                        opacity: 0.7,
                      }}
                    >
                      {['A', 'B', 'C', 'D'][oi]}
                    </span>
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {allAnswered && (
        <div
          className="animate-fade-in-up card"
          style={{
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.2rem',
                fontWeight: 700,
                color: score === quiz.length ? 'var(--success)' : 'var(--accent)',
              }}
            >
              {score === quiz.length ? '🎉 Perfect score!' : `You got ${score} / ${quiz.length} correct`}
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
              {score === quiz.length
                ? "Outstanding! You've mastered this lesson."
                : 'Review the highlighted answers and try again.'}
            </p>
          </div>

          <button
            className="btn-ghost"
            onClick={() => dispatch({ type: 'RESET', count: quiz.length })}
          >
            ↺ Retake Quiz
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Video Tab ────────────────────────────────────────────────────────────────

const VideoTab: React.FC<{ lesson: Lesson }> = ({ lesson }) => {
  const { video, title } = lesson;

  if (!video) {
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(title + ' tutorial')}`;
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '3rem 2rem',
          background: 'var(--bg-elevated)',
          borderRadius: '12px',
          border: '1px solid var(--border)',
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📺</div>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', marginBottom: '0.5rem' }}>
          No embedded video available
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
          We couldn't find a specific video for this lesson.
        </p>
        <a
          href={searchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
          style={{
            display: 'inline-block',
            textDecoration: 'none',
          }}
        >
          🔎 Search on YouTube
        </a>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="video-container">
        <iframe
          src={`https://www.youtube.com/embed/${video.videoId}`}
          title={video.title}
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>

      <div
        className="card-elevated"
        style={{ padding: '1rem 1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}
      >
        <span style={{ fontSize: '1.5rem', marginTop: '2px' }}>🎬</span>
        <div>
          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1rem',
              fontWeight: 600,
              marginBottom: '0.2rem',
              color: 'var(--text-primary)',
            }}
          >
            {video.title}
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            {video.channelName}
          </p>
        </div>
      </div>
    </div>
  );
};

// ─── Main LessonCard Component ──────────────────────────────────────────────

export const LessonCard: React.FC<LessonCardProps> = ({ lesson }) => {
  const [innerTab, setInnerTab] = useState<InnerTab>('content');

  const INNER_TABS: { id: InnerTab; label: string }[] = [
    { id: 'content', label: '📄 Content' },
    { id: 'video', label: '🎥 Video' },
    { id: 'quiz', label: '✦ Quiz' },
  ];

  return (
    <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Lesson Header */}
      <div className="card" style={{ padding: '1.75rem 2rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '0.75rem',
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              background: 'var(--accent-dim)',
              border: '1px solid var(--border-accent)',
              borderRadius: '100px',
              padding: '0.22rem 0.75rem',
            }}
          >
            Lesson {lesson.lessonNumber}
          </span>

          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            ⏱ {lesson.estimatedMinutes} min
          </span>
        </div>

        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1.4rem, 3vw, 2rem)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '0.75rem',
            lineHeight: 1.25,
          }}
        >
          {lesson.title}
        </h2>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
          <em>Objective: </em>
          {lesson.objective}
        </p>

        {/* Key Concepts */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {lesson.keyConcepts.map((concept) => (
            <span key={concept} className="concept-tag">
              {concept}
            </span>
          ))}
        </div>
      </div>

      {/* Inner Tabs */}
      <div>
        <div
          style={{
            display: 'flex',
            gap: '0',
            borderBottom: '1px solid var(--border)',
            marginBottom: '1.5rem',
          }}
        >
          {INNER_TABS.map((tab) => (
            <button
              key={tab.id}
              id={`lesson-tab-${tab.id}`}
              className={`inner-tab${innerTab === tab.id ? ' inner-tab--active' : ''}`}
              onClick={() => setInnerTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div key={innerTab} className="animate-fade-in-up">
          {innerTab === 'content' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Introduction */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '1.05rem',
                    color: 'var(--accent)',
                    marginBottom: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <span>✦</span> Introduction
                </h3>
                <p style={{ color: 'var(--text-primary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                  {lesson.content.introduction}
                </p>
              </div>

              {/* Main Content */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '1.05rem',
                    color: 'var(--accent)',
                    marginBottom: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <span>📖</span> Core Content
                </h3>
                <ProseContent text={lesson.content.mainContent} />
              </div>

              {/* Summary */}
              <div
                style={{
                  padding: '1.25rem 1.5rem',
                  background: 'var(--accent-dim)',
                  border: '1px solid var(--border-accent)',
                  borderRadius: '10px',
                }}
              >
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '1rem',
                    color: 'var(--accent-muted)',
                    marginBottom: '0.5rem',
                  }}
                >
                  💡 Summary
                </h3>
                <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                  {lesson.content.summary}
                </p>
              </div>

              {/* Practice Questions */}
              {lesson.content.practiceQuestions.length > 0 && (
                <div>
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '1.05rem',
                      color: 'var(--text-primary)',
                      marginBottom: '0.75rem',
                    }}
                  >
                    🧩 Practice Questions
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {lesson.content.practiceQuestions.map((pq, i) => (
                      <AccordionItem
                        key={i}
                        question={pq.question}
                        hint={pq.hint}
                        answer={pq.answer}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {innerTab === 'video' && <VideoTab lesson={lesson} />}

          {innerTab === 'quiz' && <QuizTab quiz={lesson.quiz} />}
        </div>
      </div>
    </div>
  );
};
