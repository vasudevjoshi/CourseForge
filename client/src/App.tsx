import { useCourseGeneration } from './hooks/useCourseGeneration';
import { TopicInput } from './components/TopicInput';
import { CourseViewer } from './components/CourseViewer';
import { GenerationProgress } from './components/GenerationProgress';
import { useEffect, useState, type FormEvent } from 'react';

const WORKFLOW_STEPS = [
  {
    title: 'Describe the topic',
    description: 'Type any subject you want to learn and the app turns it into a structured starting point.',
  },
  {
    title: 'Generate the path',
    description: 'The system creates lessons, supporting videos, and practice questions in one flow.',
  },
  {
    title: 'Learn with momentum',
    description: 'Move through the course at your own pace with a focused lesson-by-lesson experience.',
  },
];

const BENEFITS = [
  {
    title: 'Clear structure',
    description: 'No more random tabs or scattered notes. Every topic becomes a guided learning sequence.',
  },
  {
    title: 'Faster discovery',
    description: 'See the outline, the lesson content, and the best supporting resources without jumping tools.',
  },
  {
    title: 'Better retention',
    description: 'Quizzes and lesson checkpoints keep the learning loop active instead of passive.',
  },
  {
    title: 'Reusable prompts',
    description: 'Reuse the same flow for interview prep, revision, or exploring a brand-new topic.',
  },
];

const AUTH_STORAGE_KEY = 'ai-course-builder.auth';

type AuthMode = 'login' | 'signup';

type AuthProfile = {
  name: string;
  email: string;
  provider: 'email' | 'google';
};

function AuthPage({ onAuth }: { onAuth: (profile: AuthProfile) => void }) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitLabel = mode === 'login' ? 'Login' : 'Create account';

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    window.setTimeout(() => {
      const trimmedEmail = email.trim();
      onAuth({
        name: name.trim() || trimmedEmail.split('@')[0] || 'Learner',
        email: trimmedEmail,
        provider: 'email',
      });
      setIsSubmitting(false);
    }, 250);
  };

  const handleGoogleAuth = () => {
    onAuth({
      name: 'Google User',
      email: 'google.user@example.com',
      provider: 'google',
    });
  };

  return (
    <main className="auth-shell">
      <section className="auth-panel animate-fade-in-up">
        <div className="auth-brand">
          <div className="home-kicker">AI course builder</div>
          <h1 className="auth-title">Sign in to build your learning path.</h1>
          <p className="auth-copy">
            Use email login, create a new account, or continue with Google. This version runs fully in the frontend and stores your session locally.
          </p>
        </div>

        <div className="auth-tabs" role="tablist" aria-label="Authentication modes">
          <button
            type="button"
            className={`auth-tab${mode === 'login' ? ' auth-tab--active' : ''}`}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            type="button"
            className={`auth-tab${mode === 'signup' ? ' auth-tab--active' : ''}`}
            onClick={() => setMode('signup')}
          >
            Sign up
          </button>
        </div>

        <button type="button" className="google-auth-btn" onClick={handleGoogleAuth}>
          <span className="google-mark">G</span>
          Continue with Google
        </button>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <label className="auth-field">
              <span>Name</span>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                autoComplete="name"
              />
            </label>
          )}

          <label className="auth-field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>

          <label className="auth-field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
            />
          </label>

          <button type="submit" className="btn-primary auth-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Please wait...' : submitLabel}
          </button>
        </form>

        <p className="auth-footnote">
          {mode === 'login'
            ? 'New here? Switch to Sign up to create a local session.'
            : 'Already have an account? Switch to Login to continue.'}
        </p>
      </section>
    </main>
  );
}

