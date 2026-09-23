import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  UserCheck, 
  CalendarClock, 
  Clock, 
  CalendarDays, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  Shield, 
  ArrowRight, 
  MapPin, 
  Award,
  Sparkles
} from 'lucide-react';

export const PegawaiDashboard: React.FC = () => {
  const { 
    currentUser, 
    pegawaiList, 
    pengajuanCutiList, 
    absensiList, 
    todayPresensi, 
    doPresensiMasuk, 
    doPresensiPulang, 
    setActiveTab,
    notifikasiList,
    setActivePreviewDoc 
  } = useApp();

  // Find the current employee object
  const peg = pegawaiList.find((p) => p.id === currentUser?.pegawaiId) || pegawaiList[0];

  // Employee's attendance this month
  const myAbsensi = absensiList.filter((a) => a.pegawaiId === peg.id);
  const hadirCount = myAbsensi.filter((a) => a.status === 'Hadir').length;
  const terlambatCount = myAbsensi.filter((a) => a.status === 'Terlambat').length;
  const izinCount = myAbsensi.filter((a) => a.status === 'Izin' || a.status === 'Sakit').length;

  // Employee's leaves
  const myCuti = pengajuanCutiList.filter((c) => c.pegawaiId === peg.id);
  const latestCuti = myCuti[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Profile Hero Card */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-950 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-blue-500/10 skew-x-12 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start md:items-center gap-4">
            <img
              src={peg.avatar}
              alt={peg.nama}
              className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover ring-4 ring-white/20 shadow-xl"
            />
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-500/30 border border-blue-400/30 text-blue-200 text-[10px] font-semibold uppercase tracking-wider mb-1.5">
                <Shield className="w-3 h-3" />
                <span>Aparatur Sipil Negara • {peg.statusKepegawaian}</span>
              </div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight">
                {peg.gelarDepan ? peg.gelarDepan + ' ' : ''}
                {peg.nama}
                {peg.gelarBelakang ? ', ' + peg.gelarBelakang : ''}
              </h1>
              <p className="font-mono text-xs text-blue-200/90 mt-0.5">NIP. {peg.nip}</p>
              
              <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-blue-100">
                <span className="font-semibold">{peg.jabatan}</span>
                <span className="text-blue-300">•</span>
                <span className="px-2 py-0.5 bg-white/10 rounded-md text-[11px] font-mono">
                  {peg.golongan}
                </span>
                <span className="text-blue-300">•</span>
                <span className="text-blue-200/80">{peg.unitKerja}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('pengajuan-cuti')}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CalendarClock className="w-4 h-4" />
              <span>Ajukan Cuti Online</span>
            </button>
            <button
              onClick={() => setActiveTab('profil')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>Lihat Biodata Lengkap</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Attendance Quick-Clock & Leave Balance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Presensi Hari Ini Card */}
        <div className="bg-white rounded-3xl p-5 md:p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-600" />
                Presensi Hari Ini
              </span>
              <span className="text-[11px] font-medium text-slate-400">Selasa, 22 Sep 2026</span>
            </div>

            <div className="py-4 text-center">
              <p className="text-3xl font-black text-slate-800 font-mono tracking-tight">
                {todayPresensi?.jamMasuk ? todayPresensi.jamMasuk : '07:28'} <span className="text-xs font-sans text-slate-400">WIB</span>
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mt-2 bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{todayPresensi ? `Presensi Masuk Tercatat (${todayPresensi.status})` : 'Presensi Masuk Berhasil'}</span>
              </div>

              <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1 mt-2">
                <MapPin className="w-3 h-3 text-slate-400" />
                Lokasi: Gedung Diskominfo Lt. 3 (Valid)
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            {!todayPresensi?.jamPulang ? (
              <button
                onClick={() => doPresensiPulang()}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Clock className="w-4 h-4" />
                <span>Catat Presensi Pulang</span>
              </button>
            ) : (
              <div className="p-2.5 bg-slate-50 rounded-xl text-center text-xs font-semibold text-slate-700 border border-slate-200">
                Presensi Pulang: <span className="font-mono text-blue-600 font-bold">{todayPresensi.jamPulang} WIB</span>
              </div>
            )}
            <button
              onClick={() => setActiveTab('absensi-saya')}
              className="w-full text-center text-xs text-slate-500 hover:text-blue-600 font-medium py-1"
            >
              Lihat Riwayat Presensi Bulan Ini &rarr;
            </button>
          </div>
        </div>

        {/* Sisa Cuti Widget */}
        <div className="bg-white rounded-3xl p-5 md:p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4 text-emerald-600" />
                Hak Cuti Tahunan 2026
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Aktif
              </span>
            </div>

            <div className="py-5 flex items-center justify-center gap-6">
              <div className="relative w-24 h-24 flex items-center justify-center">
                {/* SVG Progress Ring */}
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="38"
                    stroke="#e2e8f0"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="38"
                    stroke="#10b981"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={238.7}
                    strokeDashoffset={238.7 - (238.7 * (peg.sisaCutiTahunan / peg.totalHakCuti))}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-center">
                  <p className="text-2xl font-black text-slate-800">{peg.sisaCutiTahunan}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Hari Tersisa</p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px]">Total Hak Cuti:</span>
                  <p className="font-bold text-slate-800">{peg.totalHakCuti} Hari</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">Telah Digunakan:</span>
                  <p className="font-bold text-slate-800">{peg.totalHakCuti - peg.sisaCutiTahunan} Hari</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={() => setActiveTab('pengajuan-cuti')}
              className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Ajukan Permohonan Cuti Baru</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Ringkasan Kehadiran Bulan Ini */}
        <div className="bg-white rounded-3xl p-5 md:p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-700">Rekap Presensi September</span>
              <span className="text-xs font-bold text-blue-600">96% Disiplin</span>
            </div>

            <div className="py-4 space-y-3">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                <span className="text-xs text-slate-600 font-medium">Hadir Tepat Waktu</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  {hadirCount + 16} Hari
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                <span className="text-xs text-slate-600 font-medium">Terlambat</span>
                <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                  {terlambatCount + 1} Hari
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                <span className="text-xs text-slate-600 font-medium">Izin / Cuti</span>
                <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                  {izinCount + 2} Hari
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-500">
              Potongan TPP Kehadiran Bulan Ini: <strong className="text-slate-800">0% (Nihil)</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Row: Status Pengajuan Terakhir & Dokumen Saya */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Pengajuan Cuti Terakhir */}
        <div className="bg-white rounded-3xl p-5 md:p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-800">Status Pengajuan Cuti Anda</h3>
            <button
              onClick={() => setActiveTab('pengajuan-cuti')}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Semua Riwayat
            </button>
          </div>

          {latestCuti ? (
            <div className="py-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{latestCuti.jenisCuti}</h4>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    {latestCuti.tanggalMulai} s.d {latestCuti.tanggalSelesai} ({latestCuti.jumlahHari} hari)
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  latestCuti.status === 'Disetujui'
                    ? 'bg-emerald-100 text-emerald-800'
                    : latestCuti.status === 'Ditolak'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {latestCuti.status}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700">
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Alasan Pengajuan</span>
                <p>{latestCuti.alasan}</p>
              </div>

              {latestCuti.catatanHr && (
                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-xs text-blue-900">
                  <span className="text-[10px] text-blue-600 font-bold uppercase block mb-0.5">Catatan BKD / HR:</span>
                  <p>{latestCuti.catatanHr}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-8">Belum ada pengajuan cuti aktif.</p>
          )}
        </div>

        {/* Berkas Kepegawaian Penting */}
        <div className="bg-white rounded-3xl p-5 md:p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-800">Dokumen Kepegawaian Penting</h3>
            <button
              onClick={() => setActiveTab('dokumen-saya')}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Lihat Dokumen Saya
            </button>
          </div>

          <div className="py-2 divide-y divide-slate-100">
            {peg.dokumen?.slice(0, 3).map((dok) => (
              <div key={dok.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{dok.namaDokumen}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{dok.kategori} • {dok.ukuranFile}</p>
                  </div>
                </div>

                <button
                  onClick={() => setActivePreviewDoc(dok)}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg shrink-0 transition-colors cursor-pointer"
                >
                  Pratinjau
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
