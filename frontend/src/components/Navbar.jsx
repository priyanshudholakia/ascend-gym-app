import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-[#0d0d0d] border-b border-[#1f1f1f] h-14 flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Left: Brand */}
      <div className="flex items-center">
        <div className="border-l-4 border-[#e8ff00] pl-3">
          <span className="font-['Bebas_Neue'] text-xl text-white tracking-widest">ASCEND</span>
        </div>
      </div>

      {/* Right: User info + logout */}
      <div className="flex items-center gap-4">
        <span className="text-[rgba(255,255,255,0.4)] text-xs font-['Inter'] hidden sm:block">
          {user?.name}
        </span>

        {/* Profile initials circle */}
        <div className="w-8 h-8 bg-[#e8ff00] text-black font-bold text-xs flex items-center justify-center rounded-none flex-shrink-0">
          {user?.profileInitials || user?.name?.substring(0, 2).toUpperCase() || 'U'}
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="border border-[#e8ff00] text-[#e8ff00] bg-transparent hover:bg-[#e8ff00] hover:text-black rounded-none px-3 py-1.5 font-bold uppercase tracking-widest text-[10px] transition-all duration-200 font-['Inter']"
          id="logout-btn"
        >
          LOGOUT
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