function HomePage({
  onSubmit,
  status,
  error,
  profile,
  onSignOut,
}: {
  onSubmit: (topic: string) => void;
  status: ReturnType<typeof useCourseGeneration>['status'];
  error: ReturnType<typeof useCourseGeneration>['error'];
  profile: AuthProfile;
  onSignOut: () => void;
}) {
  return (
    <main className="home-page animate-fade-in-up">
      <header className="home-topbar">
        <div>
          <div className="home-kicker">Signed in as {profile.provider === 'google' ? 'Google' : 'Email'}</div>
          <p className="home-user">
            {profile.name} · {profile.email}
          </p>
        </div>
        <button type="button" className="btn-ghost" onClick={onSignOut}>
          Sign out
        </button>
      </header>

      <section className="home-hero">
        <div className="home-kicker">AI course builder</div>
        <h1 className="home-title">
          Turn any topic into a guided learning experience.
        </h1>
        <p className="home-copy">
          Describe what you want to learn and the app assembles a course outline, lesson content,
          relevant videos, and quizzes so you can start learning immediately.
        </p>

        <div className="home-actions">
          <a className="btn-primary home-primary-action" href="#topic-builder">
            Start building
          </a>
          <p className="home-note">No setup. No blank page. Just a clear path to learn.</p>
        </div>

        <div className="home-highlights" aria-label="Key benefits">
          <div className="home-highlight-card">
            <span className="home-highlight-label">Course flow</span>
            <strong>Outline, lessons, videos, quizzes</strong>
          </div>
          <div className="home-highlight-card">
            <span className="home-highlight-label">Best for</span>
            <strong>Revision, interview prep, self-paced learning</strong>
          </div>
          <div className="home-highlight-card">
            <span className="home-highlight-label">Output</span>
            <strong>A reusable path, not just a one-off answer</strong>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="section-heading-wrap">
          <span className="section-heading-kicker">Workflow</span>
          <h2 className="section-heading-title">How the app works</h2>
        </div>

        <div className="workflow-grid">
          {WORKFLOW_STEPS.map((step, index) => (
            <article key={step.title} className="workflow-card">
              <div className="workflow-step-number">0{index + 1}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="section-heading-wrap">
          <span className="section-heading-kicker">Benefits</span>
          <h2 className="section-heading-title">Why this helps</h2>
        </div>

        <div className="benefits-grid">
          {BENEFITS.map((benefit) => (
            <article key={benefit.title} className="benefit-card">
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section home-builder" id="topic-builder">
        <div className="section-heading-wrap section-heading-wrap--compact">
          <span className="section-heading-kicker">Get started</span>
          <h2 className="section-heading-title">Build a course from a single topic</h2>
        </div>

        <TopicInput onSubmit={onSubmit} status={status} error={error} />
      </section>
    </main>
  );
}

function App() {
  const {
    courseData,
    status,
    error,
    activeLessonIndex,
    setActiveLessonIndex,
    generateCourse,
    resetCourse,
  } = useCourseGeneration();
  const [authProfile, setAuthProfile] = useState<AuthProfile | null>(null);

  const isLoading =
    status === 'generating_outline' ||
    status === 'generating_lessons' ||
    status === 'finding_videos' ||
    status === 'generating_quizzes';

  useEffect(() => {
    const storedAuth = window.localStorage.getItem(AUTH_STORAGE_KEY);

    if (!storedAuth) return;

    try {
      setAuthProfile(JSON.parse(storedAuth) as AuthProfile);
    } catch {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, []);

  const handleAuth = (profile: AuthProfile) => {
    setAuthProfile(profile);
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(profile));
  };

  const handleSignOut = () => {
    setAuthProfile(null);
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    resetCourse();
  };

  return (
    <div className="app-container">
      {/* Noise overlay for texture */}
      <div className="noise-overlay" />
      <div className="ambient-orb ambient-orb--left" />
      <div className="ambient-orb ambient-orb--right" />

      {!authProfile ? (
        <AuthPage onAuth={handleAuth} />
      ) : status === 'done' && courseData ? (
        <CourseViewer
          course={courseData}
          activeLessonIndex={activeLessonIndex}
          setActiveLessonIndex={setActiveLessonIndex}
          onReset={handleSignOut}
        />
      ) : isLoading ? (
        <GenerationProgress status={status} />
      ) : (
        <HomePage
          onSubmit={generateCourse}
          status={status}
          error={error}
          profile={authProfile}
          onSignOut={handleSignOut}
        />
      )}
    </div>
  );
}

export default App;
