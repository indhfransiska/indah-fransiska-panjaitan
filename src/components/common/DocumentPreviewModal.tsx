import React from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, Download, Printer, X, CheckCircle2, ShieldCheck, Calendar, Hash } from 'lucide-react';

export const DocumentPreviewModal: React.FC = () => {
  const { activePreviewDoc, setActivePreviewDoc, addToast } = useApp();

  if (!activePreviewDoc) return null;

  const handleDownload = () => {
    addToast(`Mengunduh dokumen: ${activePreviewDoc.namaDokumen}...`, 'info');
    setTimeout(() => {
      addToast('Dokumen berhasil diunduh ke perangkat Anda.', 'success');
    }, 1000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-800 line-clamp-1">{activePreviewDoc.namaDokumen}</h3>
              <p className="text-xs text-slate-500">Kategori: {activePreviewDoc.kategori} • Format: {activePreviewDoc.format}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors title='Cetak Dokumen'"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Unduh</span>
            </button>
            <button
              onClick={() => setActivePreviewDoc(null)}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Formal Document Mockup Viewer */}
        <div className="flex-1 overflow-y-auto py-5 px-2">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 md:p-8 font-serif text-slate-800 shadow-inner bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]">
            {/* Garuda / Emblem Header */}
            <div className="text-center border-b-2 border-double border-slate-800 pb-4 mb-6">
              <div className="w-12 h-12 mx-auto mb-2 text-amber-600 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-12 h-12 fill-current" aria-label="Lambang Negara">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </div>
              <h2 className="text-sm font-bold tracking-widest uppercase font-sans text-slate-900">
                PEMERINTAH REPUBLIK INDONESIA
              </h2>
              <h3 className="text-xs font-semibold font-sans uppercase tracking-wider text-slate-700">
                BADAN KEPEGAWAIAN DAERAH
              </h3>
              <p className="text-[10px] font-sans text-slate-500 mt-0.5">
                Jalan Ir. H. Juanda No. 100, Bandung • Telepon (022) 4203344 • www.bkd.go.id
              </p>
            </div>

            {/* Document Content */}
            <div className="text-center mb-6">
              <h1 className="text-sm font-bold uppercase underline tracking-wide">
                PETIKAN SURAT KEPUTUSAN
              </h1>
              <p className="text-xs mt-1 font-sans text-slate-600">
                Nomor: <span className="font-mono font-medium">{activePreviewDoc.nomorSurat || '821.2/KEP-091/BKD/2025'}</span>
              </p>
            </div>

            <div className="text-xs space-y-3 font-sans text-slate-700 leading-relaxed text-justify">
              <p>
                <strong>TENTANG:</strong> Pengesahan dan Penetapan Berkas Kepegawaian ASN atas nama pegawai bersangkutan dalam Sistem Informasi Manajemen Kepegawaian (SIMPEG).
              </p>
              <div className="bg-white/80 p-3.5 rounded-lg border border-slate-200/80 space-y-1.5 text-xs">
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500">Nama Dokumen</span>
                  <span className="col-span-2 font-medium text-slate-900">: {activePreviewDoc.namaDokumen}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500">Tanggal Terbit</span>
                  <span className="col-span-2 font-medium text-slate-900">: {activePreviewDoc.tanggalDokumen}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500">Status Keabsahan</span>
                  <span className="col-span-2 font-medium text-emerald-700 flex items-center gap-1">
                    : <CheckCircle2 className="w-3.5 h-3.5" /> Terverifikasi Sah oleh BKD & BKN
                  </span>
                </div>
              </div>
              <p>
                Dokumen ini sah dan memiliki kekuatan hukum administrasi negara sesuai dengan ketentuan perundang-undangan aparatur sipil negara yang berlaku.
              </p>
            </div>

            {/* Electronic Seal */}
            <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between font-sans">
              <div className="flex items-center gap-2 p-2 bg-emerald-50 rounded-lg border border-emerald-200">
                <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-emerald-800">DITANDATANGANI SECARA ELEKTRONIK</p>
                  <p className="text-[9px] text-emerald-600">Sertifikasi Elektronik BSrE - BSSN RI</p>
                </div>
              </div>
              <div className="text-right text-xs">
                <p className="text-[10px] text-slate-500">Ditetapkan di Bandung</p>
                <p className="font-bold text-slate-800 mt-1">Kepala Badan Kepegawaian Daerah</p>
                <div className="h-10 flex items-center justify-end">
                  <span className="font-mono text-[9px] text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
                    [TTE BKD JAWA BARAT]
                  </span>
                </div>
                <p className="text-[10px] font-mono text-slate-600">NIP. 197003121995031001</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 shrink-0">
          <span className="text-xs text-slate-500 flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5" /> ID Berkas: {activePreviewDoc.id}
          </span>
          <button
            onClick={() => setActivePreviewDoc(null)}
            className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
