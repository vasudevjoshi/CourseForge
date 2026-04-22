import React, { useState, useEffect, useRef } from 'react';
import type { GenerationStatus } from '../types/course';

interface TopicInputProps {
  onSubmit: (topic: string) => void;
  status: GenerationStatus;
  error: string | null;
}

export const TopicInput: React.FC<TopicInputProps> = ({ onSubmit, status, error }) => {
  const [topic, setTopic] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = topic.trim();
    if (trimmed) {
      onSubmit(trimmed);
    }
  };

  return (
    <div className="topic-builder-card animate-fade-in-up">
      <form onSubmit={handleSubmit} className="topic-builder-form">
        <div className="topic-input-wrapper">
          <input
            ref={inputRef}
            className="topic-input"
            type="text"
            placeholder="e.g. Pointers in C++, React hooks, Binary Search Trees..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="btn-primary topic-builder-submit"
          disabled={!topic.trim()}
        >
          Build My Course
        </button>
      </form>

      {status === 'error' && error && (
        <div className="topic-builder-error animate-fade-in">
          <span style={{ flexShrink: 0, marginTop: '1px' }}>⚠</span>
          <div>
            <strong style={{ display: 'block', marginBottom: '0.2rem' }}>Something went wrong</strong>
            {error}
          </div>
        </div>
      )}

      {status === 'idle' && (
        <div className="topic-builder-examples animate-fade-in">
          <p className="topic-builder-label">Try these</p>
          <div className="topic-builder-pills">
            {[
              'Binary Trees in Python',
              'REST API Design',
              'CSS Grid Layout',
              'Async/Await in JavaScript',
              'SQL Joins',
            ].map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => setTopic(example)}
                className="topic-builder-pill"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
