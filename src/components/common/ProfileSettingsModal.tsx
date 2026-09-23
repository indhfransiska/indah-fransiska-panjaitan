import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Mail, Phone, Building2, Shield, X, Check, Camera, Briefcase } from 'lucide-react';

export const ProfileSettingsModal: React.FC = () => {
  const { isProfileModalOpen, setIsProfileModalOpen, currentUser, setCurrentUser, addToast } = useApp();
  const [nama, setNama] = useState(currentUser?.nama || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');
  const [isSaving, setIsSaving] = useState(false);

  if (!isProfileModalOpen || !currentUser) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setCurrentUser({
        ...currentUser,
        nama,
        email,
        avatar
      });
      setIsSaving(false);
      setIsProfileModalOpen(false);
      addToast('Profil pengguna berhasil diperbarui', 'success');
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-800">Profil & Pengaturan Akun</h3>
              <p className="text-xs text-slate-500">Kelola identitas dan akun SIMPEG</p>
            </div>
          </div>
          <button
            onClick={() => setIsProfileModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="py-5 space-y-4">
          {/* Avatar Section */}
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="relative group">
              <img
                src={avatar}
                alt={nama}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white shadow-md"
              />
              <label 
                className="absolute inset-0 bg-slate-900/40 rounded-2xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                title="Ganti Foto"
              >
                <Camera className="w-5 h-5" />
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => {
                        setAvatar(reader.result as string);
                        addToast('Foto baru dipilih', 'info');
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-800">{currentUser.nama}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-200/80 text-slate-700">
                  NIP: {currentUser.nip}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  currentUser.role === 'hr_admin' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {currentUser.role === 'hr_admin' ? 'HR / Administrator' : 'Pegawai ASN'}
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Lengkap dengan Gelar
            </label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Resmi Dinas
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                required
              />
              <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">Jabatan</span>
              <p className="text-xs font-semibold text-slate-800 mt-0.5 truncate">{currentUser.jabatan}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">Unit Kerja</span>
              <p className="text-xs font-semibold text-slate-800 mt-0.5 truncate">{currentUser.unitKerja}</p>
            </div>
          </div>

          <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-800 space-y-1">
            <p className="font-semibold flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-blue-600" />
              Keamanan Akun Terintegrasi
            </p>
            <p className="text-[11px] text-blue-700/90 leading-relaxed">
              Data NIP, Jabatan Struktural, dan Unit Kerja dikelola langsung oleh Tim BKD. Jika ada perubahan jabatan, hubungi Bagian Mutasi.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(false)}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-98 rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center gap-2"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
