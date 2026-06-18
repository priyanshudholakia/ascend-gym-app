import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, differenceInDays } from 'date-fns';
import StatusBadge from './StatusBadge.jsx';
import api from '../api/axios.js';

const MemberDetailModal = ({ member, onClose, onMembershipUpdated }) => {
  const [workouts, setWorkouts] = useState([]);
  const [loadingWorkouts, setLoadingWorkouts] = useState(true);
  const [updatingMembership, setUpdatingMembership] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [newStatus, setNewStatus] = useState(member.membershipStatus || 'active');
  const [newExpiry, setNewExpiry] = useState(
    member.membershipExpiry ? format(new Date(member.membershipExpiry), 'yyyy-MM-dd') : ''
  );
  const [updateError, setUpdateError] = useState('');
  const [currentMember, setCurrentMember] = useState(member);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setLoadingWorkouts(true);
        const res = await api.get(`/staff/members/${member._id}/workouts`);
        setWorkouts(res.data);
      } catch (err) {
        console.error('Failed to load workouts:', err);
      } finally {
        setLoadingWorkouts(false);
      }
    };
    fetchWorkouts();
  }, [member._id]);

  const handleUpdateMembership = async (e) => {
    e.preventDefault();
    setUpdateError('');
    try {
      setUpdatingMembership(true);
      const res = await api.patch(`/staff/members/${member._id}/membership`, {
        membershipStatus: newStatus,
        membershipExpiry: newExpiry || undefined,
      });
      setCurrentMember(res.data);
      setShowUpdateForm(false);
      if (onMembershipUpdated) onMembershipUpdated(res.data);
    } catch (err) {
      setUpdateError(err.response?.data?.message || 'Failed to update membership.');
    } finally {
      setUpdatingMembership(false);
    }
  };

  const joinDate = currentMember.joinedAt ? format(new Date(currentMember.joinedAt), 'dd MMM yyyy') : '—';
  const expiryDate = currentMember.membershipExpiry ? format(new Date(currentMember.membershipExpiry), 'dd MMM yyyy') : '—';
  const daysLeft = currentMember.membershipExpiry ? differenceInDays(new Date(currentMember.membershipExpiry), new Date()) : null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50"
        onClick={onClose}
      />
      <motion.div
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="fixed right-0 top-0 h-full w-full max-w-[480px] bg-[#141414] border-l border-[#1f1f1f] z-50 overflow-y-auto"
        id="member-detail-drawer"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <div className="sticky top-0 bg-[#141414] border-b border-[#1f1f1f] px-6 py-4 flex items-center justify-between z-10">
          <span className="text-[10px] uppercase tracking-widest text-[rgba(255,255,255,0.4)] font-['Inter']">Member Profile</span>
          <button onClick={onClose} id="close-drawer-btn" className="text-[rgba(255,255,255,0.4)] hover:text-[#e8ff00] text-2xl leading-none transition-colors duration-200">×</button>
        </div>

        <div className="p-6 space-y-8">
          {/* Header */}
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 bg-[#e8ff00] text-black font-bold text-2xl flex items-center justify-center rounded-none flex-shrink-0 font-['Inter']">
              {currentMember.profileInitials || '??'}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-['Bebas_Neue'] text-4xl text-white tracking-wide leading-none mb-2">{currentMember.name}</h2>
              <div className="mb-2"><StatusBadge status={currentMember.membershipStatus} /></div>
              <p className="text-[rgba(255,255,255,0.4)] text-xs font-mono truncate">{currentMember.email}</p>
              {currentMember.phone && (
                <p className="text-[rgba(255,255,255,0.3)] text-xs font-['Inter'] mt-0.5">{currentMember.phone}</p>
              )}
              <p className="text-[rgba(255,255,255,0.25)] text-[10px] font-['Inter'] mt-1 uppercase tracking-wider">Joined {joinDate}</p>
            </div>
          </div>

          {/* Membership Section */}
          <div className="bg-[#0d0d0d] border border-[#1f1f1f] border-t-2 border-t-[#e8ff00] p-5">
            <h3 className="font-['Bebas_Neue'] text-xl text-white tracking-wide mb-4 uppercase">Membership</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[rgba(255,255,255,0.3)] font-['Inter'] mb-1">Status</p>
                <StatusBadge status={currentMember.membershipStatus} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[rgba(255,255,255,0.3)] font-['Inter'] mb-1">Expiry</p>
                <p className="text-white text-sm font-['Inter'] font-semibold">{expiryDate}</p>
                {daysLeft !== null && (
                  <p className={`text-[10px] font-mono font-bold mt-0.5 ${daysLeft < 0 ? 'text-[#ff4444]' : daysLeft <= 14 ? 'text-[#ff9900]' : 'text-[rgba(255,255,255,0.4)]'}`}>
                    {daysLeft >= 0 ? `${daysLeft} days left` : `${Math.abs(daysLeft)} days overdue`}
                  </p>
                )}
              </div>
            </div>

            <button
              id="update-membership-btn"
              onClick={() => setShowUpdateForm(!showUpdateForm)}
              className="border border-[#e8ff00] text-[#e8ff00] bg-transparent hover:bg-[#e8ff00] hover:text-black rounded-none px-4 py-2 font-bold uppercase tracking-widest text-[10px] transition-all duration-200 font-['Inter']"
            >
              {showUpdateForm ? 'CANCEL' : 'UPDATE STATUS'}
            </button>

            <AnimatePresence>
              {showUpdateForm && (
                <motion.form
                  initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                  onSubmit={handleUpdateMembership}
                  className="overflow-hidden mt-4 space-y-3"
                >
                  {updateError && (
                    <p className="text-[#ff4444] text-xs font-['Inter'] uppercase tracking-wider">{updateError}</p>
                  )}
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-[rgba(255,255,255,0.3)] font-['Inter'] mb-1.5">New Status</label>
                    <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}
                      className="bg-[#141414] border border-[#1f1f1f] text-white focus:border-[#e8ff00] focus:outline-none rounded-none px-3 py-2 w-full font-['Inter'] text-sm transition-all duration-200">
                      <option value="active">Active</option>
                      <option value="expiring">Expiring</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-[rgba(255,255,255,0.3)] font-['Inter'] mb-1.5">New Expiry Date</label>
                    <input type="date" value={newExpiry} onChange={(e) => setNewExpiry(e.target.value)}
                      className="bg-[#141414] border border-[#1f1f1f] text-white focus:border-[#e8ff00] focus:outline-none rounded-none px-3 py-2 w-full font-['Inter'] text-sm transition-all duration-200" />
                  </div>
                  <button type="submit" disabled={updatingMembership}
                    className="bg-[#e8ff00] text-black font-bold uppercase tracking-widest text-[10px] px-4 py-2 rounded-none hover:bg-white transition-colors duration-200 font-['Inter'] disabled:opacity-50 w-full">
                    {updatingMembership ? 'SAVING...' : 'SAVE CHANGES →'}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Workout History */}
          <div>
            <h3 className="font-['Bebas_Neue'] text-xl text-white tracking-wide mb-4 uppercase">Workout History</h3>
            {loadingWorkouts ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-[#0d0d0d] border border-[#1f1f1f] p-4 animate-pulse">
                    <div className="h-3 bg-[#1f1f1f] rounded w-1/3 mb-2" />
                    <div className="h-2 bg-[#1f1f1f] rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : workouts.length === 0 ? (
              <div className="bg-[#0d0d0d] border border-[#1f1f1f] p-6 text-center">
                <p className="text-[rgba(255,255,255,0.25)] text-xs font-['Inter'] uppercase tracking-widest">No workouts logged yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {workouts.slice(0, 10).map((w) => {
                  const hasPR = w.squatPR || w.benchPR || w.deadliftPR;
                  return (
                    <div key={w._id} className="bg-[#0d0d0d] border border-[#1f1f1f] p-4 flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] text-[rgba(255,255,255,0.3)] font-['Inter']">
                            {w.date ? format(new Date(w.date), 'dd MMM yyyy') : '—'}
                          </span>
                          {hasPR && (
                            <span className="bg-[#e8ff00] text-black text-[9px] font-bold px-1.5 py-0.5 uppercase font-['Inter']">PR</span>
                          )}
                        </div>
                        <p className="text-white text-sm font-['Inter'] font-semibold truncate">{w.sessionName}</p>
                        <p className="text-[rgba(255,255,255,0.3)] text-[10px] font-['Inter']">
                          {w.exercises?.length || 0} exercises{w.duration ? ` · ${w.duration}m` : ''}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {workouts.length > 10 && (
                  <p className="text-[rgba(255,255,255,0.25)] text-[10px] font-['Inter'] uppercase tracking-widest text-center py-2">
                    +{workouts.length - 10} more sessions
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MemberDetailModal;
