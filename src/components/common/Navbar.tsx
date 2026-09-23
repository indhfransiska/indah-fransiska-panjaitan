import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  Menu, 
  ChevronDown, 
  User, 
  KeyRound, 
  LogOut, 
  Check, 
  Clock, 
  ArrowRightLeft, 
  ShieldCheck, 
  CheckCheck,
  Calendar
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { 
    currentUser, 
    activeTab, 
    setActiveTab, 
    notifikasiList, 
    unreadCount, 
    markNotifikasiAsRead, 
    markAllNotifikasiAsRead,
    switchRole,
    setIsLogoutModalOpen,
    setIsChangePasswordModalOpen,
    setIsProfileModalOpen,
    setIsSidebarOpen
  } = useApp();

  const handleToggle = onToggleSidebar || (() => setIsSidebarOpen(true));

  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifMenu(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format tab label
  const getBreadcrumb = () => {
    const map: Record<string, string> = {
      'dashboard': 'Dashboard',
      'pegawai': 'Data Pegawai ASN',
      'kepegawaian': 'Layanan Kepegawaian',
      'absensi': 'Rekapitulasi Absensi',
      'cuti': 'Pengelolaan Cuti Pegawai',
      'dokumen': 'Arsip Dokumen Kepegawaian',
      'laporan': 'Laporan & Statistik',
      'notifikasi': 'Pusat Notifikasi',
      'profil': 'Profil Saya',
      'absensi-saya': 'Presensi & Kehadiran Saya',
      'pengajuan-cuti': 'Pengajuan Cuti',
      'dokumen-saya': 'Dokumen Kepegawaian Saya'
    };
    return map[activeTab] || 'Dashboard';
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur border-b border-slate-200 px-4 md:px-6 flex items-center justify-between">
      {/* Left: Hamburger & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleToggle}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors md:hidden cursor-pointer"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">SIMPEG</span>
          <span className="text-slate-300">/</span>
          <span className="font-semibold text-slate-800">{getBreadcrumb()}</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Quick Role Switcher Pill for Testing */}
        <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => switchRole('hr_admin')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              currentUser?.role === 'hr_admin'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Beralih ke tampilan HR/Admin"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Mode HR</span>
          </button>
          <button
            onClick={() => switchRole('pegawai')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              currentUser?.role === 'pegawai'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Beralih ke tampilan Pegawai"
          >
            <User className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mode Pegawai</span>
          </button>
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Notifikasi"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-800">Notifikasi</h4>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-semibold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                      {unreadCount} baru
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotifikasiAsRead}
                    className="text-[11px] font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Tandai dibaca
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto py-2 divide-y divide-slate-100">
                {notifikasiList.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">Tidak ada notifikasi saat ini</p>
                ) : (
                  notifikasiList.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        markNotifikasiAsRead(item.id);
                        if (item.linkMenu) {
                          setActiveTab(item.linkMenu);
                          setShowNotifMenu(false);
                        }
                      }}
                      className={`p-2.5 rounded-xl cursor-pointer transition-colors ${
                        item.sudahDibaca ? 'hover:bg-slate-50 opacity-75' : 'bg-blue-50/50 hover:bg-blue-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-slate-800">{item.judul}</p>
                        {!item.sudahDibaca && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">{item.pesan}</p>
                      <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.waktu}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 text-center">
                <button
                  onClick={() => {
                    setActiveTab(currentUser?.role === 'hr_admin' ? 'notifikasi' : 'notifikasi-saya');
                    setShowNotifMenu(false);
                  }}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  Lihat Semua Notifikasi
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer text-left"
            aria-label="Menu Pengguna"
          >
            <img
              src={currentUser?.avatar}
              alt={currentUser?.nama}
              className="w-8 h-8 rounded-xl object-cover ring-1 ring-slate-200"
            />
            <div className="hidden lg:block text-left pr-1">
              <p className="text-xs font-semibold text-slate-800 line-clamp-1 leading-tight">
                {currentUser?.nama}
              </p>
              <p className="text-[10px] text-slate-400 font-mono leading-tight">
                {currentUser?.nip}
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="p-3 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-800 line-clamp-1">{currentUser?.nama}</p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">NIP. {currentUser?.nip}</p>
                <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{currentUser?.role === 'hr_admin' ? 'Administrator HR / BKD' : 'Pegawai ASN'}</span>
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    setIsProfileModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  <span>Profil & Pengaturan</span>
                </button>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    setIsChangePasswordModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  <KeyRound className="w-4 h-4 text-slate-500" />
                  <span>Ubah Kata Sandi</span>
                </button>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    switchRole(currentUser?.role === 'hr_admin' ? 'pegawai' : 'hr_admin');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer sm:hidden"
                >
                  <ArrowRightLeft className="w-4 h-4 text-slate-500" />
                  <span>Ganti Peran ({currentUser?.role === 'hr_admin' ? 'Pegawai' : 'HR Admin'})</span>
                </button>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    setIsLogoutModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar (Logout)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
