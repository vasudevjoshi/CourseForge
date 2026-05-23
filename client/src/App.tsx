import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { CourseViewer } from './components/CourseViewer';
import { GenerationProgress } from './components/GenerationProgress';
import { TopicInput } from './components/TopicInput';
import { useCourseGeneration } from './hooks/useCourseGeneration';

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

const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  BUILD: '/build',
} as const;

type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
type AuthMode = 'login' | 'signup';

type AuthProfile = {
  name: string;
  email: string;
  provider: 'email' | 'google';
};

function normalizeRoute(pathname: string): AppRoute {
  if (pathname.startsWith(ROUTES.LOGIN)) return ROUTES.LOGIN;
  if (pathname.startsWith(ROUTES.SIGNUP)) return ROUTES.SIGNUP;
  if (pathname.startsWith(ROUTES.BUILD)) return ROUTES.BUILD;
  return ROUTES.HOME;
}

function AuthPage({
  mode,
  onAuth,
  onGoHome,
  onGoOtherPage,
}: {
  mode: AuthMode;
  onAuth: (profile: AuthProfile) => void;
  onGoHome: () => void;
  onGoOtherPage: () => void;
}) {
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
        <div className="page-actions" style={{ justifyContent: 'space-between', marginBottom: '1rem' }}>
          <button type="button" className="btn-ghost" onClick={onGoHome}>
            ← Home
          </button>
          <button type="button" className="btn-ghost" onClick={onGoOtherPage}>
            {mode === 'login' ? 'Go to Sign up' : 'Go to Login'}
          </button>
        </div>

        <div className="auth-brand">
          <div className="home-kicker">AI course builder</div>
          <h1 className="auth-title">
            {mode === 'login' ? 'Sign in to continue your course.' : 'Create your account to begin.'}
          </h1>
          <p className="auth-copy">
            {mode === 'login'
              ? 'Use email login or continue with Google to pick up where you left off.'
              : 'Create a local account or continue with Google to start learning faster.'}
          </p>
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
            ? 'New here? Use the button above to go to Sign up.'
            : 'Already have an account? Use the button above to go to Login.'}
        </p>
      </section>
    </main>
  );
}

