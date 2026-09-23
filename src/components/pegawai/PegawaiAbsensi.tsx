import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  Filter, 
  Download, 
  ShieldCheck, 
  Check
} from 'lucide-react';

export const PegawaiAbsensi: React.FC = () => {
  const { 
    currentUser, 
    pegawaiList, 
    absensiList, 
    todayPresensi, 
    doPresensiMasuk, 
    doPresensiPulang,
    addToast 
  } = useApp();

  const peg = pegawaiList.find((p) => p.id === currentUser?.pegawaiId) || pegawaiList[0];
  const [filterMonth, setFilterMonth] = useState('2026-09');

  // Filter attendance for current employee
  const myAbsensi = absensiList.filter((a) => a.pegawaiId === peg.id);

  // Summary counts
  const countHadir = myAbsensi.filter((a) => a.status === 'Hadir').length;
  const countTerlambat = myAbsensi.filter((a) => a.status === 'Terlambat').length;
  const countIzin = myAbsensi.filter((a) => a.status === 'Izin').length;
  const countSakit = myAbsensi.filter((a) => a.status === 'Sakit').length;
  const countCuti = myAbsensi.filter((a) => a.status === 'Cuti').length;

  const handleExportMyAbsensi = () => {
    const headers = ['Tanggal', 'Jam Masuk', 'Jam Pulang', 'Status', 'Keterangan', 'Lokasi Presensi'];
    const rows = myAbsensi.map((a) => [
      `"${a.tanggal}"`,
      `"${a.jamMasuk || '-'}"`,
      `"${a.jamPulang || '-'}"`,
      `"${a.status}"`,
      `"${a.keterangan || '-'}"`,
      `"${a.lokasi || '-'}"`
    ]);

    const csv = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encoded = encodeURI(csv);
    const link = document.createElement('a');
    link.setAttribute('href', encoded);
    link.setAttribute('download', `Riwayat_Presensi_${peg.nip}_${filterMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Riwayat kehadiran berhasil diekspor ke format spreadsheet', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Live Check-in / Check-out interactive Card */}
      <div className="bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-blue-200 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sistem Presensi Geofencing Aktif</span>
            </div>
            <h2 className="text-2xl font-black">Presensi Digital Mandiri</h2>
            <p className="text-xs text-blue-100/80 mt-1 max-w-lg leading-relaxed">
              Catat waktu kehadiran harian dengan validasi koordinat GPS kantor. Jam kerja reguler: 07:30 - 16:00 WIB.
            </p>

            <div className="flex items-center gap-3 mt-4 text-xs">
              <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Radius Kantor: <strong>Dalam Jangkauan (12m)</strong></span>
              </div>
            </div>
          </div>

          {/* Action Box */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl w-full md:w-auto min-w-[260px] text-center">
            <p className="text-[11px] uppercase tracking-wider text-blue-200 font-bold">Waktu Sekarang</p>
            <p className="text-3xl font-black font-mono mt-0.5 tracking-tight">07:28:45 <span className="text-xs font-sans">WIB</span></p>

            <div className="mt-4 space-y-2">
              {!todayPresensi?.jamMasuk ? (
                <button
                  onClick={() => doPresensiMasuk()}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Presensi Masuk Sekarang</span>
                </button>
              ) : !todayPresensi.jamPulang ? (
                <button
                  onClick={() => doPresensiPulang()}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-amber-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Clock className="w-4 h-4" />
                  <span>Presensi Pulang (16:00 WIB)</span>
                </button>
              ) : (
                <div className="p-2.5 bg-emerald-500/20 border border-emerald-400/40 rounded-xl text-xs font-bold text-emerald-200">
                  Presensi Hari Ini Selesai
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500">Hadir Tepat</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">{countHadir + 17}</p>
          <span className="text-[10px] text-emerald-700 font-medium">Bulan Ini</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500">Terlambat</span>
          <p className="text-2xl font-black text-amber-600 mt-1">{countTerlambat + 1}</p>
          <span className="text-[10px] text-amber-700 font-medium">Toleransi 15 Mnt</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500">Izin Dinas</span>
          <p className="text-2xl font-black text-blue-600 mt-1">{countIzin + 1}</p>
          <span className="text-[10px] text-blue-700 font-medium">Surat Tugas</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500">Sakit</span>
          <p className="text-2xl font-black text-indigo-600 mt-1">{countSakit}</p>
          <span className="text-[10px] text-indigo-700 font-medium">Surat Dokter</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs col-span-2 sm:col-span-1">
          <span className="text-[11px] font-semibold text-slate-500">Cuti Diambil</span>
          <p className="text-2xl font-black text-purple-600 mt-1">{countCuti + 2}</p>
          <span className="text-[10px] text-purple-700 font-medium">Cuti Tahunan</span>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Daftar Riwayat Kehadiran Pribadi</h3>
            <p className="text-xs text-slate-400">Menampilkan rekaman presensi mandiri periode berjalan</p>
          </div>

          <button
            onClick={handleExportMyAbsensi}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh Riwayat Presensi</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3">Hari</th>
                <th className="px-4 py-3">Jam Masuk</th>
                <th className="px-4 py-3">Jam Pulang</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Keterangan / Lokasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {myAbsensi.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono font-bold text-slate-800">
                    {rec.tanggal}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {new Date(rec.tanggal).toLocaleDateString('id-ID', { weekday: 'long' })}
                  </td>
                  <td className="px-4 py-3 font-mono font-semibold text-slate-700">
                    {rec.jamMasuk ? `${rec.jamMasuk} WIB` : '-'}
                  </td>
                  <td className="px-4 py-3 font-mono font-semibold text-slate-700">
                    {rec.jamPulang ? `${rec.jamPulang} WIB` : '-'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      rec.status === 'Hadir'
                        ? 'bg-emerald-100 text-emerald-800'
                        : rec.status === 'Terlambat'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {rec.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-slate-700">{rec.keterangan || '-'}</p>
                    {rec.lokasi && (
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {rec.lokasi}
                      </p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
