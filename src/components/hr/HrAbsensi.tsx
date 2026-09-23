import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { AbsensiRecord, StatusAbsensi } from '../../types';
import { 
  Clock, 
  Search, 
  Filter, 
  Calendar, 
  Download, 
  Printer, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  UserX, 
  Building2, 
  ChevronDown,
  TrendingUp,
  MapPin
} from 'lucide-react';

export const HrAbsensi: React.FC = () => {
  const { absensiList, pegawaiList, addToast } = useApp();
  const [selectedDate, setSelectedDate] = useState('2026-09-22');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedUnit, setSelectedUnit] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Extract units
  const unitList = useMemo(() => {
    return Array.from(new Set(pegawaiList.map((p) => p.unitKerja)));
  }, [pegawaiList]);

  // Filter attendance
  const filteredAbsensi = useMemo(() => {
    return absensiList.filter((item) => {
      const matchDate = !selectedDate || item.tanggal === selectedDate;
      const matchStatus = selectedStatus === 'ALL' || item.status === selectedStatus;
      const matchUnit = selectedUnit === 'ALL' || item.unitKerja === selectedUnit;
      const matchSearch =
        item.pegawaiNama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nip.includes(searchTerm);

      return matchDate && matchStatus && matchUnit && matchSearch;
    });
  }, [absensiList, selectedDate, selectedStatus, selectedUnit, searchTerm]);

  // Summary counts for current filtered or current date
  const dateRecords = absensiList.filter((a) => !selectedDate || a.tanggal === selectedDate);
  const countHadir = dateRecords.filter((a) => a.status === 'Hadir').length;
  const countTerlambat = dateRecords.filter((a) => a.status === 'Terlambat').length;
  const countIzin = dateRecords.filter((a) => a.status === 'Izin').length;
  const countSakit = dateRecords.filter((a) => a.status === 'Sakit').length;
  const countCuti = dateRecords.filter((a) => a.status === 'Cuti').length;
  const countAlpa = dateRecords.filter((a) => a.status === 'Alpa').length;

  const handleExport = () => {
    const headers = ['Tanggal', 'NIP', 'Nama Pegawai', 'Unit Kerja', 'Jam Masuk', 'Jam Pulang', 'Status', 'Keterangan', 'Lokasi Presensi'];
    const rows = filteredAbsensi.map((a) => [
      `"${a.tanggal}"`,
      `="${a.nip}"`,
      `"${a.pegawaiNama}"`,
      `"${a.unitKerja}"`,
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
    link.setAttribute('download', `Rekap_Presensi_${selectedDate || 'Semua'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Rekap presensi berhasil diunduh dalam format Excel/CSV', 'success');
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Rekapitulasi Kehadiran & Absensi</h2>
          <p className="text-xs text-slate-500">
            Pemantauan presensi harian berbasis GPS/Biometrik terintegrasi Badan Kepegawaian Daerah.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Cetak</span>
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Rekap Presensi</span>
          </button>
        </div>
      </div>

      {/* Metric Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Hadir */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500">Hadir Tepat</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">{countHadir}</p>
          <span className="text-[10px] text-emerald-700 font-medium">Sebelum 07:30</span>
        </div>

        {/* Terlambat */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500">Terlambat</span>
          <p className="text-2xl font-black text-amber-600 mt-1">{countTerlambat}</p>
          <span className="text-[10px] text-amber-700 font-medium">Potong TPP 1-3%</span>
        </div>

        {/* Izin */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500">Izin Dinas</span>
          <p className="text-2xl font-black text-blue-600 mt-1">{countIzin}</p>
          <span className="text-[10px] text-blue-700 font-medium">Surat Tugas</span>
        </div>

        {/* Sakit */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500">Sakit</span>
          <p className="text-2xl font-black text-indigo-600 mt-1">{countSakit}</p>
          <span className="text-[10px] text-indigo-700 font-medium">Surat Dokter</span>
        </div>

        {/* Cuti */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500">Cuti Sah</span>
          <p className="text-2xl font-black text-purple-600 mt-1">{countCuti}</p>
          <span className="text-[10px] text-purple-700 font-medium">SK Cuti Terbit</span>
        </div>

        {/* Alpa */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500">Tanpa Keterangan</span>
          <p className="text-2xl font-black text-rose-600 mt-1">{countAlpa}</p>
          <span className="text-[10px] text-rose-700 font-medium">Alpa / Mangkir</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Date Filter */}
        <div className="relative">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Tanggal Presensi
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Status Kehadiran
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
          >
            <option value="ALL">Semua Status Kehadiran</option>
            <option value="Hadir">Hadir Tepat Waktu</option>
            <option value="Terlambat">Terlambat</option>
            <option value="Izin">Izin Dinas Luar</option>
            <option value="Sakit">Sakit</option>
            <option value="Cuti">Cuti Resmi</option>
            <option value="Alpa">Tanpa Keterangan (Alpa)</option>
          </select>
        </div>

        {/* Unit Kerja */}
        <div className="relative">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Unit Kerja / OPD
          </label>
          <select
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
          >
            <option value="ALL">Semua Unit Kerja</option>
            {unitList.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <div className="relative">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Pencarian Nama / NIP
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari pegawai..."
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Pegawai</th>
                <th className="px-4 py-3.5">Unit Kerja</th>
                <th className="px-4 py-3.5">Tanggal</th>
                <th className="px-4 py-3.5">Jam Masuk</th>
                <th className="px-4 py-3.5">Jam Pulang</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Keterangan / Lokasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredAbsensi.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-600">Tidak ada catatan presensi pada filter ini</p>
                  </td>
                </tr>
              ) : (
                filteredAbsensi.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5">
                      <p className="font-bold text-slate-900">{item.pegawaiNama}</p>
                      <p className="font-mono text-[11px] text-slate-400">NIP. {item.nip}</p>
                    </td>

                    <td className="px-4 py-3.5 text-slate-700 font-medium max-w-xs truncate">
                      {item.unitKerja}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap font-mono text-slate-600">
                      {item.tanggal}
                    </td>

                    <td className="px-4 py-3.5 font-mono font-bold text-slate-800">
                      {item.jamMasuk ? `${item.jamMasuk} WIB` : '-'}
                    </td>

                    <td className="px-4 py-3.5 font-mono font-bold text-slate-800">
                      {item.jamPulang ? `${item.jamPulang} WIB` : '-'}
                    </td>

                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        item.status === 'Hadir'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'Terlambat'
                          ? 'bg-amber-100 text-amber-800'
                          : item.status === 'Izin'
                          ? 'bg-blue-100 text-blue-800'
                          : item.status === 'Sakit'
                          ? 'bg-indigo-100 text-indigo-800'
                          : item.status === 'Cuti'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 max-w-xs">
                      <div className="space-y-0.5">
                        {item.keterangan && (
                          <p className="text-slate-800 font-medium leading-tight">{item.keterangan}</p>
                        )}
                        {item.lokasi && (
                          <p className="text-[10px] text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            {item.lokasi}
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
