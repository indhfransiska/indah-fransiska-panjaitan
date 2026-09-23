import React from 'react';
import { useApp } from '../../context/AppContext';
import { LogOut, AlertTriangle, X } from 'lucide-react';

export const LogoutModal: React.FC = () => {
  const { isLogoutModalOpen, setIsLogoutModalOpen, logout, currentUser } = useApp();

  if (!isLogoutModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 transform transition-all scale-100"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
              <LogOut className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-800">Konfirmasi Keluar Sesi</h3>
              <p className="text-xs text-slate-500">SIMPEG Terpadu</p>
            </div>
          </div>
          <button
            onClick={() => setIsLogoutModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-5">
          <div className="flex items-start gap-3 p-3.5 bg-amber-50 rounded-xl border border-amber-200/60 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed font-medium">
              Apakah Anda yakin ingin keluar?
            </p>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Sesi aktif atas nama <strong className="text-slate-800">{currentUser?.nama}</strong> (NIP: {currentUser?.nip}) akan diakhiri. Anda perlu memasukkan kembali kredensial untuk mengakses data kepegawaian.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setIsLogoutModalOpen(false)}
            className="px-4 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={logout}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:scale-98 rounded-xl shadow-md shadow-rose-600/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};
