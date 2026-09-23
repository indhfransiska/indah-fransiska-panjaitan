import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Shield, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Building, 
  HelpCircle,
  X,
  Send
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useApp();
  const [nip, setNip] = useState('198503152010011002');
  const [password, setPassword] = useState('admin123');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotInput, setForgotInput] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const result = login(nip, password);
      setIsLoading(false);
      if (!result.success) {
        setErrorMessage(result.message || 'Login gagal. Silakan periksa kembali NIP dan password.');
      }
    }, 650);
  };

  const handleQuickLogin = (role: 'hr' | 'pegawai') => {
    if (role === 'hr') {
      setNip('198503152010011002');
      setPassword('admin123');
      setErrorMessage('');
    } else {
      setNip('199208202018021001');
      setPassword('user123');
      setErrorMessage('');
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotInput) return;
    setForgotSuccess(true);
    setTimeout(() => {
      setForgotSuccess(false);
      setShowForgotModal(false);
      setForgotInput('');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 flex items-center justify-center p-4 selection:bg-blue-500 selection:text-white relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Card Container */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-950/40 border border-slate-100/20 overflow-hidden backdrop-blur-xl">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 p-7 text-white text-center relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/5 rounded-full blur-sm" />
            <div className="w-14 h-14 mx-auto mb-3.5 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
              <Shield className="w-7 h-7 text-white drop-shadow" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-500/30 border border-blue-400/30 text-[10px] font-semibold tracking-wider uppercase mb-1 text-blue-200">
              Pemerintah Republik Indonesia
            </div>
            <h1 className="text-xl font-black tracking-tight text-white">
              Sistem Informasi Kepegawaian
            </h1>
            <p className="text-xs text-blue-200/90 mt-1 font-medium">
              SIMPEG Terpadu • Badan Kepegawaian Daerah
            </p>
          </div>

          {/* Form Content */}
          <div className="p-7">
            {/* Quick Login Helper Tabs */}
            <div className="mb-6 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              <p className="text-[10px] font-semibold text-slate-500 px-2 pt-1 pb-1.5 text-center">
                Pilih Akun Uji Coba Cepat:
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('hr')}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                    nip === '198503152010011002'
                      ? 'bg-white text-blue-700 shadow-sm border border-slate-200/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  🛡️ HR / Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('pegawai')}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                    nip === '199208202018021001'
                      ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  👤 Pegawai ASN
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* NIP Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nomor Induk Pegawai (NIP) / Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={nip}
                    onChange={(e) => setNip(e.target.value)}
                    placeholder="Contoh: 198503152010011002"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono"
                    required
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Kata Sandi (Password)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-[11px] font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                  >
                    Lupa Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi akun Anda"
                    className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    required
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 focus:ring-offset-0"
                  />
                  <span className="text-xs text-slate-600 font-medium">Ingat saya pada perangkat ini</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Memverifikasi kredensial...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke SIMPEG</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-100 text-center">
              <p className="text-[11px] text-slate-400">
                Aplikasi Resmi Manajemen Aparatur Sipil Negara
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                © 2026 Badan Kepegawaian Daerah. Seluruh Hak Cipta Dilindungi.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">Pemulihan Kata Sandi</h3>
              <button
                onClick={() => setShowForgotModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {forgotSuccess ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-xs font-bold text-slate-800">Tautan Pemulihan Terkirim</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Instruksi reset kata sandi telah dikirim ke email kedinasan terdaftar yang terhubung dengan NIP tersebut.
                </p>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="py-4 space-y-3">
                <p className="text-xs text-slate-600">
                  Masukkan NIP atau email kedinasan Anda. Sistem akan mengirimkan tautan reset kata sandi resmi.
                </p>
                <input
                  type="text"
                  value={forgotInput}
                  onChange={(e) => setForgotInput(e.target.value)}
                  placeholder="NIP / Email Dinas"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-3 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim Tautan</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
