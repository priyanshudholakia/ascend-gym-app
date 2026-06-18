import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const WorkoutCard = ({ workout, index }) => {
  const hasPR = workout.squatPR || workout.benchPR || workout.deadliftPR;

  const formattedDate = workout.date
    ? format(new Date(workout.date), 'dd MMM yyyy')
    : '—';

  const exerciseCount = workout.exercises?.length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
      className="bg-[#141414] border border-[#1f1f1f] p-5 hover:border-[#e8ff00] transition-all duration-200 cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left: Date + Session */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1.5">
            <span className="font-['Bebas_Neue'] text-lg text-[rgba(255,255,255,0.5)] tracking-wide">
              {formattedDate}
            </span>
            {hasPR && (
              <span className="bg-[#e8ff00] text-black text-[10px] font-bold px-2 py-0.5 uppercase font-['Inter'] tracking-wider flex-shrink-0">
                NEW PR
              </span>
            )}
          </div>

          <p className="font-['Inter'] font-bold text-white text-base mb-3 truncate">
            {workout.sessionName}
          </p>

          {/* Exercise list */}
          <div className="space-y-0.5">
            {workout.exercises?.slice(0, 4).map((ex, i) => (
              <p key={i} className="text-[11px] font-mono text-[rgba(255,255,255,0.35)] truncate">
                {ex.name}
                {ex.sets && ex.reps ? ` · ${ex.sets}×${ex.reps}` : ''}
                {ex.weightKg ? ` · ${ex.weightKg}kg` : ''}
              </p>
            ))}
            {exerciseCount > 4 && (
              <p className="text-[10px] text-[rgba(255,255,255,0.2)] font-['Inter']">
                +{exerciseCount - 4} more
              </p>
            )}
          </div>
        </div>

        {/* Right: Stats */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          {workout.duration && (
            <span className="bg-[#0d0d0d] border border-[#1f1f1f] text-[rgba(255,255,255,0.5)] text-[10px] font-['Inter'] px-2 py-1 uppercase tracking-widest">
              {workout.duration}m
            </span>
          )}
          <span className="text-[10px] text-[rgba(255,255,255,0.3)] font-['Inter'] uppercase tracking-wider">
            {exerciseCount} {exerciseCount === 1 ? 'exercise' : 'exercises'}
          </span>
        </div>
      </div>

      {/* PR details */}
      {hasPR && (
        <div className="mt-3 pt-3 border-t border-[#1f1f1f] flex flex-wrap gap-3">
          {workout.squatPR && (
            <span className="text-[10px] text-[#e8ff00] font-mono font-bold uppercase">
              Squat {workout.squatPR}kg
            </span>
          )}
          {workout.benchPR && (
            <span className="text-[10px] text-[#e8ff00] font-mono font-bold uppercase">
              Bench {workout.benchPR}kg
            </span>
          )}
          {workout.deadliftPR && (
            <span className="text-[10px] text-[#e8ff00] font-mono font-bold uppercase">
              Deadlift {workout.deadliftPR}kg
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default WorkoutCard;
