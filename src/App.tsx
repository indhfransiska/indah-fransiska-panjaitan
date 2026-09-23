import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LoginPage } from './components/auth/LoginPage';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { ToastContainer } from './components/common/ToastContainer';
import { LogoutModal } from './components/common/LogoutModal';
import { ChangePasswordModal } from './components/common/ChangePasswordModal';
import { ProfileSettingsModal } from './components/common/ProfileSettingsModal';
import { DocumentPreviewModal } from './components/common/DocumentPreviewModal';

// HR Components
import { HrDashboard } from './components/hr/HrDashboard';
import { HrDataPegawai } from './components/hr/HrDataPegawai';
import { HrKepegawaian } from './components/hr/HrKepegawaian';
import { HrAbsensi } from './components/hr/HrAbsensi';
import { HrCuti } from './components/hr/HrCuti';
import { HrDokumen } from './components/hr/HrDokumen';
import { HrLaporan } from './components/hr/HrLaporan';
import { HrNotifikasi } from './components/hr/HrNotifikasi';

// Pegawai Components
import { PegawaiDashboard } from './components/pegawai/PegawaiDashboard';
import { PegawaiProfil } from './components/pegawai/PegawaiProfil';
import { PegawaiAbsensi } from './components/pegawai/PegawaiAbsensi';
import { PegawaiCuti } from './components/pegawai/PegawaiCuti';
import { PegawaiDokumen } from './components/pegawai/PegawaiDokumen';

import { ChevronRight, Home, Shield, Sparkles } from 'lucide-react';

const DashboardContent: React.FC = () => {
  const { currentUser, activeTab, setActiveTab } = useApp();

  if (!currentUser) {
    return <LoginPage />;
  }

  // Determine breadcrumb title
  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard':
        return 'Beranda Dashboard';
      case 'pegawai':
        return 'Data Pegawai ASN';
      case 'kepegawaian':
        return 'Administrasi & Usulan Kepegawaian';
      case 'absensi':
        return 'Rekapitulasi Kehadiran';
      case 'cuti':
        return 'Persetujuan & Data Cuti';
      case 'dokumen':
        return 'Arsip Dokumen Kepegawaian';
      case 'laporan':
        return 'Laporan & Rekapitulasi Eksekutif';
      case 'notifikasi':
        return 'Pemberitahuan & Notifikasi';
      case 'profil':
        return 'Profil & Biodata ASN';
      case 'absensi-saya':
        return 'Presensi & Kehadiran Saya';
      case 'pengajuan-cuti':
        return 'Permohonan Cuti Mandiri';
      case 'dokumen-saya':
        return 'Dokumen & Portofolio Saya';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar />

      <div className="flex flex-1 relative overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Workspace */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {/* Breadcrumb & Current Context Header */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200/80">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <button 
                onClick={() => setActiveTab('dashboard')}
                className="hover:text-blue-600 flex items-center gap-1 cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>SIMPEG</span>
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-slate-800">
                {currentUser.role === 'hr_admin' ? 'Portal Admin HR' : 'Portal Pegawai Mandiri'}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-bold text-blue-600">
                {getTabTitle(activeTab)}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Tahun Anggaran 2026</span>
              <span className="text-slate-300">|</span>
              <span className="bg-slate-200/70 text-slate-700 px-2 py-0.5 rounded font-semibold text-[10px]">
                Versi 3.4.0 (Terakreditasi BKN)
              </span>
            </div>
          </div>

          {/* Dynamic Route View */}
          {currentUser.role === 'hr_admin' ? (
            <>
              {activeTab === 'dashboard' && <HrDashboard />}
              {activeTab === 'pegawai' && <HrDataPegawai />}
              {activeTab === 'kepegawaian' && <HrKepegawaian />}
              {activeTab === 'absensi' && <HrAbsensi />}
              {activeTab === 'cuti' && <HrCuti />}
              {activeTab === 'dokumen' && <HrDokumen />}
              {activeTab === 'laporan' && <HrLaporan />}
              {activeTab === 'notifikasi' && <HrNotifikasi />}
            </>
          ) : (
            <>
              {activeTab === 'dashboard' && <PegawaiDashboard />}
              {activeTab === 'profil' && <PegawaiProfil />}
              {activeTab === 'absensi-saya' && <PegawaiAbsensi />}
              {activeTab === 'pengajuan-cuti' && <PegawaiCuti />}
              {activeTab === 'dokumen-saya' && <PegawaiDokumen />}
              {activeTab === 'notifikasi' && <HrNotifikasi />}
            </>
          )}

          {/* Footer Notice */}
          <footer className="mt-12 pt-6 border-t border-slate-200 text-center text-xs text-slate-400 pb-8">
            <p>
              &copy; 2026 Badan Kepegawaian Daerah — Sistem Informasi Manajemen Kepegawaian (SIMPEG) Terintegrasi.
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Sesuai dengan Peraturan BKN No. 5 Tahun 2021 tentang Penyelenggaraan Sistem Informasi Kepegawaian Berbasis Meritokrasi.
            </p>
          </footer>
        </main>
      </div>

      {/* Global Modals & Overlays */}
      <LogoutModal />
      <ChangePasswordModal />
      <ProfileSettingsModal />
      <DocumentPreviewModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <DashboardContent />
    </AppProvider>
  );
}
