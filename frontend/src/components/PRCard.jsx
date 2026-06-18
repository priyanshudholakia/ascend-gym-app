import React from 'react';
import { motion } from 'framer-motion';

const PRCard = ({ lift, value, index }) => {
  const liftLabels = {
    squat: 'SQUAT',
    bench: 'BENCH PRESS',
    deadlift: 'DEADLIFT',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-[#141414] border border-[#1f1f1f] border-t-2 border-t-[#e8ff00] p-6 flex flex-col justify-between min-h-[140px]"
    >
      {/* Lift name */}
      <p className="text-[rgba(255,255,255,0.4)] text-[10px] uppercase tracking-widest font-['Inter'] font-semibold">
        {liftLabels[lift] || lift.toUpperCase()}
      </p>

      {/* PR value */}
      <div className="my-3">
        {value !== null && value !== undefined ? (
          <span className="font-['Bebas_Neue'] text-5xl text-white tracking-wide">
            {value}{' '}
            <span className="text-2xl text-[rgba(255,255,255,0.4)]">KG</span>
          </span>
        ) : (
          <span className="font-['Bebas_Neue'] text-5xl text-[rgba(255,255,255,0.15)] tracking-wide">
            — KG
          </span>
        )}
      </div>

      {/* Label */}
      <p className="text-[rgba(255,255,255,0.25)] text-[10px] font-['Inter'] uppercase tracking-widest">
        Personal Record
      </p>
    </motion.div>
  );
};

export default PRCard;
