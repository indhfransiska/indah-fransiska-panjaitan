import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LayananKepegawaian } from '../../types';
import { 
  Award, 
  TrendingUp, 
  ArrowRightLeft, 
  Sparkles, 
  UserMinus, 
  GraduationCap, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Search, 
  FileText, 
  ShieldCheck, 
  AlertCircle,
  X,
  Building2,
  Calendar
} from 'lucide-react';

export const HrKepegawaian: React.FC = () => {
  const { layananList, updateLayananStatus, addLayanan, pegawaiList, addToast } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<LayananKepegawaian['jenisLayanan'] | 'SEMUA'>('SEMUA');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Status update modal state
  const [selectedLayanan, setSelectedLayanan] = useState<LayananKepegawaian | null>(null);
  const [newStatus, setNewStatus] = useState<LayananKepegawaian['statusProses']>('Disetujui');
  const [newSkNumber, setNewSkNumber] = useState('');

  // Add Layanan Form
  const [selectedPegawaiId, setSelectedPegawaiId] = useState(pegawaiList[0]?.id || '');
  const [jenisLayanan, setJenisLayanan] = useState<LayananKepegawaian['jenisLayanan']>('Kenaikan Pangkat');
  const [detailLayanan, setDetailLayanan] = useState('');
  const [tmtTarget, setTmtTarget] = useState('2026-10-01');

  const subTabs = [
    { id: 'SEMUA', label: 'Semua Layanan' },
    { id: 'Kenaikan Pangkat', label: 'Kenaikan Pangkat' },
    { id: 'Kenaikan Gaji Berkala', label: 'Gaji Berkala (KGB)' },
    { id: 'Mutasi', label: 'Mutasi' },
    { id: 'Promosi', label: 'Promosi' },
    { id: 'Pensiun', label: 'Pensiun' },
    { id: 'Pencantuman Gelar', label: 'Pencantuman Gelar' },
  ];

  const filteredLayanan = layananList.filter((item) => {
    const matchType = activeSubTab === 'SEMUA' || item.jenisLayanan === activeSubTab;
    const matchSearch =
      item.pegawaiNama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nip.includes(searchTerm) ||
      item.detail.toLowerCase().includes(searchTerm.toLowerCase());
    return matchType && matchSearch;
  });

  const handleUpdateStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLayanan) return;
    updateLayananStatus(selectedLayanan.id, newStatus, newSkNumber || selectedLayanan.nomorSk);
    setSelectedLayanan(null);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const peg = pegawaiList.find((p) => p.id === selectedPegawaiId);
    if (!peg) return;

    addLayanan({
      pegawaiId: peg.id,
      pegawaiNama: `${peg.gelarDepan ? peg.gelarDepan + ' ' : ''}${peg.nama}${peg.gelarBelakang ? ', ' + peg.gelarBelakang : ''}`,
      nip: peg.nip,
      unitKerja: peg.unitKerja,
      jenisLayanan,
      detail: detailLayanan || `Usulan ${jenisLayanan} atas nama ${peg.nama}`,
      tmtTarget,
      statusProses: 'Diusulkan'
    });

    setIsAddModalOpen(false);
    setDetailLayanan('');
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Manajemen Administrasi Kepegawaian</h2>
          <p className="text-xs text-slate-500">
            Monitoring usulan kenaikan pangkat, KGB, mutasi, promosi jabatan, pensiun, dan pencantuman gelar.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Ajukan Usulan Layanan</span>
        </button>
      </div>

      {/* Sub-tabs Navigation */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200/80 flex items-center gap-1 overflow-x-auto">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeSubTab === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari berdasarkan nama, NIP, atau perihal usulan..."
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
        <p className="text-xs text-slate-500 font-medium">
          Ditemukan <strong className="text-slate-800">{filteredLayanan.length}</strong> usulan
        </p>
      </div>

      {/* Table of Kepegawaian Services */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Pegawai</th>
                <th className="px-4 py-3.5">Jenis Layanan</th>
                <th className="px-4 py-3.5">Rincian Usulan</th>
                <th className="px-4 py-3.5">TMT Target</th>
                <th className="px-4 py-3.5">Status Proses</th>
                <th className="px-4 py-3.5 text-center">Tindakan HR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredLayanan.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                    <Award className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-600">Tidak ada berkas layanan kepegawaian</p>
                  </td>
                </tr>
              ) : (
                filteredLayanan.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5">
                      <p className="font-bold text-slate-900">{item.pegawaiNama}</p>
                      <p className="font-mono text-[11px] text-slate-400">NIP. {item.nip}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{item.unitKerja}</p>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                        {item.jenisLayanan}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 max-w-sm">
                      <p className="font-medium text-slate-800 leading-relaxed">{item.detail}</p>
                      {item.nomorSk && (
                        <p className="font-mono text-[10px] text-emerald-700 font-semibold mt-1">
                          SK: {item.nomorSk}
                        </p>
                      )}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="flex items-center gap-1 font-mono text-slate-700">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {item.tmtTarget}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        item.statusProses === 'Selesai'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.statusProses === 'Disetujui'
                          ? 'bg-blue-100 text-blue-800'
                          : item.statusProses === 'Verifikasi BKN/BKD'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          item.statusProses === 'Selesai'
                            ? 'bg-emerald-600'
                            : item.statusProses === 'Disetujui'
                            ? 'bg-blue-600'
                            : item.statusProses === 'Verifikasi BKN/BKD'
                            ? 'bg-amber-600'
                            : 'bg-slate-500'
                        }`} />
                        {item.statusProses}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => {
                          setSelectedLayanan(item);
                          setNewStatus(item.statusProses);
                          setNewSkNumber(item.nomorSk || '');
                        }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        Update Berkas
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: UPDATE STATUS BERKAS LAYANAN */}
      {selectedLayanan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">Perbarui Status Berkas Layanan</h3>
              <button onClick={() => setSelectedLayanan(null)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatusSubmit} className="py-4 space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <p className="font-bold text-slate-800">{selectedLayanan.pegawaiNama}</p>
                <p className="text-[11px] text-blue-600 font-semibold">{selectedLayanan.jenisLayanan}</p>
                <p className="text-[11px] text-slate-500">{selectedLayanan.detail}</p>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Status Verifikasi Terbaru</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="Diusulkan">Diusulkan (Tahap Verifikasi Awal)</option>
                  <option value="Verifikasi BKN/BKD">Verifikasi BKN / BKD Pusat</option>
                  <option value="Disetujui">Disetujui / Terbit Persetujuan Teknis</option>
                  <option value="Selesai">Selesai (SK Telah Ditetapkan & Berlaku)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Nomor SK / Pertek Resmi (Opsional)
                </label>
                <input
                  type="text"
                  value={newSkNumber}
                  onChange={(e) => setNewSkNumber(e.target.value)}
                  placeholder="Contoh: 823.3/KEP-204/BKD/2026"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedLayanan(null)}
                  className="px-4 py-2 bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl"
                >
                  Simpan Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: AJUKAN USULAN BARU */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">Ajukan Usulan Layanan Kepegawaian</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="py-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Pilih Pegawai *</label>
                <select
                  value={selectedPegawaiId}
                  onChange={(e) => setSelectedPegawaiId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  required
                >
                  {pegawaiList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nama} (NIP: {p.nip}) - {p.golongan}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Jenis Layanan</label>
                <select
                  value={jenisLayanan}
                  onChange={(e) => setJenisLayanan(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="Kenaikan Pangkat">Kenaikan Pangkat (Reguler / Pilihan)</option>
                  <option value="Kenaikan Gaji Berkala">Kenaikan Gaji Berkala (KGB 2 Tahunan)</option>
                  <option value="Mutasi">Mutasi / Alih Tugas Internal & Antar Lembaga</option>
                  <option value="Promosi">Promosi Jabatan / Jenjang Karier</option>
                  <option value="Pensiun">Pemberhentian & Pensiun BUP</option>
                  <option value="Pencantuman Gelar">Pencantuman Gelar Akademik Baru</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Keterangan & Rincian Usulan</label>
                <textarea
                  rows={3}
                  value={detailLayanan}
                  onChange={(e) => setDetailLayanan(e.target.value)}
                  placeholder="Deskripsikan usulan, pertek BKN, atau kelengkapan berkas..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Target TMT (Terhitung Mulai Tanggal)</label>
                <input
                  type="date"
                  value={tmtTarget}
                  onChange={(e) => setTmtTarget(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl"
                >
                  Kirim Usulan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
