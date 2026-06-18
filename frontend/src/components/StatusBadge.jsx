import React from 'react';

const StatusBadge = ({ status }) => {
  const config = {
    active: {
      bg: 'bg-[#00ff88]/10',
      border: 'border-[#00ff88]/30',
      text: 'text-[#00ff88]',
      dot: 'bg-[#00ff88]',
      label: 'ACTIVE',
      pulse: false,
    },
    expiring: {
      bg: 'bg-[#ff9900]/10',
      border: 'border-[#ff9900]/30',
      text: 'text-[#ff9900]',
      dot: 'bg-[#ff9900]',
      label: 'EXPIRING',
      pulse: true,
    },
    expired: {
      bg: 'bg-[#ff4444]/10',
      border: 'border-[#ff4444]/30',
      text: 'text-[#ff4444]',
      dot: 'bg-[#ff4444]',
      label: 'EXPIRED',
      pulse: false,
    },
  };

  const c = config[status] || config.expired;

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${c.bg} border ${c.border} ${c.text} text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-none font-['Inter']`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${c.dot} ${c.pulse ? 'pulse-warning' : ''} flex-shrink-0`}
      />
      {c.label}
    </span>
  );
};

export default StatusBadge;
