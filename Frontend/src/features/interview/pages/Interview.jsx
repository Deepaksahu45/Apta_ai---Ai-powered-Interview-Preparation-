import { useState, useEffect, useRef } from 'react';
import '../style/interview.scss';
import { useInterview } from '../hooks/useInterview.js';
import { useParams, useNavigate } from 'react-router';
import { useAuth } from '../../auth/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { id: 'technical', label: 'Technical Questions', icon: '💻' },
  { id: 'behavioral', label: 'Behavioral Questions', icon: '💬' },
  { id: 'roadmap', label: 'Road Map', icon: '🗺️' },
];

// ── Animated Score Ring ──
const ScoreRing = ({ score }) => {
  const [displayed, setDisplayed] = useState(0);
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayed / 100) * circumference;
  const color = score >= 80 ? '#22C55E' : score >= 60 ? '#F59E0B' : '#EF4444';

  useEffect(() => {
    let frame;
    const animate = () => {
      setDisplayed((prev) => {
        if (prev >= score) return score;
        frame = requestAnimationFrame(animate);
        return Math.min(prev + 1, score);
      });
    };
    const timeout = setTimeout(animate, 300);
    return () => { clearTimeout(timeout); cancelAnimationFrame(frame); };
  }, [score]);

  return (
    <div className="score-ring">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(148,163,184,0.08)" strokeWidth="6" />
        <circle
          cx="50" cy="50" r={radius} fill="none" stroke={color} strokeWidth="6"
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.05s ease', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        />
      </svg>
      <div className="score-ring__value">
        <span className="score-ring__number" style={{ color }}>{displayed}</span>
        <span className="score-ring__pct">%</span>
      </div>
    </div>
  );
};

// ── Question Card ──
const QuestionCard = ({ item, index }) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      className={`q-card ${open ? 'q-card--open' : ''}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.04 * index }}
    >
      <div className="q-card__header" onClick={() => setOpen((o) => !o)}>
        <span className="q-card__index">Q{index + 1}</span>
        <p className="q-card__question">{item.question}</p>
        <span className={`q-card__chevron ${open ? 'q-card__chevron--open' : ''}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            className="q-card__body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="q-card__inner">
              <div className="q-card__section">
                <span className="q-card__tag q-card__tag--intention">Intention</span>
                <p>{item.intention}</p>
              </div>
              <div className="q-card__section">
                <span className="q-card__tag q-card__tag--answer">Model Answer</span>
                <p>{item.answer}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ── Roadmap Day ──
const RoadMapDay = ({ day, index }) => (
  <motion.div
    className="roadmap-day"
    initial={{ opacity: 0, x: -12 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.08 * index }}
  >
    <div className="roadmap-day__header">
      <span className="roadmap-day__badge">Day {day.day}</span>
      <h3 className="roadmap-day__focus">{day.focus}</h3>
    </div>
    <ul className="roadmap-day__tasks">
      {day.tasks.map((task, i) => (
        <li key={i}>
          <span className="roadmap-day__bullet" />
          {task}
        </li>
      ))}
    </ul>
  </motion.div>
);

// ── Navbar for Interview ──
const InterviewNavbar = ({ user, onLogout, onBack }) => {
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <div className="navbar__left" onClick={onBack} role="button" tabIndex={0}>
          <img src="/logo.png" alt="AptaAI" className="navbar__logo" />
        </div>
        <div className="navbar__center">
          <button className="navbar__link" onClick={onBack}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Dashboard
          </button>
        </div>
        <div className="navbar__right">
          <div className="navbar__avatar">{getInitials(user?.username)}</div>
        </div>
      </div>
    </nav>
  );
};

// ── Loading Screen ──
const InterviewLoading = () => (
  <div className="interview-loading">
    <div className="interview-loading__bg" />
    <div className="interview-loading__content">
      <div className="interview-loading__orb">
        <div className="orb-core" />
        <div className="orb-ring orb-ring--1" />
        <div className="orb-ring orb-ring--2" />
      </div>
      <p>Loading interview report...</p>
    </div>
  </div>
);