function HomePage({
  profile,
  onGoToBuild,
  onGoToLogin,
  onGoToSignup,
  onSignOut,
}: {
  profile: AuthProfile | null;
  onGoToBuild: () => void;
  onGoToLogin: () => void;
  onGoToSignup: () => void;
  onSignOut: () => void;
}) {
  return (
    <main className="home-page animate-fade-in-up">
      <header className="home-topbar">
        <div>
          <div className="home-kicker">AI course builder</div>
          <p className="home-user">Build a guided learning path from any topic.</p>
        </div>
        <div className="page-actions">
          {profile ? (
            <>
              <button type="button" className="btn-ghost" onClick={onGoToBuild}>
                Open builder
              </button>
              <button type="button" className="btn-ghost" onClick={onSignOut}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <button type="button" className="btn-ghost" onClick={onGoToLogin}>
                Login
              </button>
              <button type="button" className="btn-primary" onClick={onGoToSignup}>
                Sign up
              </button>
            </>
          )}
        </div>
      </header>

      <section className="home-hero">
        <h1 className="home-title">
          Turn any topic into a guided learning experience.
        </h1>
        <p className="home-copy">
          Build a personalized course outline, lesson content, relevant videos, and quizzes in a
          focused learning flow.
        </p>

        <div className="home-actions">
          <button type="button" className="btn-primary home-primary-action" onClick={onGoToBuild}>
            Build your first AI-assisted course
          </button>
          <button type="button" className="btn-ghost" onClick={onGoToBuild}>
            Start learning
          </button>
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

      <section className="home-section home-builder home-launchpad">
        <div className="section-heading-wrap section-heading-wrap--compact">
          <span className="section-heading-kicker">Get started</span>
          <h2 className="section-heading-title">Built to move you from idea to course faster</h2>
        </div>

        <div className="launchpad-grid">
          <div className="launchpad-copy">
            <p>
              Pick a topic, jump into the builder, and generate a structured learning path instead
              of staring at a blank page.
            </p>
            <div className="home-actions home-actions--compact">
              <button type="button" className="btn-primary home-primary-action" onClick={onGoToBuild}>
                Build your first AI-assisted course
              </button>
              <button type="button" className="btn-ghost" onClick={onGoToBuild}>
                Start learning
              </button>
            </div>
          </div>

          <div className="launchpad-card">
            <div className="launchpad-stat">
              <span>01</span>
              <strong>Describe the topic</strong>
            </div>
            <div className="launchpad-stat">
              <span>02</span>
              <strong>Generate the learning path</strong>
            </div>
            <div className="launchpad-stat">
              <span>03</span>
              <strong>Learn lesson by lesson</strong>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function BuildPage({
  profile,
  onGoHome,
  onGoToLogin,
  onGoToSignup,
  onSignOut,
  onSubmit,
  status,
  error,
  courseData,
  activeLessonIndex,
  setActiveLessonIndex,
  onReset,
}: {
  profile: AuthProfile | null;
  onGoHome: () => void;
  onGoToLogin: () => void;
  onGoToSignup: () => void;
  onSignOut: () => void;
  onSubmit: (topic: string) => void;
  status: ReturnType<typeof useCourseGeneration>['status'];
  error: ReturnType<typeof useCourseGeneration>['error'];
  courseData: ReturnType<typeof useCourseGeneration>['courseData'];
  activeLessonIndex: number;
  setActiveLessonIndex: (index: number) => void;
  onReset: () => void;
}) {
  const isLoading =
    status === 'generating_outline' ||
    status === 'generating_lessons' ||
    status === 'finding_videos' ||
    status === 'generating_quizzes';

  if (status === 'done' && courseData) {
    return (
      <CourseViewer
        course={courseData}
        activeLessonIndex={activeLessonIndex}
        setActiveLessonIndex={setActiveLessonIndex}
        onReset={onReset}
      />
    );
  }

  return (
    <main className="home-page animate-fade-in-up">
      <header className="home-topbar">
        <div>
          <div className="home-kicker">Course builder</div>
          <p className="home-user">
            {profile
              ? `${profile.name} · ${profile.email}`
              : 'Login or sign up to keep your learning flow saved locally.'}
          </p>
        </div>
        <div className="page-actions">
          <button type="button" className="btn-ghost" onClick={onGoHome}>
            Home
          </button>
          {profile ? (
            <button type="button" className="btn-ghost" onClick={onSignOut}>
              Sign out
            </button>
          ) : (
            <>
              <button type="button" className="btn-ghost" onClick={onGoToLogin}>
                Login
              </button>
              <button type="button" className="btn-primary" onClick={onGoToSignup}>
                Sign up
              </button>
            </>
          )}
        </div>
      </header>

      <section className="home-hero">
        <div className="home-kicker">Build your first AI-assisted course</div>
        <h1 className="home-title">Describe one topic and get a course in return.</h1>
        <p className="home-copy">
          Start with a subject, then generate lessons, quizzes, and supporting videos in a single
          flow.
        </p>
      </section>

      {isLoading ? (
        <GenerationProgress status={status} />
      ) : (
        <section className="home-section home-builder" id="topic-builder">
          <div className="section-heading-wrap section-heading-wrap--compact">
            <span className="section-heading-kicker">Get started</span>
            <h2 className="section-heading-title">What do you want to learn?</h2>
          </div>

          <TopicInput onSubmit={onSubmit} status={status} error={error} />
        </section>
      )}
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
  const [route, setRoute] = useState<AppRoute>(() => normalizeRoute(window.location.pathname));

  const navigateTo = useCallback((nextRoute: AppRoute) => {
    if (normalizeRoute(window.location.pathname) !== nextRoute) {
      window.history.pushState({}, '', nextRoute);
    }

    setRoute(nextRoute);
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setRoute(normalizeRoute(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);

    const storedAuth = window.localStorage.getItem(AUTH_STORAGE_KEY);

    if (storedAuth) {
      try {
        setAuthProfile(JSON.parse(storedAuth) as AuthProfile);
      } catch {
        window.localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleAuth = (profile: AuthProfile) => {
    setAuthProfile(profile);
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(profile));
    navigateTo(ROUTES.BUILD);
  };

  const handleSignOut = () => {
    setAuthProfile(null);
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    resetCourse();
    navigateTo(ROUTES.HOME);
  };

  const handleCourseReset = () => {
    resetCourse();
    navigateTo(ROUTES.BUILD);
  };

  const content =
    route === ROUTES.LOGIN || route === ROUTES.SIGNUP ? (
      <AuthPage
        mode={route === ROUTES.SIGNUP ? 'signup' : 'login'}
        onAuth={handleAuth}
        onGoHome={() => navigateTo(ROUTES.HOME)}
        onGoOtherPage={() => navigateTo(route === ROUTES.LOGIN ? ROUTES.SIGNUP : ROUTES.LOGIN)}
      />
    ) : route === ROUTES.BUILD ? (
      <BuildPage
        profile={authProfile}
        onGoHome={() => navigateTo(ROUTES.HOME)}
        onGoToLogin={() => navigateTo(ROUTES.LOGIN)}
        onGoToSignup={() => navigateTo(ROUTES.SIGNUP)}
        onSignOut={handleSignOut}
        onSubmit={generateCourse}
        status={status}
        error={error}
        courseData={courseData}
        activeLessonIndex={activeLessonIndex}
        setActiveLessonIndex={setActiveLessonIndex}
        onReset={handleCourseReset}
      />
    ) : (
      <HomePage
        profile={authProfile}
        onGoToBuild={() => navigateTo(ROUTES.BUILD)}
        onGoToLogin={() => navigateTo(ROUTES.LOGIN)}
        onGoToSignup={() => navigateTo(ROUTES.SIGNUP)}
        onSignOut={handleSignOut}
      />
    );

  return (
    <div className="app-container">
      {/* Noise overlay for texture */}
      <div className="noise-overlay" />
      <div className="ambient-orb ambient-orb--left" />
      <div className="ambient-orb ambient-orb--right" />

      {content}
    </div>
  );
}

export default App;
