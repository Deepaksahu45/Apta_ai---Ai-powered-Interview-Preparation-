import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const LOADING_STEPS = [
  { text: 'Initializing secure session', icon: '🔐' },
  { text: 'Verifying credentials', icon: '✨' },
  { text: 'Loading your workspace', icon: '🚀' },
];

const Protected = ({ children }) => {
  const { loading, user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
    }, 600);
    return () => clearInterval(interval);
  }, [loading]);

  if (loading) {
    return (
      <div className="protected-loading">
        <div className="protected-loading__bg" />
        <motion.div
          className="protected-loading__content"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Glowing Orb */}
          <div className="loading-orb">
            <div className="loading-orb__core" />
            <div className="loading-orb__ring loading-orb__ring--1" />
            <div className="loading-orb__ring loading-orb__ring--2" />
          </div>

          <div className="loading-brand">
            <img src="/logo.png" alt="AptaAI" className="loading-brand__logo" />
          </div>

          {/* Steps */}
          <div className="loading-steps">
            {LOADING_STEPS.map((step, i) => (
              <motion.div
                key={i}
                className={`loading-step ${i <= currentStep ? 'loading-step--active' : ''} ${i < currentStep ? 'loading-step--done' : ''}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: i <= currentStep ? 1 : 0.3, x: 0 }}
                transition={{ delay: i * 0.3, duration: 0.3 }}
              >
                <span className="loading-step__icon">
                  {i < currentStep ? '✓' : step.icon}
                </span>
                <span className="loading-step__text">{step.text}</span>
              </motion.div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="loading-progress">
            <motion.div
              className="loading-progress__bar"
              initial={{ width: '0%' }}
              animate={{ width: `${((currentStep + 1) / LOADING_STEPS.length) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </motion.div>

        <style>{`
          .protected-loading {
            min-height: 100vh;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #050816;
            position: relative;
            overflow: hidden;
          }

          .protected-loading__bg {
            position: absolute;
            inset: 0;
            background:
              radial-gradient(ellipse 50% 40% at 50% 40%, rgba(147, 51, 234, 0.08) 0%, transparent 70%),
              radial-gradient(ellipse 40% 30% at 30% 60%, rgba(255, 46, 154, 0.05) 0%, transparent 60%);
          }

          .protected-loading__content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2rem;
            z-index: 1;
          }

          /* Orb */
          .loading-orb {
            position: relative;
            width: 80px;
            height: 80px;
          }

          .loading-orb__core {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: linear-gradient(135deg, #FF2E9A, #9333EA);
            box-shadow: 0 0 30px rgba(147, 51, 234, 0.4), 0 0 60px rgba(255, 46, 154, 0.2);
            animation: orbPulse 2s ease-in-out infinite;
          }

          .loading-orb__ring {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            border-radius: 50%;
            border: 1.5px solid transparent;
          }

          .loading-orb__ring--1 {
            width: 54px;
            height: 54px;
            border-top-color: rgba(147, 51, 234, 0.5);
            border-right-color: rgba(147, 51, 234, 0.2);
            animation: ringRotate 1.5s linear infinite;
          }

          .loading-orb__ring--2 {
            width: 74px;
            height: 74px;
            border-bottom-color: rgba(255, 46, 154, 0.4);
            border-left-color: rgba(255, 46, 154, 0.15);
            animation: ringRotate 2.5s linear infinite reverse;
          }

          @keyframes orbPulse {
            0%, 100% { box-shadow: 0 0 30px rgba(147, 51, 234, 0.4), 0 0 60px rgba(255, 46, 154, 0.2); }
            50% { box-shadow: 0 0 40px rgba(147, 51, 234, 0.6), 0 0 80px rgba(255, 46, 154, 0.3); }
          }

          @keyframes ringRotate {
            to { transform: translate(-50%, -50%) rotate(360deg); }
          }

          .loading-brand__logo {
            height: 160px;
            width: auto;
            filter: drop-shadow(0 0 20px rgba(147, 51, 234, 0.3));
            opacity: 1;
          }

          /* Steps */
          .loading-steps {
            display: flex;
            flex-direction: column;
            gap: 0.6rem;
            min-width: 240px;
          }

          .loading-step {
            display: flex;
            align-items: center;
            gap: 0.6rem;
            font-size: 0.82rem;
            color: var(--text-dim, #64748B);
            transition: color 0.3s;
          }

          .loading-step--active {
            color: var(--text-secondary, #CBD5E1);
          }

          .loading-step--done {
            color: var(--accent-green, #22C55E);
          }

          .loading-step--done .loading-step__icon {
            color: var(--accent-green, #22C55E);
          }

          .loading-step__icon {
            font-size: 0.9rem;
            width: 20px;
            text-align: center;
          }

          /* Progress */
          .loading-progress {
            width: 200px;
            height: 3px;
            background: rgba(148, 163, 184, 0.1);
            border-radius: 99px;
            overflow: hidden;
          }

          .loading-progress__bar {
            height: 100%;
            background: linear-gradient(90deg, #FF2E9A, #9333EA);
            border-radius: 99px;
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default Protected;