// ── Main Component ──
const Interview = () => {
  const [activeNav, setActiveNav] = useState('technical');
  const [downloading, setDownloading] = useState(false);
  const [downloadDone, setDownloadDone] = useState(false);
  const { report, getReportById, loading, getResumePdf } = useInterview();
  const { user, handleLogout } = useAuth();
  const { interviewId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    }
  }, [interviewId]);

  const handleDownload = async () => {
    setDownloading(true);
    setDownloadDone(false);
    try {
      await getResumePdf(interviewId);
      setDownloadDone(true);
      setTimeout(() => setDownloadDone(false), 3000);
    } catch (err) {
      console.log('Download error:', err);
    } finally {
      setDownloading(false);
    }
  };

  if (loading || !report) {
    return <InterviewLoading />;
  }

  const scoreLabel = report.matchScore >= 80 ? 'Strong match' : report.matchScore >= 60 ? 'Good match' : 'Needs improvement';

  return (
    <div className="interview-page">
      <InterviewNavbar user={user} onLogout={handleLogout} onBack={() => navigate('/')} />

      <motion.div
        className="interview-layout"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* ── Left Nav ── */}
        <nav className="interview-nav">
          <div className="nav-content">
            <p className="interview-nav__label">Sections</p>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                className={`interview-nav__item ${activeNav === item.id ? 'interview-nav__item--active' : ''}`}
                onClick={() => setActiveNav(item.id)}
              >
                <span className="interview-nav__icon">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className={`download-btn ${downloading ? 'download-btn--loading' : ''} ${downloadDone ? 'download-btn--done' : ''}`}
            disabled={downloading}
          >
            {downloading ? (
              <>
                <span className="download-btn__spinner" />
                Generating...
              </>
            ) : downloadDone ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Downloaded!
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download Resume
              </>
            )}
          </button>
        </nav>

        <div className="interview-divider" />

        {/* ── Center Content ── */}
        <main className="interview-content">
          <AnimatePresence mode="wait">
            {activeNav === 'technical' && (
              <motion.section key="tech" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                <div className="content-header">
                  <h2>Technical Questions</h2>
                  <span className="content-header__count">{report.technicalQuestions.length} questions</span>
                </div>
                <div className="q-list">
                  {report.technicalQuestions.map((q, i) => (
                    <QuestionCard key={i} item={q} index={i} />
                  ))}
                </div>
              </motion.section>
            )}

            {activeNav === 'behavioral' && (
              <motion.section key="behav" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                <div className="content-header">
                  <h2>Behavioral Questions</h2>
                  <span className="content-header__count">{report.behavioralQuestions.length} questions</span>
                </div>
                <div className="q-list">
                  {report.behavioralQuestions.map((q, i) => (
                    <QuestionCard key={i} item={q} index={i} />
                  ))}
                </div>
              </motion.section>
            )}

            {activeNav === 'roadmap' && (
              <motion.section key="road" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                <div className="content-header">
                  <h2>Preparation Road Map</h2>
                  <span className="content-header__count">{report.preparationPlan.length}-day plan</span>
                </div>
                <div className="roadmap-list">
                  {report.preparationPlan.map((day, i) => (
                    <RoadMapDay key={day.day} day={day} index={i} />
                  ))}
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </main>

        <div className="interview-divider" />

        {/* ── Right Sidebar ── */}
        <aside className="interview-sidebar">
          <motion.div
            className="sidebar-section"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="sidebar-label">Match Score</p>
            <ScoreRing score={report.matchScore} />
            <p className="sidebar-score-label">{scoreLabel}</p>
          </motion.div>

          <div className="sidebar-divider" />

          <motion.div
            className="sidebar-section"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="sidebar-label">Skill Gaps</p>
            <div className="skill-gaps__list">
              {report.skillGaps.map((gap, i) => (
                <motion.span
                  key={i}
                  className={`skill-tag skill-tag--${gap.severity}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.35 + i * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {gap.skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </aside>
      </motion.div>
    </div>
  );
};

export default Interview;
