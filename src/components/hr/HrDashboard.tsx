import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  UserCheck, 
  CalendarOff, 
  Award, 
  UserPlus, 
  TrendingUp, 
  Building2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  ArrowUpRight,
  Briefcase,
  ChevronRight
} from 'lucide-react';

export const HrDashboard: React.FC = () => {
  const { pegawaiList, pengajuanCutiList, absensiList, setActiveTab, notifikasiList } = useApp();

  // Stats Calculations
  const totalPegawai = pegawaiList.length;
  const pegawaiAktif = pegawaiList.filter(p => p.statusKerja === 'Aktif').length;
  const pegawaiCuti = pegawaiList.filter(p => p.statusKerja === 'Cuti').length;
  const pegawaiPensiun = pegawaiList.filter(p => p.statusKerja === 'Pensiun').length;
  const pegawaiBaru = pegawaiList.filter(p => p.masaKerjaTahun <= 1).length;

  // Status Kepegawaian breakdown
  const pnsCount = pegawaiList.filter(p => p.statusKepegawaian === 'PNS').length;
  const pppkCount = pegawaiList.filter(p => p.statusKepegawaian === 'PPPK').length;
  const honorerCount = pegawaiList.filter(p => p.statusKepegawaian === 'Honorer' || p.statusKepegawaian === 'Kontrak').length;

  // Unit Kerja Stats
  const unitStatsMap: Record<string, number> = {};
  pegawaiList.forEach(p => {
    unitStatsMap[p.unitKerja] = (unitStatsMap[p.unitKerja] || 0) + 1;
  });
  const unitStats = Object.entries(unitStatsMap).map(([unit, count]) => ({
    unit,
    count,
    percentage: Math.round((count / totalPegawai) * 100)
  }));

  // Attendance Today
  const todayRecords = absensiList.filter(a => a.tanggal === '2026-09-22');
  const hadirCount = todayRecords.filter(a => a.status === 'Hadir').length;
  const terlambatCount = todayRecords.filter(a => a.status === 'Terlambat').length;
  const izinCount = todayRecords.filter(a => a.status === 'Izin').length;
  const cutiCount = todayRecords.filter(a => a.status === 'Cuti').length;
  const attendanceRate = totalPegawai > 0 ? Math.round(((hadirCount + terlambatCount) / totalPegawai) * 100) : 94;

  const pendingLeaves = pengajuanCutiList.filter(c => c.status === 'Menunggu Persetujuan');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-white/5 skew-x-12 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-blue-200 text-xs font-semibold mb-2">
              <Building2 className="w-3.5 h-3.5" />
              <span>Portal Eksekutif Badan Kepegawaian Daerah</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              Layanan Administrasi Kepegawaian
            </h1>
            <p className="text-xs md:text-sm text-blue-100/85 mt-1 max-w-xl leading-relaxed">
              Pantau persebaran ASN, status kehadiran harian, usulan kenaikan pangkat, dan verifikasi permohonan cuti secara real-time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActiveTab('pegawai')}
              className="px-4 py-2.5 bg-white text-blue-800 hover:bg-blue-50 text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Tambah Pegawai</span>
            </button>
            <button
              onClick={() => setActiveTab('cuti')}
              className="px-4 py-2.5 bg-blue-600/80 hover:bg-blue-600 text-white text-xs font-bold rounded-xl border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <CalendarOff className="w-4 h-4" />
              <span>Verifikasi Cuti ({pendingLeaves.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 5 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Total Pegawai */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Total Pegawai</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-800 mt-2">{totalPegawai}</p>
          <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>Terdata dalam SIMPEG</span>
          </div>
        </div>

        {/* Pegawai Aktif */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Pegawai Aktif</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600 mt-2">{pegawaiAktif}</p>
          <p className="text-[10px] text-slate-400 mt-1">
            {Math.round((pegawaiAktif / totalPegawai) * 100)}% dari total formasi
          </p>
        </div>

        {/* Pegawai Cuti */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Pegawai Cuti</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <CalendarOff className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-600 mt-2">{pegawaiCuti}</p>
          <p className="text-[10px] text-slate-400 mt-1">Sedang menjalani cuti sah</p>
        </div>

        {/* Pegawai Pensiun */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Pegawai Pensiun</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-purple-600 mt-2">{pegawaiPensiun}</p>
          <p className="text-[10px] text-slate-400 mt-1">BUP Tahun 2026</p>
        </div>

        {/* Pegawai Baru */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-all col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Pegawai Baru</span>
            <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600">
              <UserPlus className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-cyan-600 mt-2">{pegawaiBaru}</p>
          <p className="text-[10px] text-slate-400 mt-1">Masa kerja &le; 1 tahun</p>
        </div>
      </div>

      {/* Main Charts & Statistics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Summary Widget */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Grafik Kehadiran Hari Ini</h3>
              <p className="text-[11px] text-slate-400">Selasa, 22 September 2026</p>
            </div>
            <button
              onClick={() => setActiveTab('absensi')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
            >
              <span>Rekap</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="my-4 flex items-center justify-around py-3 bg-slate-50 rounded-xl">
            <div className="text-center">
              <p className="text-2xl font-black text-blue-600">{attendanceRate}%</p>
              <p className="text-[10px] font-semibold text-slate-500 mt-0.5">Tingkat Hadir</p>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-center">
              <p className="text-2xl font-black text-emerald-600">{hadirCount}</p>
              <p className="text-[10px] font-semibold text-slate-500 mt-0.5">Tepat Waktu</p>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-center">
              <p className="text-2xl font-black text-amber-600">{terlambatCount}</p>
              <p className="text-[10px] font-semibold text-slate-500 mt-0.5">Terlambat</p>
            </div>
          </div>

          <div className="space-y-2.5 mt-auto">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 font-medium">Hadir Tepat Waktu</span>
                <span className="font-bold text-slate-800">{hadirCount} org</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full" 
                  style={{ width: `${(hadirCount / totalPegawai) * 100}%` }} 
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 font-medium">Terlambat Masuk</span>
                <span className="font-bold text-slate-800">{terlambatCount} org</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full" 
                  style={{ width: `${(terlambatCount / totalPegawai) * 100}%` }} 
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 font-medium">Izin / Sakit / Cuti</span>
                <span className="font-bold text-slate-800">{izinCount + cutiCount} org</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full" 
                  style={{ width: `${((izinCount + cutiCount) / totalPegawai) * 100}%` }} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Status Kepegawaian Breakdown */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800">Status Kepegawaian</h3>
            <p className="text-[11px] text-slate-400">Komposisi aparatur pemerintah</p>
          </div>

          <div className="py-4 space-y-4 my-auto">
            {/* PNS */}
            <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  PNS
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Pegawai Negeri Sipil</p>
                  <p className="text-[10px] text-slate-500">Jabatan Struktural & Fungsional</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-blue-700">{pnsCount}</span>
                <p className="text-[10px] text-slate-400">{Math.round((pnsCount / totalPegawai) * 100)}%</p>
              </div>
            </div>

            {/* PPPK */}
            <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  P3K
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">PPPK</p>
                  <p className="text-[10px] text-slate-500">Pegawai Pemerintah dg Perjanjian Kerja</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-emerald-700">{pppkCount}</span>
                <p className="text-[10px] text-slate-400">{Math.round((pppkCount / totalPegawai) * 100)}%</p>
              </div>
            </div>

            {/* Honorer */}
            <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                  THL
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Honorer & Kontrak</p>
                  <p className="text-[10px] text-slate-500">Tenaga Harian Lepas / BLUD</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-purple-700">{honorerCount}</span>
                <p className="text-[10px] text-slate-400">{Math.round((honorerCount / totalPegawai) * 100)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Unit Kerja Breakdown */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800">Persebaran per Unit Kerja</h3>
            <p className="text-[11px] text-slate-400">Jumlah personil per instansi</p>
          </div>

          <div className="py-3 space-y-3 overflow-y-auto max-h-64 pr-1">
            {unitStats.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-700 font-medium truncate max-w-[190px]">{item.unit}</span>
                  <span className="font-bold text-slate-900">{item.count} org</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: `${Math.max(15, item.percentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending Cuti & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Cuti Verification Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <CalendarOff className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-800">Pengajuan Cuti Menunggu Verifikasi</h3>
            </div>
            <button
              onClick={() => setActiveTab('cuti')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
            >
              <span>Kelola Semua</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="py-3 divide-y divide-slate-100">
            {pendingLeaves.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs text-slate-500 font-medium">Semua pengajuan cuti telah diproses!</p>
              </div>
            ) : (
              pendingLeaves.map((c) => (
                <div key={c.id} className="py-3 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-slate-800">{c.pegawaiNama}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{c.pegawaiUnit}</p>
                    <div className="flex items-center gap-2 mt-1 text-[11px]">
                      <span className="font-semibold text-blue-600">{c.jenisCuti}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-600">{c.jumlahHari} hari ({c.tanggalMulai} s.d {c.tanggalSelesai})</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('cuti')}
                    className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold rounded-lg border border-amber-200 shrink-0 transition-colors cursor-pointer"
                  >
                    Tinjau
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Notifikasi & Aktivitas Terkini */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-800">Aktivitas & Notifikasi Terbaru</h3>
            </div>
            <button
              onClick={() => setActiveTab('notifikasi')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
            >
              <span>Selengkapnya</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="py-2 divide-y divide-slate-100">
            {notifikasiList.slice(0, 4).map((notif) => (
              <div key={notif.id} className="py-2.5 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-slate-100 text-slate-600 shrink-0 mt-0.5">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800">{notif.judul}</p>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{notif.pesan}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{notif.waktu}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
