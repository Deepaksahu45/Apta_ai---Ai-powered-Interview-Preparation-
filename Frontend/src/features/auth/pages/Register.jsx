import { useState } from 'react';
import '../auth.form.scss';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

const Register = () => {
  const navigate = useNavigate();
  const [username, setusername] = useState('');
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { loading, handleRegister } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await handleRegister(username, email, password);
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      {/* Floating Particles */}
      <div className="auth-particles">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>

      {/* Left: Branding */}
      <motion.div
        className="auth-branding"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="auth-branding__content">
          <div className="auth-branding__logo">
            <img src="/logo.png" alt="AptaAI Logo" />
          </div>

          <h1 className="auth-branding__tagline">
            Your AI-Powered{' '}
            <span className="highlight-gradient">Interview Companion</span>
          </h1>

          <p className="auth-branding__subtitle">
            Join thousands of candidates who have transformed their interview 
            preparation with intelligent AI-driven strategies.
          </p>

          <div className="auth-features">
            <div className="auth-feature">
              <div className="auth-feature__icon">🎯</div>
              <div className="auth-feature__text">
                <h4>Smart Interview Strategy</h4>
                <p>AI analyzes job descriptions and creates a tailored preparation plan</p>
              </div>
            </div>

            <div className="auth-feature">
              <div className="auth-feature__icon">💡</div>
              <div className="auth-feature__text">
                <h4>Technical & Behavioral Prep</h4>
                <p>Get real interview questions with expert-level model answers</p>
              </div>
            </div>

            <div className="auth-feature">
              <div className="auth-feature__icon">📄</div>
              <div className="auth-feature__text">
                <h4>AI-Optimized Resume</h4>
                <p>Download a professionally enhanced resume tailored to each role</p>
              </div>
            </div>

            <div className="auth-feature">
              <div className="auth-feature__icon">🗺️</div>
              <div className="auth-feature__text">
                <h4>Learning Roadmap</h4>
                <p>Get a structured plan to close your skill gaps before the interview</p>
              </div>
            </div>
          </div>

          <div className="auth-social-proof">
            <div className="auth-avatars">
              <span>AK</span>
              <span>SR</span>
              <span>MJ</span>
              <span>PD</span>
            </div>
            <p className="auth-social-proof__text">
              <strong>2,000+</strong> candidates prepared successfully
            </p>
          </div>
        </div>
      </motion.div>

      {/* Right: Form */}
      <div className="auth-form-panel">
        <motion.div
          className="auth-form-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
        >
          <h2 className="auth-form__title">Create your account</h2>
          <p className="auth-form__desc">Start your AI-powered interview journey</p>

          {/* Error Toast */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="auth-toast auth-toast--error"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Toast */}
          <AnimatePresence>
            {success && (
              <motion.div
                className="auth-toast auth-toast--success"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span>{success}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-input-group">
              <label htmlFor="username">Full name</label>
              <div className="auth-input-wrapper">
                <input
                  onChange={(e) => setusername(e.target.value)}
                  type="text"
                  name="username"
                  id="username"
                  placeholder="John Doe"
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label htmlFor="email">Email address</label>
              <div className="auth-input-wrapper">
                <input
                  onChange={(e) => setemail(e.target.value)}
                  type="email"
                  name="email"
                  id="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label htmlFor="password">Password</label>
              <div className="auth-input-wrapper">
                <input
                  onChange={(e) => setpassword(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  id="password"
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={`auth-submit ${loading ? 'loading' : ''}`}
              disabled={loading || success}
            >
              {loading ? 'Creating account...' : success ? '✓ Account created!' : 'Create account'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{' '}
            <Link to="/login">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
