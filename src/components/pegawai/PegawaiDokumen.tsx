import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DokumenKepegawaian } from '../../types';
import { 
  FolderArchive, 
  FileText, 
  Download, 
  Eye, 
  Upload, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Plus,
  X
} from 'lucide-react';

export const PegawaiDokumen: React.FC = () => {
  const { currentUser, pegawaiList, addDokumenPegawai, setActivePreviewDoc, addToast } = useApp();
  const peg = pegawaiList.find((p) => p.id === currentUser?.pegawaiId) || pegawaiList[0];

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [namaDokumen, setNamaDokumen] = useState('');
  const [kategori, setKategori] = useState<DokumenKepegawaian['kategori']>('SK');
  const [nomorSurat, setNomorSurat] = useState('');

  const documents = peg.dokumen || [];

  // Required Checklist Items for Civil Servant portfolio
  const requiredCategories = [
    { title: 'SK Pengangkatan CPNS / PNS', kategori: 'SK', mandatory: true },
    { title: 'SK Pangkat / Golongan Terakhir', kategori: 'Kenaikan Pangkat', mandatory: true },
    { title: 'SK Jabatan Terakhir', kategori: 'SK', mandatory: true },
    { title: 'Ijazah Pendidikan Terakhir', kategori: 'Pendidikan', mandatory: true },
    { title: 'Sertifikat Diklat / Pelatihan Teknis', kategori: 'Sertifikat', mandatory: false },
  ];

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaDokumen) return;

    addDokumenPegawai(peg.id, {
      pegawaiId: peg.id,
      namaDokumen,
      kategori,
      nomorSurat: nomorSurat || '821/MANDIRI/2026',
      tanggalDokumen: new Date().toISOString().split('T')[0],
      ukuranFile: '1.2 MB',
      format: 'PDF',
      statusVerifikasi: 'Menunggu'
    });

    setIsUploadModalOpen(false);
    setNamaDokumen('');
    setNomorSurat('');
    addToast('Dokumen berhasil diunggah dan menunggu verifikasi admin BKD', 'success');
  };

  const handleDownload = (doc: DokumenKepegawaian) => {
    addToast(`Mengunduh dokumen ${doc.namaDokumen}...`, 'info');
    setTimeout(() => {
      addToast('Unduhan berkas selesai.', 'success');
    }, 800);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Berkas & Arsip Digital Kepegawaian Saya</h2>
          <p className="text-xs text-slate-500">
            Akses SK penetapan, sertifikat keahlian, ijazah terakreditasi, dan surat tugas resmi Anda.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>Unggah Berkas Mandiri</span>
        </button>
      </div>

      {/* Checklist Kelengkapan Berkas */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <h3 className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-100 flex items-center justify-between">
          <span>Status Kelengkapan Berkas Portofolio ASN</span>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Terverifikasi 80% Lengkap
          </span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
          {requiredCategories.map((item, idx) => {
            const hasDoc = documents.some((d) => d.kategori === item.kategori);
            return (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border flex items-center justify-between gap-2 ${
                  hasDoc ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <p className="text-xs font-bold text-slate-800">{item.title}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {item.mandatory ? 'Wajib untuk usulan kepangkatan' : 'Dokumen pendukung'}
                  </p>
                </div>
                {hasDoc ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded shrink-0">
                    Belum Ada
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid of Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl p-12 text-center border border-slate-200/80">
            <FolderArchive className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="font-semibold text-slate-600 text-xs">Belum ada arsip dokumen yang diunggah</p>
          </div>
        ) : (
          documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    doc.statusVerifikasi === 'Terverifikasi'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {doc.statusVerifikasi}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-xs line-clamp-2 leading-relaxed">
                  {doc.namaDokumen}
                </h4>

                <p className="font-mono text-[10px] text-slate-400 mt-1 truncate">
                  No: {doc.nomorSurat || '-'}
                </p>

                <div className="mt-3 text-[11px] text-slate-500 font-medium">
                  Kategori: <strong className="text-slate-800">{doc.kategori}</strong>
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
                    title="Pratinjau Berkas"
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

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">Unggah Berkas Mandiri</h3>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="py-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nama Dokumen *</label>
                <input
                  type="text"
                  value={namaDokumen}
                  onChange={(e) => setNamaDokumen(e.target.value)}
                  placeholder="Contoh: Sertifikat Pelatihan Analisis Kebijakan"
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
                  <option value="Sertifikat">Sertifikat Diklat / Pelatihan</option>
                  <option value="Pendidikan">Ijazah / Transkrip Nilai</option>
                  <option value="Surat Tugas">Surat Perintah Tugas (SPT)</option>
                  <option value="Kenaikan Pangkat">Berkas Kenaikan Pangkat</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nomor Dokumen / Sertifikat</label>
                <input
                  type="text"
                  value={nomorSurat}
                  onChange={(e) => setNomorSurat(e.target.value)}
                  placeholder="893/SERTIF/LAN/2026"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                />
              </div>

              <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl text-center bg-slate-50">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <p className="font-semibold text-slate-700">Pilih berkas PDF atau JPG</p>
                <p className="text-[10px] text-slate-400">Ukuran maksimal 10 MB</p>
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
                  Unggah Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
