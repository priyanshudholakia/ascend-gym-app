import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios.js';

const emptyExercise = () => ({ name: '', sets: '', reps: '', weightKg: '' });

const LogWorkoutModal = ({ onClose, onSuccess }) => {
  const [sessionName, setSessionName] = useState('');
  const [duration, setDuration] = useState('');
  const [exercises, setExercises] = useState([emptyExercise()]);
  const [showPRSection, setShowPRSection] = useState(false);
  const [squatPR, setSquatPR] = useState('');
  const [benchPR, setBenchPR] = useState('');
  const [deadliftPR, setDeadliftPR] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addExercise = () => setExercises([...exercises, emptyExercise()]);
  const removeExercise = (index) => {
    if (exercises.length === 1) return;
    setExercises(exercises.filter((_, i) => i !== index));
  };
  const updateExercise = (index, field, value) => {
    const updated = [...exercises];
    updated[index] = { ...updated[index], [field]: value };
    setExercises(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!sessionName.trim()) { setError('Session name is required.'); return; }
    const validExercises = exercises.filter((ex) => ex.name.trim()).map((ex) => ({
      name: ex.name.trim(),
      sets: ex.sets ? parseInt(ex.sets) : undefined,
      reps: ex.reps ? parseInt(ex.reps) : undefined,
      weightKg: ex.weightKg ? parseFloat(ex.weightKg) : undefined,
    }));
    const payload = {
      sessionName: sessionName.trim(),
      duration: duration ? parseInt(duration) : undefined,
      exercises: validExercises,
      squatPR: squatPR ? parseFloat(squatPR) : null,
      benchPR: benchPR ? parseFloat(benchPR) : null,
      deadliftPR: deadliftPR ? parseFloat(deadliftPR) : null,
      notes: notes.trim() || undefined,
    };
    try {
      setLoading(true);
      await api.post('/workouts', payload);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save session. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "bg-[#0d0d0d] border border-[#1f1f1f] text-white placeholder-[rgba(255,255,255,0.2)] focus:border-[#e8ff00] focus:outline-none rounded-none px-4 py-3 w-full font-['Inter'] text-sm transition-all duration-200";
  const labelClass = "block text-[10px] uppercase tracking-widest text-[rgba(255,255,255,0.4)] font-['Inter'] mb-2";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="bg-black/80 fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.25 }}
          className="bg-[#141414] border border-[#1f1f1f] max-w-lg w-full p-8 relative overflow-y-auto max-h-[90vh]"
          id="log-workout-modal"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="border-l-2 border-[#e8ff00] pl-3">
              <h2 className="font-['Bebas_Neue'] text-3xl text-white tracking-wide">LOG SESSION</h2>
            </div>
            <button onClick={onClose} id="close-modal-btn" className="text-[rgba(255,255,255,0.4)] hover:text-[#e8ff00] text-2xl transition-colors duration-200 leading-none">×</button>
          </div>

          {error && (
            <div className="mb-6 bg-[#ff4444]/10 border border-[#ff4444]/30 text-[#ff4444] text-xs font-['Inter'] px-4 py-3 uppercase tracking-wider">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={labelClass}>Session Name *</label>
              <input id="session-name-input" type="text" placeholder="e.g. Push Day, Leg Day" value={sessionName} onChange={(e) => setSessionName(e.target.value)} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Duration (minutes)</label>
              <input id="duration-input" type="number" placeholder="e.g. 75" min="1" value={duration} onChange={(e) => setDuration(e.target.value)} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Exercises</label>
              <div className="space-y-3">
                {exercises.map((ex, i) => (
                  <div key={i} className="bg-[#0d0d0d] border border-[#1f1f1f] p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-mono text-[rgba(255,255,255,0.25)] uppercase tracking-widest">#{i + 1}</span>
                      {exercises.length > 1 && (
                        <button type="button" onClick={() => removeExercise(i)} className="ml-auto text-[rgba(255,255,255,0.3)] hover:text-[#ff4444] text-sm transition-colors duration-200">×</button>
                      )}
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      <input type="text" placeholder="Exercise name" value={ex.name} onChange={(e) => updateExercise(i, 'name', e.target.value)}
                        className="col-span-4 bg-transparent border border-[#1f1f1f] text-white placeholder-[rgba(255,255,255,0.2)] focus:border-[#e8ff00] focus:outline-none rounded-none px-3 py-2 font-['Inter'] text-xs transition-all duration-200" />
                      <input type="number" placeholder="Sets" min="1" value={ex.sets} onChange={(e) => updateExercise(i, 'sets', e.target.value)}
                        className="bg-transparent border border-[#1f1f1f] text-white placeholder-[rgba(255,255,255,0.2)] focus:border-[#e8ff00] focus:outline-none rounded-none px-3 py-2 font-['Inter'] text-xs transition-all duration-200" />
                      <input type="number" placeholder="Reps" min="1" value={ex.reps} onChange={(e) => updateExercise(i, 'reps', e.target.value)}
                        className="bg-transparent border border-[#1f1f1f] text-white placeholder-[rgba(255,255,255,0.2)] focus:border-[#e8ff00] focus:outline-none rounded-none px-3 py-2 font-['Inter'] text-xs transition-all duration-200" />
                      <input type="number" placeholder="kg" min="0" step="0.5" value={ex.weightKg} onChange={(e) => updateExercise(i, 'weightKg', e.target.value)}
                        className="col-span-2 bg-transparent border border-[#1f1f1f] text-white placeholder-[rgba(255,255,255,0.2)] focus:border-[#e8ff00] focus:outline-none rounded-none px-3 py-2 font-['Inter'] text-xs transition-all duration-200" />
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" id="add-exercise-btn" onClick={addExercise}
                className="mt-3 border border-[#e8ff00] text-[#e8ff00] bg-transparent hover:bg-[#e8ff00] hover:text-black rounded-none px-4 py-2 font-bold uppercase tracking-widest text-[10px] transition-all duration-200 font-['Inter'] w-full">
                + ADD EXERCISE
              </button>
            </div>

            <div>
              <button type="button" id="toggle-pr-section" onClick={() => setShowPRSection(!showPRSection)}
                className="w-full flex items-center justify-between text-[10px] uppercase tracking-widest text-[rgba(255,255,255,0.4)] font-['Inter'] hover:text-[#e8ff00] transition-colors duration-200 py-2 border-b border-[#1f1f1f]">
                <span>LOG NEW PRs (OPTIONAL)</span>
                <span>{showPRSection ? '▲' : '▼'}</span>
              </button>
              <AnimatePresence>
                {showPRSection && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                    <div className="grid grid-cols-3 gap-3 pt-4">
                      {[['squatPR', 'Squat', squatPR, setSquatPR, 'squat-pr-input'], ['benchPR', 'Bench', benchPR, setBenchPR, 'bench-pr-input'], ['deadliftPR', 'Deadlift', deadliftPR, setDeadliftPR, 'deadlift-pr-input']].map(([key, label, val, setter, id]) => (
                        <div key={key}>
                          <label className="block text-[9px] uppercase tracking-widest text-[rgba(255,255,255,0.3)] font-['Inter'] mb-1.5">{label} (kg)</label>
                          <input id={id} type="number" placeholder="0" min="0" step="0.5" value={val} onChange={(e) => setter(e.target.value)}
                            className="bg-[#0d0d0d] border border-[#1f1f1f] text-white placeholder-[rgba(255,255,255,0.2)] focus:border-[#e8ff00] focus:outline-none rounded-none px-3 py-2 w-full font-['Inter'] text-sm transition-all duration-200" />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div>
              <label className={labelClass}>Notes (optional)</label>
              <textarea id="notes-input" placeholder="How did the session go?" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
                className="bg-[#0d0d0d] border border-[#1f1f1f] text-white placeholder-[rgba(255,255,255,0.2)] focus:border-[#e8ff00] focus:outline-none rounded-none px-4 py-3 w-full font-['Inter'] text-sm transition-all duration-200 resize-none" />
            </div>

            <button type="submit" id="save-session-btn" disabled={loading}
              className="bg-[#e8ff00] text-black font-bold uppercase tracking-widest text-sm px-6 py-3 rounded-none hover:bg-white transition-colors duration-200 w-full font-['Inter'] disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'SAVING...' : 'SAVE SESSION →'}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LogWorkoutModal;
