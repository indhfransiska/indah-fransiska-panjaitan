import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DokumenKepegawaian } from '../../types';
import { 
  FolderArchive, 
  Search, 
  Filter, 
  Upload, 
  FileText, 
  Download, 
  Eye, 
  Trash2, 
  CheckCircle2, 
  ShieldCheck, 
  X,
  Building2,
  Calendar,
  Layers
} from 'lucide-react';

export const HrDokumen: React.FC = () => {
  const { pegawaiList, addDokumenPegawai, setActivePreviewDoc, addToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Form
  const [selectedPegawaiId, setSelectedPegawaiId] = useState(pegawaiList[0]?.id || '');
  const [namaDokumen, setNamaDokumen] = useState('');
  const [kategori, setKategori] = useState<DokumenKepegawaian['kategori']>('SK');
  const [nomorSurat, setNomorSurat] = useState('');

  // Collect all documents across all employees
  const allDocuments = pegawaiList.flatMap((p) =>
    (p.dokumen || []).map((d) => ({
      ...d,
      pegawaiNama: p.nama,
      pegawaiNip: p.nip,
      pegawaiUnit: p.unitKerja
    }))
  );

  const categories = [
    { id: 'ALL', label: 'Semua Dokumen' },
    { id: 'SK', label: 'Surat Keputusan (SK)' },
    { id: 'Surat Tugas', label: 'Surat Tugas / SPT' },
    { id: 'Sertifikat', label: 'Sertifikat & Diklat' },
    { id: 'Pendidikan', label: 'Ijazah & Pendidikan' },
    { id: 'Kenaikan Pangkat', label: 'Kenaikan Pangkat' },
    { id: 'Pensiun', label: 'Dokumen Pensiun' },
  ];

  const filteredDocs = allDocuments.filter((doc) => {
    const matchCategory = selectedCategory === 'ALL' || doc.kategori === selectedCategory;
    const matchSearch =
      doc.namaDokumen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.pegawaiNama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.pegawaiNip.includes(searchTerm) ||
      (doc.nomorSurat && doc.nomorSurat.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchCategory && matchSearch;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaDokumen || !selectedPegawaiId) return;

    addDokumenPegawai(selectedPegawaiId, {
      pegawaiId: selectedPegawaiId,
      namaDokumen,
      kategori,
      nomorSurat: nomorSurat || '821/SK/BKD/2026',
      tanggalDokumen: new Date().toISOString().split('T')[0],
      ukuranFile: '1.5 MB',
      format: 'PDF',
      statusVerifikasi: 'Terverifikasi'
    });

    setIsUploadModalOpen(false);
    setNamaDokumen('');
    setNomorSurat('');
  };

  const handleDownload = (doc: DokumenKepegawaian) => {
    addToast(`Mengunduh berkas ${doc.namaDokumen}...`, 'info');
    setTimeout(() => {
      addToast('Berkas berhasil diunduh.', 'success');
    }, 800);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Arsip Digital Dokumen Kepegawaian</h2>
          <p className="text-xs text-slate-500">
            Pusat penyimpanan digital SK, surat tugas, ijazah, dan sertifikat berintegritas tanda tangan elektronik.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>Unggah Dokumen Baru</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200/80 flex items-center gap-1 overflow-x-auto">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === c.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama dokumen, pegawai, atau nomor SK..."
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
        <p className="text-xs text-slate-500 font-medium">
          Ditemukan <strong className="text-slate-800">{filteredDocs.length}</strong> dokumen
        </p>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-slate-200/80">
            <FolderArchive className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="font-semibold text-slate-600 text-xs">Tidak ada dokumen yang ditemukan</p>
            <p className="text-[11px] text-slate-400 mt-1">Gunakan tombol "Unggah Dokumen Baru" untuk menambahkan arsip.</p>
          </div>
        ) : (
          filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                    {doc.kategori}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-xs line-clamp-2 leading-relaxed">
                  {doc.namaDokumen}
                </h4>

                <p className="font-mono text-[10px] text-slate-400 mt-1 truncate">
                  No: {doc.nomorSurat || '-'}
                </p>

                <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] space-y-1">
                  <p className="font-semibold text-slate-800 truncate">{doc.pegawaiNama}</p>
                  <p className="font-mono text-[10px] text-slate-400">NIP. {doc.pegawaiNip}</p>
                  <p className="text-[10px] text-slate-500 truncate">{doc.pegawaiUnit}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-400 font-mono">
                  {doc.format} • {doc.ukuranFile}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setActivePreviewDoc(doc)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    title="Pratinjau Dokumen"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDownload(doc)}
                    className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title="Unduh Berkas"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* UPLOAD MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">Unggah Dokumen Resmi Pegawai</h3>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="py-4 space-y-3 text-xs">
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
                      {p.nama} (NIP: {p.nip})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nama Dokumen *</label>
                <input
                  type="text"
                  value={namaDokumen}
                  onChange={(e) => setNamaDokumen(e.target.value)}
                  placeholder="Contoh: SK Kenaikan Pangkat Golongan IV/a"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Kategori Dokumen</label>
                <select
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="SK">Surat Keputusan (SK)</option>
                  <option value="Surat Tugas">Surat Tugas / Perjalanan Dinas</option>
                  <option value="Sertifikat">Sertifikat Diklat / Ujikom</option>
                  <option value="Pendidikan">Ijazah / Dokumen Pendidikan</option>
                  <option value="Kenaikan Pangkat">Kenaikan Pangkat</option>
                  <option value="Pensiun">Dokumen Pensiun</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nomor Surat / SK Resmi</label>
                <input
                  type="text"
                  value={nomorSurat}
                  onChange={(e) => setNomorSurat(e.target.value)}
                  placeholder="821.2/KEP-2026/BKD"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                />
              </div>

              <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl text-center bg-slate-50">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <p className="font-semibold text-slate-700">Pilih berkas PDF atau JPG</p>
                <p className="text-[10px] text-slate-400">Ukuran maksimal 15 MB</p>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl"
                >
                  Simpan Dokumen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
