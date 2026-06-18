import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { differenceInDays, format } from 'date-fns';
import Navbar from '../components/Navbar.jsx';
import PRCard from '../components/PRCard.jsx';
import WorkoutCard from '../components/WorkoutCard.jsx';
import LogWorkoutModal from '../components/LogWorkoutModal.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/axios.js';

const MemberDashboard = () => {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [prs, setPRs] = useState({ squatPR: null, benchPR: null, deadliftPR: null });
  const [showModal, setShowModal] = useState(false);
  const [loadingWorkouts, setLoadingWorkouts] = useState(true);
  const [loadingPRs, setLoadingPRs] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const fetchWorkouts = useCallback(async () => {
    try {
      setLoadingWorkouts(true);
      const res = await api.get('/workouts/my');
      setWorkouts(res.data);
    } catch (err) {
      console.error('Failed to load workouts:', err);
    } finally {
      setLoadingWorkouts(false);
    }
  }, []);

  const fetchPRs = useCallback(async () => {
    try {
      setLoadingPRs(true);
      const res = await api.get('/workouts/prs');
      setPRs(res.data);
    } catch (err) {
      console.error('Failed to load PRs:', err);
    } finally {
      setLoadingPRs(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkouts();
    fetchPRs();
  }, [fetchWorkouts, fetchPRs]);

  const handleSessionLogged = () => {
    fetchWorkouts();
    fetchPRs();
  };

  const firstName = user?.name?.split(' ')[0]?.toUpperCase() || 'ATHLETE';
  const expiryDate = user?.membershipExpiry ? new Date(user.membershipExpiry) : null;
  const daysLeft = expiryDate ? differenceInDays(expiryDate, new Date()) : null;
  const expiryFormatted = expiryDate ? format(expiryDate, 'dd MMM yyyy') : null;

  const displayedWorkouts = showAll ? workouts : workouts.slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-[#0d0d0d]"
    >
      <Navbar />

      {/* Hero Section */}
      <div className="bg-[#141414] border-b border-[#1f1f1f]">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[rgba(255,255,255,0.3)] font-['Inter'] mb-1">Welcome Back</p>
            <div className="flex items-center gap-4 flex-wrap">
              <h1 className="font-['Bebas_Neue'] text-6xl text-white tracking-wide leading-none">{firstName}</h1>
              {user?.membershipStatus && <StatusBadge status={user.membershipStatus} />}
            </div>
          </div>

          {expiryDate && (
            <div className="text-right flex-shrink-0">
              <p className="text-[10px] uppercase tracking-widest text-[rgba(255,255,255,0.3)] font-['Inter'] mb-1">Membership Expiry</p>
              <p className="text-[rgba(255,255,255,0.6)] text-sm font-['Inter']">{expiryFormatted}</p>
              {daysLeft !== null && (
                <div className="mt-1">
                  <span className={`font-['Bebas_Neue'] text-4xl ${daysLeft < 0 ? 'text-[#ff4444]' : daysLeft <= 14 ? 'text-[#ff9900]' : 'text-[#e8ff00]'}`}>
                    {Math.abs(daysLeft)}
                  </span>
                  <span className="text-[rgba(255,255,255,0.3)] text-xs font-['Inter'] ml-2 uppercase tracking-wider">
                    {daysLeft < 0 ? 'days overdue' : 'days left'}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-10">
        {/* PR Tracker */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <h2 className="font-['Bebas_Neue'] text-3xl text-white uppercase tracking-wider">PR Tracker</h2>
            <div className="flex-1 h-px bg-[#1f1f1f]" />
          </div>

          {loadingPRs ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="bg-[#141414] border border-[#1f1f1f] border-t-2 border-t-[#e8ff00] p-6 min-h-[140px] animate-pulse">
                  <div className="h-2 bg-[#1f1f1f] rounded w-1/2 mb-4" />
                  <div className="h-10 bg-[#1f1f1f] rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <PRCard lift="squat" value={prs.squatPR} index={0} />
              <PRCard lift="bench" value={prs.benchPR} index={1} />
              <PRCard lift="deadlift" value={prs.deadliftPR} index={2} />
            </div>
          )}
        </section>

        {/* Recent Sessions */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <h2 className="font-['Bebas_Neue'] text-3xl text-white uppercase tracking-wider">Recent Sessions</h2>
              <div className="flex-1 h-px bg-[#1f1f1f] min-w-[40px]" />
            </div>
            <button
              id="log-session-btn"
              onClick={() => setShowModal(true)}
              className="bg-[#e8ff00] text-black font-bold uppercase tracking-widest text-xs px-5 py-2.5 rounded-none hover:bg-white transition-colors duration-200 font-['Inter'] whitespace-nowrap flex-shrink-0"
            >
              LOG NEW SESSION →
            </button>
          </div>

          {loadingWorkouts ? (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="bg-[#141414] border border-[#1f1f1f] p-5 animate-pulse">
                  <div className="h-3 bg-[#1f1f1f] rounded w-1/4 mb-3" />
                  <div className="h-4 bg-[#1f1f1f] rounded w-1/2 mb-3" />
                  <div className="h-2 bg-[#1f1f1f] rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : workouts.length === 0 ? (
            <div className="bg-[#141414] border border-[#1f1f1f] border-t-2 border-t-[#e8ff00] p-12 text-center">
              <p className="font-['Bebas_Neue'] text-2xl text-[rgba(255,255,255,0.2)] tracking-wide mb-3">NO SESSIONS YET</p>
              <p className="text-[rgba(255,255,255,0.3)] text-xs font-['Inter'] uppercase tracking-widest mb-6">Start logging your workouts to track progress</p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-[#e8ff00] text-black font-bold uppercase tracking-widest text-xs px-6 py-3 rounded-none hover:bg-white transition-colors duration-200 font-['Inter']"
              >
                LOG FIRST SESSION →
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {displayedWorkouts.map((w, i) => (
                  <WorkoutCard key={w._id} workout={w} index={i} />
                ))}
              </div>

              {workouts.length > 5 && (
                <div className="mt-4 text-center">
                  <button
                    id="view-all-sessions"
                    onClick={() => setShowAll(!showAll)}
                    className="border border-[#1f1f1f] text-[rgba(255,255,255,0.4)] hover:border-[#e8ff00] hover:text-[#e8ff00] rounded-none px-6 py-2 font-bold uppercase tracking-widest text-[10px] transition-all duration-200 font-['Inter']"
                  >
                    {showAll ? 'SHOW LESS ▲' : `VIEW ALL ${workouts.length} SESSIONS ▼`}
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      {showModal && (
        <LogWorkoutModal
          onClose={() => setShowModal(false)}
          onSuccess={handleSessionLogged}
        />
      )}
    </motion.div>
  );
};

export default MemberDashboard;
