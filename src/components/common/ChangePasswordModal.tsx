import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lock, Eye, EyeOff, Check, X } from 'lucide-react';

export const ChangePasswordModal: React.FC = () => {
  const { isChangePasswordModalOpen, setIsChangePasswordModalOpen, addToast } = useApp();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isChangePasswordModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      addToast('Semua kolom kata sandi wajib diisi', 'warning');
      return;
    }
    if (newPassword.length < 6) {
      addToast('Kata sandi baru minimal harus 6 karakter', 'warning');
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast('Konfirmasi kata sandi baru tidak cocok', 'error');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsChangePasswordModalOpen(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      addToast('Kata sandi Anda berhasil diperbarui', 'success');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-800">Ubah Kata Sandi</h3>
              <p className="text-xs text-slate-500">Perbarui kata sandi akun SIMPEG</p>
            </div>
          </div>
          <button
            onClick={() => setIsChangePasswordModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Kata Sandi Saat Ini
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Masukkan kata sandi lama"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Kata Sandi Baru
            </label>
            <input
              type={showPass ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Konfirmasi Kata Sandi Baru
            </label>
            <input
              type={showPass ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi kata sandi baru"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              required
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700">Persyaratan kata sandi:</p>
            <p className="flex items-center gap-1.5">
              <Check className={`w-3.5 h-3.5 ${newPassword.length >= 6 ? 'text-emerald-600' : 'text-slate-300'}`} />
              Minimal 6 karakter
            </p>
            <p className="flex items-center gap-1.5">
              <Check className={`w-3.5 h-3.5 ${newPassword && newPassword === confirmPassword ? 'text-emerald-600' : 'text-slate-300'}`} />
              Konfirmasi cocok dengan kata sandi baru
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsChangePasswordModalOpen(false)}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-98 rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              <span>Simpan Kata Sandi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
