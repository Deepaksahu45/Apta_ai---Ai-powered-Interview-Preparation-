import '../style/home.scss';
import { useState, useRef } from 'react';
import { useInterview } from '../hooks/useInterview';
import { useNavigate } from 'react-router';
import { useAuth } from '../../auth/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Animated AI Loading Screen ── */
const LOADING_STEPS = [
  { text: 'Parsing Resume', delay: 0 },
  { text: 'Extracting Skills', delay: 2 },
  { text: 'Matching Job Requirements', delay: 5 },
  { text: 'Generating Interview Questions', delay: 9 },
  { text: 'Building Learning Roadmap', delay: 14 },
  { text: 'Preparing Your Strategy', delay: 20 },
];

const AILoadingScreen = () => {
  const [completedSteps, setCompletedSteps] = useState(0);

  useState(() => {
    const timers = LOADING_STEPS.map((step, i) =>
      setTimeout(() => setCompletedSteps(i + 1), step.delay * 1000)
    );
    return () => timers.forEach(clearTimeout);
  });

  return (
    <div className="ai-loading">
      <div className="ai-loading__bg" />

      <motion.div
        className="ai-loading__content"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Orb */}
        <div className="ai-loading__orb">
          <div className="orb-core" />
          <div className="orb-ring orb-ring--1" />
          <div className="orb-ring orb-ring--2" />
          <div className="orb-ring orb-ring--3" />
        </div>

        <h2 className="ai-loading__title">AI is analyzing your profile</h2>
        <p className="ai-loading__sub">This may take up to 30 seconds</p>

        {/* Steps */}
        <div className="ai-loading__steps">
          {LOADING_STEPS.map((step, i) => (
            <motion.div
              key={i}
              className={`ai-step ${i < completedSteps ? 'ai-step--done' : i === completedSteps ? 'ai-step--active' : ''}`}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.3 }}
            >
              <span className="ai-step__icon">
                {i < completedSteps ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : i === completedSteps ? (
                  <span className="ai-step__spinner" />
                ) : (
                  <span className="ai-step__dot" />
                )}
              </span>
              <span className="ai-step__text">{step.text}</span>
            </motion.div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="ai-loading__progress">
          <motion.div
            className="ai-loading__progress-bar"
            initial={{ width: '0%' }}
            animate={{ width: `${Math.min((completedSteps / LOADING_STEPS.length) * 100, 95)}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </motion.div>
    </div>
  );
};

/* ── Navbar ── */
const Navbar = ({ user, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        {/* Logo */}
        <div className="navbar__left" onClick={() => navigate('/')} role="button" tabIndex={0}>
          <img src="/logo.png" alt="AptaAI" className="navbar__logo" />
        </div>

        {/* Desktop Navigation */}
        <div className="navbar__center">
          <button className="navbar__link navbar__link--active" onClick={() => navigate('/')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Dashboard
          </button>
        </div>

        {/* User Section */}
        <div className="navbar__right">
          <div className="navbar__user" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <div className="navbar__avatar">
              {getInitials(user?.username)}
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`navbar__chevron ${dropdownOpen ? 'navbar__chevron--open' : ''}`}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>

          {/* Dropdown */}
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                className="navbar__dropdown"
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
              >
                <div className="navbar__dropdown-header">
                  <div className="navbar__dropdown-avatar">{getInitials(user?.username)}</div>
                  <div>
                    <p className="navbar__dropdown-name">{user?.username || 'User'}</p>
                    <p className="navbar__dropdown-email">{user?.email || ''}</p>
                  </div>
                </div>
                <div className="navbar__dropdown-divider" />
                <button className="navbar__dropdown-item navbar__dropdown-item--danger" onClick={onLogout}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Sign out
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile Hamburger */}
          <button className="navbar__hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="navbar__mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="navbar__mobile-user">
              <div className="navbar__avatar">{getInitials(user?.username)}</div>
              <div>
                <p className="navbar__dropdown-name">{user?.username || 'User'}</p>
                <p className="navbar__dropdown-email">{user?.email || ''}</p>
              </div>
            </div>
            <button className="navbar__mobile-item" onClick={() => { navigate('/'); setMobileMenuOpen(false); }}>
              Dashboard
            </button>
            <button className="navbar__mobile-item navbar__mobile-item--danger" onClick={onLogout}>
              Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

/* ── Empty State ── */
const EmptyReports = () => (
  <motion.div
    className="empty-state"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
  >
    <div className="empty-state__icon">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    </div>
    <h3>No interview plans yet</h3>
    <p>Create your first AI-powered interview strategy above</p>
  </motion.div>
);

/* ── Main Home Component ── */
const Home = () => {
  const { loading, generateReport, reports } = useInterview();
  const { user, handleLogout } = useAuth();
  const [jobDescription, setJobDescription] = useState('');
  const [selfDescription, setSelfDescription] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const resumeInputRef = useRef(null);
  const navigate = useNavigate();

  const onLogout = async () => {
    await handleLogout();
    navigate('/login');
  };

  /**
   * Generate Interview Report
   */
  const handleGenerateReport = async () => {
    try {
      const resumeFile = resumeInputRef.current?.files?.[0];

      // validation
      if (!resumeFile && !selfDescription.trim()) {
        alert('Please upload a resume or add self description');
        return;
      }

      if (!jobDescription.trim()) {
        alert('Job description is required');
        return;
      }

      const data = await generateReport({
        jobDescription,
        selfDescription,
        resumeFile,
      });

      console.log(data);

      if (data?._id) {
        navigate(`/interview/${data._id}`);
      }
    } catch (error) {
      console.log('Error generating report:', error);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'application/pdf' || file.name.endsWith('.docx') || file.name.endsWith('.doc'))) {
      const dt = new DataTransfer();
      dt.items.add(file);
      resumeInputRef.current.files = dt.files;
      setSelectedFileName(file.name);
    }
  };

  const removeFile = () => {
    resumeInputRef.current.value = '';
    setSelectedFileName('');
  };

  /**
   * Loading Screen
   */
  if (loading) {
    return <AILoadingScreen />;
  }

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="home-page">
      <Navbar user={user} onLogout={onLogout} />

      <motion.div
        className="home"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* ── Hero Header ── */}
        <motion.header
          className="home__header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p className="home__greeting">{greeting()}, {user?.username || 'there'} 👋</p>
          <h1 className="home__title">
            Create Your Custom <span className="home__title--accent">Interview Plan</span>
          </h1>
          <p className="home__subtitle">
            Let our AI analyze the job requirements and your unique profile to build a
            winning strategy.
          </p>
        </motion.header>

        {/* ── Main Content ── */}
        <main className="home__content">
          {/* LEFT CARD */}
          <motion.section
            className="home__card home__card--left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="home__card-header">
              <span className="home__card-icon">🎯</span>
              <h2 className="home__card-title">Target Job Description</h2>
              <span className="home__badge home__badge--required">Required</span>
            </div>

            <div className="home__textarea-wrapper">
              <textarea
                id="jobDescription"
                name="jobDescription"
                className="home__textarea"
                placeholder={`Paste the full job description here...\n\ne.g. "Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design..."`}
                maxLength={5000}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
              <span className="home__char-count">{jobDescription.length} / 5000</span>
            </div>
          </motion.section>

          {/* RIGHT CARD */}
          <motion.section
            className="home__card home__card--right"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="home__card-header">
              <span className="home__card-icon">👤</span>
              <h2 className="home__card-title">Your Profile</h2>
            </div>

            {/* Resume Upload */}
            <div className="home__field">
              <div className="home__field-label">
                <span>Upload Resume</span>
                <span className="home__badge home__badge--recommended">Best Results</span>
              </div>

              {selectedFileName ? (
                <div className="home__file-preview">
                  <div className="home__file-info">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    <span className="home__file-name">{selectedFileName}</span>
                  </div>
                  <button className="home__file-remove" onClick={removeFile} title="Remove file">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="resume"
                  className={`home__dropzone ${isDragging ? 'home__dropzone--dragging' : ''}`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                >
                  <div className="home__dropzone-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <p className="home__dropzone-text">Click to upload or drag & drop</p>
                  <p className="home__dropzone-hint">PDF or DOCX (Max 5MB)</p>
                </label>
              )}

              <input
                ref={resumeInputRef}
                hidden
                type="file"
                name="resume"
                id="resume"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) setSelectedFileName(file.name);
                }}
              />
            </div>

            <div className="home__divider">
              <span>OR</span>
            </div>

            {/* Self Description */}
            <div className="home__field">
              <label htmlFor="selfDescription" className="home__field-label">
                Quick Self-Description
              </label>
              <textarea
                id="selfDescription"
                name="selfDescription"
                className="home__textarea home__textarea--small"
                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                value={selfDescription}
                onChange={(e) => setSelfDescription(e.target.value)}
              />
            </div>

            {/* Info Banner */}
            <div className="home__info-banner">
              <span className="home__info-dot" />
              <p>
                Either a <strong>Resume</strong> or a <strong>Self Description</strong> is
                required to generate a personalized plan.
              </p>
            </div>
          </motion.section>
        </main>

        {/* Recent Reports */}
        <motion.section
          className="recent-reports"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="recent-reports__header">
            <h2>My Recent Interview Plans</h2>
            {reports.length > 0 && (
              <span className="recent-reports__count">{reports.length} plans</span>
            )}
          </div>

          {reports.length > 0 ? (
            <ul className="reports-list">
              {reports.map((report, i) => (
                <motion.li
                  key={report._id}
                  className="report-item"
                  onClick={() => navigate(`/interview/${report._id}`)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  whileHover={{ y: -2 }}
                >
                  <div className="report-item__top">
                    <h3>{report.title || 'Untitled Position'}</h3>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="report-item__arrow">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                  <p className="report-meta">
                    {report.createdAt
                      ? new Date(report.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'Recently generated'}
                  </p>
                  <div className={`report-score ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>
                    <span className="report-score__value">{report.matchScore}%</span>
                    <span className="report-score__label">match</span>
                  </div>
                </motion.li>
              ))}
            </ul>
          ) : (
            <EmptyReports />
          )}
        </motion.section>

        {/* Footer / CTA */}
        <motion.footer
          className="home__footer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="home__footer-meta">
            <span>AI-Powered Strategy Generation</span>
            <span className="home__footer-sep">•</span>
            <span>~30 seconds</span>
          </div>

          <button type="button" className="home__cta" onClick={handleGenerateReport}>
            <span className="home__cta-pulse" />
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            Generate My Interview Strategy
          </button>
        </motion.footer>

        {/* Legal */}
        <nav className="home__legal">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
          <a href="#help">Help Center</a>
        </nav>
      </motion.div>
    </div>
  );
};

export default Home;
