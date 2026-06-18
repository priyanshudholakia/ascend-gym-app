import React from 'react';
import { format, differenceInDays } from 'date-fns';
import StatusBadge from './StatusBadge.jsx';

const MemberRow = ({ member, onViewDetails }) => {
  const expiry = member.membershipExpiry ? new Date(member.membershipExpiry) : null;
  const daysLeft = expiry ? differenceInDays(expiry, new Date()) : null;

  const expiryDisplay = expiry ? format(expiry, 'dd MMM yyyy') : '—';
  const daysDisplay =
    daysLeft !== null
      ? daysLeft >= 0
        ? `${daysLeft}d left`
        : `${Math.abs(daysLeft)}d ago`
      : '—';

  const daysColor =
    daysLeft === null
      ? 'text-[rgba(255,255,255,0.3)]'
      : daysLeft < 0
      ? 'text-[#ff4444]'
      : daysLeft <= 14
      ? 'text-[#ff9900]'
      : 'text-[rgba(255,255,255,0.4)]';

  const joinDate = member.joinedAt ? format(new Date(member.joinedAt), 'dd MMM yyyy') : '—';

  return (
    <div
      id={`member-row-${member._id}`}
      className={`border-b border-[#1f1f1f] px-6 py-4 grid grid-cols-5 gap-4 items-center hover:bg-[#141414] transition-all duration-200 group cursor-pointer ${
        member.membershipStatus === 'expired'
          ? 'border-l-2 border-l-[#ff4444]/40 bg-[#ff4444]/[0.02]'
          : member.membershipStatus === 'expiring'
          ? 'border-l-2 border-l-[#ff9900]/40 bg-[#ff9900]/[0.02]'
          : 'border-l-2 border-l-transparent'
      }`}
    >
      {/* MEMBER column */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-[#e8ff00] text-black font-bold text-xs flex items-center justify-center rounded-none flex-shrink-0 font-['Inter']">
          {member.profileInitials || '??'}
        </div>
        <div className="min-w-0">
          <p className="text-white font-['Inter'] font-semibold text-sm truncate">
            {member.name}
          </p>
          <p className="text-[rgba(255,255,255,0.3)] text-[10px] font-['Inter']">
            Joined {joinDate}
          </p>
        </div>
      </div>

      {/* EMAIL column */}
      <div className="min-w-0">
        <p className="text-[rgba(255,255,255,0.4)] text-xs font-mono truncate">
          {member.email}
        </p>
      </div>

      {/* STATUS column */}
      <div>
        <StatusBadge status={member.membershipStatus} />
      </div>

      {/* EXPIRY column */}
      <div>
        <p className="text-[rgba(255,255,255,0.6)] text-xs font-['Inter']">{expiryDisplay}</p>
        <p className={`text-[10px] font-mono font-bold ${daysColor} mt-0.5`}>{daysDisplay}</p>
      </div>

      {/* ACTIONS column */}
      <div className="flex justify-end">
        <button
          id={`view-member-${member._id}`}
          onClick={() => onViewDetails(member)}
          className="border border-[#e8ff00] text-[#e8ff00] bg-transparent hover:bg-[#e8ff00] hover:text-black rounded-none px-4 py-1.5 font-bold uppercase tracking-widest text-[10px] transition-all duration-200 font-['Inter'] whitespace-nowrap"
        >
          VIEW DETAILS →
        </button>
      </div>
    </div>
  );
};

export default MemberRow;
