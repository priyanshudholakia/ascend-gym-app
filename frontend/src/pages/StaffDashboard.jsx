import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar.jsx';
import MemberRow from '../components/MemberRow.jsx';
import MemberDetailModal from '../components/MemberDetailModal.jsx';
import api from '../api/axios.js';

const FILTERS = ['ALL', 'ACTIVE', 'EXPIRING', 'EXPIRED'];

const StaffDashboard = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [selectedMember, setSelectedMember] = useState(null);

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/staff/members');
      setMembers(res.data);
    } catch (err) {
      console.error('Failed to load members:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  const handleMembershipUpdated = (updatedMember) => {
    setMembers((prev) => prev.map((m) => (m._id === updatedMember._id ? { ...m, ...updatedMember } : m)));
    if (selectedMember?._id === updatedMember._id) {
      setSelectedMember({ ...selectedMember, ...updatedMember });
    }
  };

  const filtered = members.filter((m) => {
    const matchesSearch =
      !search.trim() ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      activeFilter === 'ALL' || m.membershipStatus === activeFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const totalCount = members.length;
  const activeCount = members.filter((m) => m.membershipStatus === 'active').length;
  const expiringCount = members.filter((m) => m.membershipStatus === 'expiring').length;

  const filterBtnClass = (f) =>
    activeFilter === f
      ? 'bg-[#e8ff00] text-black font-bold uppercase tracking-widest text-[10px] px-4 py-2 rounded-none font-["Inter"] transition-all duration-200'
      : 'border border-[#e8ff00] text-[#e8ff00] bg-transparent hover:bg-[#e8ff00] hover:text-black rounded-none px-4 py-2 font-bold uppercase tracking-widest text-[10px] transition-all duration-200 font-["Inter"]';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-[#0d0d0d]"
    >
      <Navbar />

      {/* Staff header */}
      <div className="bg-[#141414] border-b border-[#1f1f1f]">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[rgba(255,255,255,0.3)] font-['Inter'] mb-1">Staff Dashboard</p>
            <h1 className="font-['Bebas_Neue'] text-5xl text-white tracking-wide leading-none">STAFF PANEL</h1>
          </div>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-5 gap-0 border border-[#1f1f1f] mt-6">

            {/* Total Members */}
            <div className="border-r border-[#1f1f1f] px-6 py-4">
              <p className="font-['Inter'] text-[10px] uppercase tracking-[2px] text-[rgba(255,255,255,0.35)] mb-1">TOTAL MEMBERS</p>
              <p className="font-['Bebas_Neue'] text-4xl text-white">{loading ? '—' : members.length}</p>
            </div>

            {/* Active */}
            <div className="border-r border-[#1f1f1f] px-6 py-4">
              <p className="font-['Inter'] text-[10px] uppercase tracking-[2px] text-[rgba(255,255,255,0.35)] mb-1">ACTIVE</p>
              <p className="font-['Bebas_Neue'] text-4xl text-[#00ff88]">
                {loading ? '—' : members.filter(m => m.membershipStatus === 'active').length}
              </p>
            </div>

            {/* Expiring */}
            <div className="border-r border-[#1f1f1f] px-6 py-4">
              <p className="font-['Inter'] text-[10px] uppercase tracking-[2px] text-[rgba(255,255,255,0.35)] mb-1">EXPIRING</p>
              <p className="font-['Bebas_Neue'] text-4xl text-[#ff9900]">
                {loading ? '—' : members.filter(m => m.membershipStatus === 'expiring').length}
              </p>
            </div>

            {/* Expired */}
            <div className="border-r border-[#1f1f1f] px-6 py-4">
              <p className="font-['Inter'] text-[10px] uppercase tracking-[2px] text-[rgba(255,255,255,0.35)] mb-1">EXPIRED</p>
              <p className="font-['Bebas_Neue'] text-4xl text-[#ff4444]">
                {loading ? '—' : members.filter(m => m.membershipStatus === 'expired').length}
              </p>
            </div>

            {/* Expiring This Week — highlighted urgency card */}
            <div className="px-6 py-4 bg-[#ff9900]/5 border-l-2 border-[#ff9900] relative">
              <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-[#ff9900] animate-pulse" />
              <p className="font-['Inter'] text-[10px] uppercase tracking-[2px] text-[#ff9900] mb-1">EXPIRING THIS WEEK</p>
              <p className="font-['Bebas_Neue'] text-4xl text-[#ff9900]">
                {loading ? '—' : members.filter(m => {
                  if (!m.membershipExpiry) return false
                  const expiry = new Date(m.membershipExpiry)
                  const now = new Date()
                  const diffDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24))
                  return diffDays >= 0 && diffDays <= 7
                }).length}
              </p>
              <p className="font-['Inter'] text-[9px] text-[#ff9900]/60 mt-1 uppercase tracking-wider">Needs attention</p>
            </div>

          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-[#0d0d0d] border-b border-[#1f1f1f]">
        <div className="max-w-6xl mx-auto px-6 py-3 flex flex-wrap items-center gap-4">
          <input
            id="member-search"
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#141414] border border-[#1f1f1f] text-white placeholder-[rgba(255,255,255,0.2)] focus:border-[#e8ff00] focus:outline-none rounded-none px-4 py-2.5 w-64 font-['Inter'] text-sm transition-all duration-200"
          />
          <div className="flex gap-2">
            {FILTERS.map((f) => (
              <button key={f} id={`filter-${f.toLowerCase()}`} onClick={() => setActiveFilter(f)} className={filterBtnClass(f)}>
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Members table */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Table header */}
        <div className="bg-[#141414] border border-[#1f1f1f] border-b-0 px-6 py-3 grid grid-cols-5 gap-4">
          {['MEMBER', 'EMAIL', 'STATUS', 'EXPIRY', 'ACTIONS'].map((col) => (
            <p key={col} className="text-[9px] uppercase tracking-[0.2em] text-[rgba(255,255,255,0.3)] font-['Inter'] font-semibold">
              {col}
            </p>
          ))}
        </div>

        {/* Table body */}
        <div className="border border-[#1f1f1f]">
          {loading ? (
            <div className="space-y-0">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="border-b border-[#1f1f1f] px-6 py-5 grid grid-cols-5 gap-4 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#1f1f1f]" />
                    <div className="h-3 bg-[#1f1f1f] rounded w-24" />
                  </div>
                  <div className="h-3 bg-[#1f1f1f] rounded w-32 self-center" />
                  <div className="h-5 bg-[#1f1f1f] rounded w-16 self-center" />
                  <div className="h-3 bg-[#1f1f1f] rounded w-20 self-center" />
                  <div className="h-7 bg-[#1f1f1f] rounded w-24 self-center ml-auto" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-['Bebas_Neue'] text-2xl text-[rgba(255,255,255,0.15)] tracking-wide">NO MEMBERS FOUND</p>
              <p className="text-[rgba(255,255,255,0.2)] text-xs font-['Inter'] uppercase tracking-widest mt-2">
                {search ? 'Try a different search query' : 'No members match this filter'}
              </p>
            </div>
          ) : (
            filtered.map((member) => (
              <MemberRow
                key={member._id}
                member={member}
                onViewDetails={(m) => setSelectedMember(m)}
              />
            ))
          )}
        </div>

        {!loading && filtered.length > 0 && (
          <div className="mt-3 flex items-center justify-between">
            <p className="text-[10px] text-[rgba(255,255,255,0.25)] font-['Inter'] uppercase tracking-widest">
              Showing {filtered.length} of {totalCount} members
            </p>
          </div>
        )}

        {/* ===== QUICK ACTIONS SECTION ===== */}
        {members.length > 0 && (
          <div className="mt-8">
            <p className="font-['Inter'] text-[10px] uppercase tracking-[2px] text-[rgba(255,255,255,0.3)] mb-4">
              QUICK ACTIONS
            </p>
            <div className="grid grid-cols-2 gap-4">

              {/* Card 1 — Most Recently Joined Member */}
              {(() => {
                const newest = [...members].sort((a, b) => new Date(b.joinedAt) - new Date(a.joinedAt))[0]
                if (!newest) return null
                return (
                  <div className="bg-[#141414] border border-[#1f1f1f] border-t-2 border-t-[#e8ff00] p-6">
                    <p className="font-['Inter'] text-[10px] uppercase tracking-[2px] text-[rgba(255,255,255,0.3)] mb-4">
                      🆕 NEWEST MEMBER
                    </p>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 bg-[#e8ff00] flex items-center justify-center text-black font-bold text-sm font-['Inter']">
                        {newest.profileInitials || newest.name?.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-['Bebas_Neue'] text-2xl text-white">{newest.name}</p>
                        <p className="font-['Inter'] text-xs text-[rgba(255,255,255,0.4)]">{newest.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="font-['Inter'] text-xs text-[rgba(255,255,255,0.3)]">
                        Joined {new Date(newest.joinedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      <button
                        onClick={() => setSelectedMember(newest)}
                        className="font-['Inter'] text-[10px] uppercase tracking-wider text-[#e8ff00] border border-[#e8ff00] px-3 py-1.5 hover:bg-[#e8ff00] hover:text-black transition-all duration-200"
                      >
                        VIEW →
                      </button>
                    </div>
                  </div>
                )
              })()}

              {/* Card 2 — Most Urgent Expiring Membership */}
              {(() => {
                const urgent = [...members]
                  .filter(m => m.membershipExpiry && new Date(m.membershipExpiry) > new Date())
                  .sort((a, b) => new Date(a.membershipExpiry) - new Date(b.membershipExpiry))[0]
                if (!urgent) return (
                  <div className="bg-[#141414] border border-[#1f1f1f] border-t-2 border-t-[#ff9900] p-6 flex items-center justify-center">
                    <p className="font-['Inter'] text-xs text-[rgba(255,255,255,0.2)] uppercase tracking-wider">No upcoming expiries</p>
                  </div>
                )
                const daysLeft = Math.ceil((new Date(urgent.membershipExpiry) - new Date()) / (1000 * 60 * 60 * 24))
                return (
                  <div className="bg-[#141414] border border-[#1f1f1f] border-t-2 border-t-[#ff9900] p-6">
                    <p className="font-['Inter'] text-[10px] uppercase tracking-[2px] text-[#ff9900] mb-4">
                      ⚠️ MOST URGENT EXPIRY
                    </p>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 bg-[#ff9900]/20 border border-[#ff9900]/40 flex items-center justify-center text-[#ff9900] font-bold text-sm font-['Inter']">
                        {urgent.profileInitials || urgent.name?.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-['Bebas_Neue'] text-2xl text-white">{urgent.name}</p>
                        <p className="font-['Inter'] text-xs text-[rgba(255,255,255,0.4)]">{urgent.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-['Bebas_Neue'] text-3xl text-[#ff9900]">{daysLeft} <span className="text-base">DAYS LEFT</span></p>
                        <p className="font-['Inter'] text-[10px] text-[rgba(255,255,255,0.3)] uppercase tracking-wider">
                          Expires {new Date(urgent.membershipExpiry).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedMember(urgent)}
                        className="font-['Inter'] text-[10px] uppercase tracking-wider text-[#ff9900] border border-[#ff9900] px-3 py-1.5 hover:bg-[#ff9900] hover:text-black transition-all duration-200"
                      >
                        UPDATE →
                      </button>
                    </div>
                  </div>
                )
              })()}

            </div>
          </div>
        )}
      </div>

      {/* Member detail drawer */}
      {selectedMember && (
        <MemberDetailModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
          onMembershipUpdated={handleMembershipUpdated}
        />
      )}
    </motion.div>
  );
};

export default StaffDashboard;
