import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PengajuanCuti } from '../../types';
import { 
  CalendarDays, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Filter, 
  Search, 
  FileText, 
  Phone, 
  MapPin, 
  UserCheck, 
  AlertCircle,
  X,
  Check,
  ChevronRight
} from 'lucide-react';

export const HrCuti: React.FC = () => {
  const { pengajuanCutiList, approveCuti, rejectCuti, pegawaiList, addToast } = useApp();
  const [selectedStatusTab, setSelectedStatusTab] = useState<'SEMUA' | 'Menunggu Persetujuan' | 'Disetujui' | 'Ditolak'>('Menunggu Persetujuan');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Review Modal State
  const [selectedCuti, setSelectedCuti] = useState<PengajuanCuti | null>(null);
  const [catatanAction, setCatatanAction] = useState('');

  const filteredCuti = pengajuanCutiList.filter((item) => {
    const matchStatus = selectedStatusTab === 'SEMUA' || item.status === selectedStatusTab;
    const matchSearch =
      item.pegawaiNama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pegawaiNip.includes(searchTerm) ||
      item.jenisCuti.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  const pendingCount = pengajuanCutiList.filter((c) => c.status === 'Menunggu Persetujuan').length;
  const approvedCount = pengajuanCutiList.filter((c) => c.status === 'Disetujui').length;
  const rejectedCount = pengajuanCutiList.filter((c) => c.status === 'Ditolak').length;

  const handleApprove = (cuti: PengajuanCuti) => {
    approveCuti(cuti.id, catatanAction || 'Permohonan cuti disetujui sesuai kuota dan regulasi.');
    setSelectedCuti(null);
    setCatatanAction('');
  };

  const handleReject = (cuti: PengajuanCuti) => {
    if (!catatanAction.trim()) {
      addToast('Wajib memberikan alasan atau catatan penolakan untuk pegawai', 'warning');
      return;
    }
    rejectCuti(cuti.id, catatanAction);
    setSelectedCuti(null);
    setCatatanAction('');
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Persetujuan & Administrasi Cuti Pegawai</h2>
          <p className="text-xs text-slate-500">
            Validasi berkas cuti tahunan, cuti melahirkan, cuti alasan penting, dan cuti sakit aparatur.
          </p>
        </div>
      </div>

      {/* Tabs / Status Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setSelectedStatusTab('Menunggu Persetujuan')}
          className={`p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${
            selectedStatusTab === 'Menunggu Persetujuan'
              ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/20 font-bold'
              : 'bg-white text-slate-700 border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold">Menunggu Persetujuan</span>
            <Clock className="w-4 h-4 opacity-80" />
          </div>
          <p className="text-xl font-black mt-2">{pendingCount}</p>
        </button>

        <button
          onClick={() => setSelectedStatusTab('Disetujui')}
          className={`p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${
            selectedStatusTab === 'Disetujui'
              ? 'bg-emerald-600 text-white border-emerald-700 shadow-md shadow-emerald-600/20 font-bold'
              : 'bg-white text-slate-700 border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold">Disetujui</span>
            <CheckCircle2 className="w-4 h-4 opacity-80" />
          </div>
          <p className="text-xl font-black mt-2">{approvedCount}</p>
        </button>

        <button
          onClick={() => setSelectedStatusTab('Ditolak')}
          className={`p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${
            selectedStatusTab === 'Ditolak'
              ? 'bg-rose-600 text-white border-rose-700 shadow-md shadow-rose-600/20 font-bold'
              : 'bg-white text-slate-700 border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold">Ditolak</span>
            <XCircle className="w-4 h-4 opacity-80" />
          </div>
          <p className="text-xl font-black mt-2">{rejectedCount}</p>
        </button>

        <button
          onClick={() => setSelectedStatusTab('SEMUA')}
          className={`p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${
            selectedStatusTab === 'SEMUA'
              ? 'bg-slate-800 text-white border-slate-900 shadow-md font-bold'
              : 'bg-white text-slate-700 border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold">Semua Riwayat</span>
            <CalendarDays className="w-4 h-4 opacity-80" />
          </div>
          <p className="text-xl font-black mt-2">{pengajuanCutiList.length}</p>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama pemohon atau jenis cuti..."
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
        <p className="text-xs text-slate-500 font-medium">
          Ditemukan <strong className="text-slate-800">{filteredCuti.length}</strong> permohonan
        </p>
      </div>

      {/* Cuti Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Pegawai Pemohon</th>
                <th className="px-4 py-3.5">Jenis Cuti</th>
                <th className="px-4 py-3.5">Jangka Waktu</th>
                <th className="px-4 py-3.5">Alasan Permohonan</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-center">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredCuti.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                    <CalendarDays className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-600">Tidak ada data cuti dalam kategori ini</p>
                  </td>
                </tr>
              ) : (
                filteredCuti.map((item) => {
                  const currentPeg = pegawaiList.find((p) => p.id === item.pegawaiId);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3.5">
                        <p className="font-bold text-slate-900">{item.pegawaiNama}</p>
                        <p className="font-mono text-[11px] text-slate-400">NIP. {item.pegawaiNip}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{item.pegawaiUnit}</p>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700">
                          {item.jenisCuti}
                        </span>
                        {currentPeg && item.jenisCuti === 'Cuti Tahunan' && (
                          <p className="text-[10px] text-slate-400 mt-1">
                            Sisa kuota: {currentPeg.sisaCutiTahunan} hari
                          </p>
                        )}
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <p className="font-bold text-slate-800">{item.jumlahHari} Hari Kerja</p>
                        <p className="text-[11px] text-slate-500 font-mono">
                          {item.tanggalMulai} s.d {item.tanggalSelesai}
                        </p>
                      </td>

                      <td className="px-4 py-3.5 max-w-xs">
                        <p className="font-medium text-slate-800 line-clamp-2 leading-relaxed">
                          {item.alasan}
                        </p>
                        {item.catatanHr && (
                          <p className="text-[10px] text-slate-500 italic mt-1 bg-slate-50 p-1.5 rounded border border-slate-100">
                            Catatan HR: {item.catatanHr}
                          </p>
                        )}
                      </td>

                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          item.status === 'Disetujui'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'Ditolak'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            item.status === 'Disetujui'
                              ? 'bg-emerald-600'
                              : item.status === 'Ditolak'
                              ? 'bg-rose-600'
                              : 'bg-amber-600'
                          }`} />
                          {item.status}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-center">
                        <button
                          onClick={() => {
                            setSelectedCuti(item);
                            setCatatanAction(item.catatanHr || '');
                          }}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          {item.status === 'Menunggu Persetujuan' ? 'Proses Telaah' : 'Lihat Detail'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* REVIEW & APPROVAL MODAL */}
      {selectedCuti && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-800">Detail Pengajuan Cuti ASN</h3>
                <p className="text-xs text-slate-500">Formulir telaah dan persetujuan pejabat berwenang</p>
              </div>
              <button onClick={() => setSelectedCuti(null)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              {/* Employee Info */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{selectedCuti.pegawaiNama}</h4>
                    <p className="font-mono text-slate-500">NIP. {selectedCuti.pegawaiNip}</p>
                    <p className="text-slate-600 mt-0.5">{selectedCuti.pegawaiUnit}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    selectedCuti.status === 'Disetujui'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedCuti.status === 'Ditolak'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedCuti.status}
                  </span>
                </div>
              </div>

              {/* Leave Info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                  <span className="text-[10px] text-blue-600 font-bold uppercase">Jenis Cuti</span>
                  <p className="font-bold text-slate-800 mt-0.5">{selectedCuti.jenisCuti}</p>
                </div>
                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                  <span className="text-[10px] text-blue-600 font-bold uppercase">Lama Cuti</span>
                  <p className="font-bold text-slate-800 mt-0.5">{selectedCuti.jumlahHari} Hari Kerja</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Rentang Tanggal</span>
                <p className="font-semibold text-slate-800 mt-0.5 font-mono">
                  {selectedCuti.tanggalMulai} s.d {selectedCuti.tanggalSelesai}
                </p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Alasan Permohonan Cuti</span>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 leading-relaxed">
                  {selectedCuti.alasan}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Alamat Selama Cuti</span>
                  <p className="font-medium text-slate-800 mt-0.5">{selectedCuti.alamatSelamaCuti || 'Dalam Kota'}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">No. Kontak Darurat</span>
                  <p className="font-medium text-slate-800 mt-0.5">{selectedCuti.teleponSelamaCuti || '-'}</p>
                </div>
              </div>

              {/* Action Note Form */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Catatan Pejabat Pembina Kepegawaian (HR):
                </label>
                <textarea
                  rows={2}
                  value={catatanAction}
                  onChange={(e) => setCatatanAction(e.target.value)}
                  placeholder="Ketik catatan pertimbangan atau alasan penolakan..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedCuti(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Tutup
                </button>

                {selectedCuti.status === 'Menunggu Persetujuan' && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleReject(selectedCuti)}
                      className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl border border-rose-200 flex items-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Tolak Permohonan</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApprove(selectedCuti)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Setujui Permohonan</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
