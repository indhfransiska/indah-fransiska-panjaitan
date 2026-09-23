import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Users, 
  Award, 
  CalendarCheck, 
  CalendarDays, 
  FolderArchive, 
  FileSpreadsheet, 
  Bell, 
  UserCheck, 
  CalendarClock, 
  Files, 
  LogOut, 
  Shield, 
  X,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen: propIsOpen, onClose: propOnClose }) => {
  const { 
    currentUser, 
    activeTab, 
    setActiveTab, 
    pengajuanCutiList, 
    unreadCount, 
    setIsLogoutModalOpen,
    isSidebarOpen,
    setIsSidebarOpen
  } = useApp();

  const isOpen = propIsOpen !== undefined ? propIsOpen : isSidebarOpen;
  const onClose = propOnClose || (() => setIsSidebarOpen(false));

  const isHr = currentUser?.role === 'hr_admin';

  // Count pending cuti for badge
  const pendingCutiCount = pengajuanCutiList.filter(c => c.status === 'Menunggu Persetujuan').length;

  const hrMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pegawai', label: 'Data Pegawai', icon: Users },
    { id: 'kepegawaian', label: 'Kepegawaian', icon: Award },
    { id: 'absensi', label: 'Absensi', icon: CalendarCheck },
    { 
      id: 'cuti', 
      label: 'Cuti', 
      icon: CalendarDays, 
      badge: pendingCutiCount > 0 ? pendingCutiCount : undefined,
      badgeColor: 'bg-amber-500 text-white'
    },
    { id: 'dokumen', label: 'Dokumen Kepegawaian', icon: FolderArchive },
    { id: 'laporan', label: 'Laporan', icon: FileSpreadsheet },
    { 
      id: 'notifikasi', 
      label: 'Notifikasi', 
      icon: Bell, 
      badge: unreadCount > 0 ? unreadCount : undefined,
      badgeColor: 'bg-blue-500 text-white'
    },
  ];

  const pegawaiMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profil', label: 'Profil Saya', icon: UserCheck },
    { id: 'absensi-saya', label: 'Absensi Saya', icon: CalendarCheck },
    { 
      id: 'pengajuan-cuti', 
      label: 'Pengajuan Cuti', 
      icon: CalendarClock 
    },
    { id: 'dokumen-saya', label: 'Dokumen Saya', icon: Files },
    { 
      id: 'notifikasi', 
      label: 'Notifikasi', 
      icon: Bell, 
      badge: unreadCount > 0 ? unreadCount : undefined,
      badgeColor: 'bg-blue-500 text-white'
    },
  ];

  const menuItems = isHr ? hrMenuItems : pegawaiMenuItems;

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 md:hidden backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-slate-900 text-slate-100 flex flex-col transition-transform duration-300 ease-in-out border-r border-slate-800 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo / Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-wide text-sm text-white">SIMPEG</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded">
                  v2.6
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-tight">Sistem Info Kepegawaian</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Role Card */}
        <div className="p-3 mx-3 my-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
          <div className="flex items-center gap-2.5">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.nama}
              className="w-9 h-9 rounded-lg object-cover ring-1 ring-slate-600"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{currentUser?.nama}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className={`w-1.5 h-1.5 rounded-full ${isHr ? 'bg-indigo-400' : 'bg-emerald-400'}`} />
                <p className="text-[10px] text-slate-400 font-medium truncate">
                  {isHr ? 'HR & Administrator' : 'Pegawai ASN'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {isHr ? 'Menu Manajemen HR' : 'Menu Layanan Pegawai'}
          </p>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-medium text-slate-400">Pusat Bantuan ASN</p>
              <p className="text-xs font-semibold text-slate-200">Call Center: 1500-BKD</p>
            </div>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>

          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar Sistem (Logout)</span>
          </button>
        </div>
      </aside>
    </>
  );
};
