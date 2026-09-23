import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { JenisCuti } from '../../types';
import { 
  CalendarDays, 
  CalendarClock, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Send, 
  AlertCircle, 
  FileText, 
  Phone, 
  MapPin, 
  Upload, 
  HelpCircle,
  Plus
} from 'lucide-react';

export const PegawaiCuti: React.FC = () => {
  const { currentUser, pegawaiList, pengajuanCutiList, addPengajuanCuti, addToast } = useApp();
  const peg = pegawaiList.find((p) => p.id === currentUser?.pegawaiId) || pegawaiList[0];

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [jenisCuti, setJenisCuti] = useState<JenisCuti>('Cuti Tahunan');
  const [tanggalMulai, setTanggalMulai] = useState('2026-10-05');
  const [tanggalSelesai, setTanggalSelesai] = useState('2026-10-07');
  const [alasan, setAlasan] = useState('');
  const [alamatSelamaCuti, setAlamatSelamaCuti] = useState('');
  const [teleponSelamaCuti, setTeleponSelamaCuti] = useState(peg.telepon || '');

  // Calculate days between dates
  const calculateDays = (start: string, end: string) => {
    if (!start || !end) return 1;
    const s = new Date(start);
    const e = new Date(end);
    const diffTime = e.getTime() - s.getTime();
    if (diffTime < 0) return 0;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const calculatedDays = calculateDays(tanggalMulai, tanggalSelesai);

  // My leave requests
  const myLeaves = pengajuanCutiList.filter((c) => c.pegawaiId === peg.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (calculatedDays <= 0) {
      addToast('Tanggal selesai cuti tidak boleh mendahului tanggal mulai', 'warning');
      return;
    }

    if (jenisCuti === 'Cuti Tahunan' && calculatedDays > peg.sisaCutiTahunan) {
      addToast(`Permohonan ${calculatedDays} hari melebihi sisa cuti tahunan Anda (${peg.sisaCutiTahunan} hari)`, 'warning');
      return;
    }

    if (!alasan.trim()) {
      addToast('Alasan pengajuan cuti wajib diisi dengan jelas', 'warning');
      return;
    }

    const success = addPengajuanCuti({
      jenisCuti,
      tanggalMulai,
      tanggalSelesai,
      jumlahHari: calculatedDays,
      alasan,
      alamatSelamaCuti: alamatSelamaCuti || peg.alamat,
      teleponSelamaCuti: teleponSelamaCuti || peg.telepon
    });

    if (success) {
      setIsFormOpen(false);
      setAlasan('');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Balance Cards */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Layanan Permohonan Cuti Mandiri</h2>
          <p className="text-xs text-slate-500">
            Ajukan cuti tahunan, cuti melahirkan, atau cuti alasan penting secara elektronik.
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{isFormOpen ? 'Tutup Formulir' : 'Ajukan Cuti Baru'}</span>
        </button>
      </div>

      {/* Leave Quota Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Cuti Tahunan */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-slate-700">Cuti Tahunan 2026</span>
              <p className="text-2xl font-black text-emerald-600 mt-1">{peg.sisaCutiTahunan} Hari</p>
            </div>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CalendarDays className="w-5 h-5" />
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Dari total hak cuti {peg.totalHakCuti} hari kerja/tahun
          </p>
        </div>

        {/* Cuti Alasan Penting */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-slate-700">Cuti Alasan Penting</span>
              <p className="text-2xl font-black text-blue-600 mt-1">Maks. 30 Hari</p>
            </div>
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Clock className="w-5 h-5" />
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Pernikahan, musibah keluarga inti, dsb
          </p>
        </div>

        {/* Cuti Sakit */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-slate-700">Cuti Sakit</span>
              <p className="text-2xl font-black text-indigo-600 mt-1">Sesuai Surat</p>
            </div>
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <FileText className="w-5 h-5" />
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Wajib melampirkan surat dokter resmi
          </p>
        </div>

        {/* Cuti Melahirkan / Besar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-slate-700">Cuti Besar / Bersalin</span>
              <p className="text-2xl font-black text-purple-600 mt-1">3 Bulan</p>
            </div>
            <span className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <CalendarClock className="w-5 h-5" />
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Masa kerja minimal 5 tahun (Cuti Besar)
          </p>
        </div>
      </div>

      {/* FORM PENGAJUAN CUTI */}
      {isFormOpen && (
        <div className="bg-white rounded-3xl p-6 border-2 border-blue-500/30 shadow-lg animate-in slide-in-from-top-4">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Formulir Permohonan Cuti Aparatur Sipil Negara</h3>
              <p className="text-xs text-slate-500">Isi formulir pengajuan dengan data sebenarnya sesuai peraturan BKN</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="py-4 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Pilih Jenis Cuti *</label>
                <select
                  value={jenisCuti}
                  onChange={(e) => setJenisCuti(e.target.value as JenisCuti)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="Cuti Tahunan">Cuti Tahunan (Sisa: {peg.sisaCutiTahunan} hari)</option>
                  <option value="Cuti Alasan Penting">Cuti Alasan Penting (Keluarga/Menikah)</option>
                  <option value="Cuti Sakit">Cuti Sakit</option>
                  <option value="Cuti Melahirkan">Cuti Melahirkan</option>
                  <option value="Cuti Besar">Cuti Besar</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tanggal Mulai Cuti *</label>
                <input
                  type="date"
                  value={tanggalMulai}
                  onChange={(e) => setTanggalMulai(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tanggal Selesai Cuti *</label>
                <input
                  type="date"
                  value={tanggalSelesai}
                  onChange={(e) => setTanggalSelesai(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  required
                />
              </div>
            </div>

            {/* Calculated summary badge */}
            <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 flex items-center justify-between">
              <span className="text-blue-900 font-medium">
                Estimasi Durasi Cuti: <strong className="text-blue-700">{calculatedDays} Hari Kalender</strong>
              </span>
              {jenisCuti === 'Cuti Tahunan' && (
                <span className="text-blue-800 font-semibold">
                  Sisa Kuota Setelah Ini: {Math.max(0, peg.sisaCutiTahunan - calculatedDays)} Hari
                </span>
              )}
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Alasan Permohonan Cuti *</label>
              <textarea
                rows={3}
                value={alasan}
                onChange={(e) => setAlasan(e.target.value)}
                placeholder="Jelaskan alasan permohonan secara lengkap..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Alamat Selama Menjalankan Cuti</label>
                <input
                  type="text"
                  value={alamatSelamaCuti}
                  onChange={(e) => setAlamatSelamaCuti(e.target.value)}
                  placeholder={peg.alamat}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">No. Telepon / WA Aktif Selama Cuti</label>
                <input
                  type="text"
                  value={teleponSelamaCuti}
                  onChange={(e) => setTeleponSelamaCuti(e.target.value)}
                  placeholder={peg.telepon}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Permohonan Cuti</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Leave Application History Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-800">Daftar Status Pengajuan Cuti Anda</h3>
          <p className="text-xs text-slate-400">Status verifikasi dan telaah berkas oleh HR / Badan Kepegawaian Daerah</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Jenis Cuti</th>
                <th className="px-4 py-3">Jumlah Hari</th>
                <th className="px-4 py-3">Tanggal Pelaksanaan</th>
                <th className="px-4 py-3">Alasan Permohonan</th>
                <th className="px-4 py-3">Status Persetujuan</th>
                <th className="px-4 py-3">Catatan Pejabat HR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {myLeaves.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                    <CalendarDays className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-600">Belum ada riwayat permohonan cuti</p>
                  </td>
                </tr>
              ) : (
                myLeaves.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-slate-900 block">{c.jenisCuti}</span>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-slate-800 font-mono">
                      {c.jumlahHari} Hari
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-600">
                      {c.tanggalMulai} s.d {c.tanggalSelesai}
                    </td>
                    <td className="px-4 py-3.5 max-w-xs text-slate-700 line-clamp-2">
                      {c.alasan}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        c.status === 'Disetujui'
                          ? 'bg-emerald-100 text-emerald-800'
                          : c.status === 'Ditolak'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 italic max-w-xs">
                      {c.catatanHr || '-'}
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
