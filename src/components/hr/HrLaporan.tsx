import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileSpreadsheet, 
  Printer, 
  Download, 
  Filter, 
  Calendar, 
  Building2, 
  Users, 
  CalendarCheck, 
  CalendarOff, 
  Award, 
  FileText,
  ShieldCheck
} from 'lucide-react';

export const HrLaporan: React.FC = () => {
  const { pegawaiList, absensiList, pengajuanCutiList, layananList, addToast } = useApp();
  const [laporanType, setLaporanType] = useState<'pegawai' | 'absensi' | 'cuti' | 'kenaikan_pangkat' | 'pensiun'>('pegawai');
  const [periodeBulan, setPeriodeBulan] = useState('09');
  const [periodeTahun, setPeriodeTahun] = useState('2026');

  const handleExportPDF = () => {
    window.print();
    addToast('Membuka dialog cetak PDF resmi laporan kepegawaian', 'info');
  };

  const handleExportExcel = () => {
    addToast('Menyiapkan file spreadsheet laporan kepegawaian (XLSX)...', 'info');
    setTimeout(() => {
      // Create csv simulation
      let csvContent = 'data:text/csv;charset=utf-8,';
      if (laporanType === 'pegawai') {
        csvContent += 'NIP,Nama,Unit Kerja,Jabatan,Golongan,Status\n';
        pegawaiList.forEach((p) => {
          csvContent += `="${p.nip}","${p.nama}","${p.unitKerja}","${p.jabatan}","${p.golongan}","${p.statusKepegawaian}"\n`;
        });
      } else if (laporanType === 'absensi') {
        csvContent += 'Tanggal,NIP,Nama,Unit,Jam Masuk,Jam Pulang,Status\n';
        absensiList.forEach((a) => {
          csvContent += `"${a.tanggal}","${a.nip}","${a.pegawaiNama}","${a.unitKerja}","${a.jamMasuk || '-'}","${a.jamPulang || '-'}","${a.status}"\n`;
        });
      } else if (laporanType === 'cuti') {
        csvContent += 'NIP,Nama,Jenis Cuti,Jumlah Hari,Tanggal Mulai,Tanggal Selesai,Status\n';
        pengajuanCutiList.forEach((c) => {
          csvContent += `="${c.pegawaiNip}","${c.pegawaiNama}","${c.jenisCuti}",${c.jumlahHari},"${c.tanggalMulai}","${c.tanggalSelesai}","${c.status}"\n`;
        });
      }

      const encoded = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encoded);
      link.setAttribute('download', `Laporan_${laporanType.toUpperCase()}_${periodeBulan}_${periodeTahun}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      addToast('Laporan berhasil diekspor ke format spreadsheet', 'success');
    }, 600);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Pusat Laporan & Rekapitulasi Eksekutif</h2>
          <p className="text-xs text-slate-500">
            Generate laporan resmi berkala untuk keperluan BKN, KemenPAN-RB, dan Inspektorat Daerah.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Excel</span>
          </button>
          <button
            onClick={handleExportPDF}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Export PDF</span>
          </button>
        </div>
      </div>

      {/* Filter Parameters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Jenis Laporan
          </label>
          <select
            value={laporanType}
            onChange={(e) => setLaporanType(e.target.value as any)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 font-semibold"
          >
            <option value="pegawai">1. Laporan Komposisi Data Pegawai ASN</option>
            <option value="absensi">2. Laporan Rekapitulasi Absensi & Kehadiran</option>
            <option value="cuti">3. Laporan Penggunaan Hak Cuti Pegawai</option>
            <option value="kenaikan_pangkat">4. Laporan Kenaikan Pangkat & KGB</option>
            <option value="pensiun">5. Laporan Proyeksi Pensiun BUP</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Bulan Periode
          </label>
          <select
            value={periodeBulan}
            onChange={(e) => setPeriodeBulan(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800"
          >
            <option value="01">Januari</option>
            <option value="02">Februari</option>
            <option value="03">Maret</option>
            <option value="04">April</option>
            <option value="05">Mei</option>
            <option value="06">Juni</option>
            <option value="07">Juli</option>
            <option value="08">Agustus</option>
            <option value="09">September</option>
            <option value="10">Oktober</option>
            <option value="11">November</option>
            <option value="12">Desember</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Tahun Anggaran
          </label>
          <select
            value={periodeTahun}
            onChange={(e) => setPeriodeTahun(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800"
          >
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>
        </div>
      </div>

      {/* Official Printable Report Preview Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6 sm:p-10 font-sans">
        {/* Kop Surat Resmi */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6 text-center relative">
          <div className="w-14 h-14 mx-auto mb-2 text-amber-600 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-12 h-12 fill-current">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-800">
            PEMERINTAH REPUBLIK INDONESIA
          </h3>
          <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-slate-900 mt-0.5">
            BADAN KEPEGAWAIAN DAERAH
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Jalan Ir. H. Juanda No. 100, Telepon (022) 4203344, Faksimile (022) 4203345
          </p>
          <p className="text-[10px] text-slate-400 font-mono">
            Laman: www.bkd.go.id • Pos-el: bkd@pemerintah.go.id
          </p>
        </div>

        {/* Title of Document */}
        <div className="text-center mb-6">
          <h1 className="text-sm sm:text-base font-bold uppercase underline">
            {laporanType === 'pegawai' && 'LAPORAN DAFTAR REKAPITULASI PEGAWAI NEGERI SIPIL & PPPK'}
            {laporanType === 'absensi' && 'LAPORAN REKAPITULASI KEHADIRAN DAN KEDISIPLINAN PEGAWAI'}
            {laporanType === 'cuti' && 'LAPORAN PELAKSANAAN DAN PENGGUNAAN HAK CUTI ASN'}
            {laporanType === 'kenaikan_pangkat' && 'LAPORAN USULAN DAN PENETAPAN KENAIKAN PANGKAT/KGB'}
            {laporanType === 'pensiun' && 'LAPORAN DAFTAR PEGAWAI MEMASUKI BATAS USIA PENSIUN (BUP)'}
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Periode: Bulan {periodeBulan} Tahun {periodeTahun}
          </p>
        </div>

        {/* Dynamic Table Content based on Laporan Type */}
        {laporanType === 'pegawai' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-300">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                <tr>
                  <th className="p-2 border-r border-slate-300 text-center w-10">No</th>
                  <th className="p-2 border-r border-slate-300">NIP</th>
                  <th className="p-2 border-r border-slate-300">Nama Pegawai & Gelar</th>
                  <th className="p-2 border-r border-slate-300">Pangkat/Gol</th>
                  <th className="p-2 border-r border-slate-300">Jabatan</th>
                  <th className="p-2 border-r border-slate-300">Unit Kerja</th>
                  <th className="p-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {pegawaiList.map((p, idx) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-2 text-center border-r border-slate-300">{idx + 1}</td>
                    <td className="p-2 font-mono border-r border-slate-300">{p.nip}</td>
                    <td className="p-2 font-semibold border-r border-slate-300">{p.nama}</td>
                    <td className="p-2 border-r border-slate-300">{p.golongan}</td>
                    <td className="p-2 border-r border-slate-300">{p.jabatan}</td>
                    <td className="p-2 border-r border-slate-300">{p.unitKerja}</td>
                    <td className="p-2 text-center font-bold">{p.statusKepegawaian}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {laporanType === 'absensi' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-300">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                <tr>
                  <th className="p-2 border-r border-slate-300 text-center w-10">No</th>
                  <th className="p-2 border-r border-slate-300">Tanggal</th>
                  <th className="p-2 border-r border-slate-300">NIP</th>
                  <th className="p-2 border-r border-slate-300">Nama Pegawai</th>
                  <th className="p-2 border-r border-slate-300">Unit Kerja</th>
                  <th className="p-2 border-r border-slate-300 text-center">Masuk</th>
                  <th className="p-2 border-r border-slate-300 text-center">Pulang</th>
                  <th className="p-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {absensiList.slice(0, 10).map((a, idx) => (
                  <tr key={a.id} className="hover:bg-slate-50">
                    <td className="p-2 text-center border-r border-slate-300">{idx + 1}</td>
                    <td className="p-2 font-mono border-r border-slate-300">{a.tanggal}</td>
                    <td className="p-2 font-mono border-r border-slate-300">{a.nip}</td>
                    <td className="p-2 font-semibold border-r border-slate-300">{a.pegawaiNama}</td>
                    <td className="p-2 border-r border-slate-300">{a.unitKerja}</td>
                    <td className="p-2 text-center font-mono border-r border-slate-300">{a.jamMasuk || '-'}</td>
                    <td className="p-2 text-center font-mono border-r border-slate-300">{a.jamPulang || '-'}</td>
                    <td className="p-2 text-center font-bold">{a.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {laporanType === 'cuti' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-300">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                <tr>
                  <th className="p-2 border-r border-slate-300 text-center w-10">No</th>
                  <th className="p-2 border-r border-slate-300">Nama & NIP</th>
                  <th className="p-2 border-r border-slate-300">Jenis Cuti</th>
                  <th className="p-2 border-r border-slate-300 text-center">Lama</th>
                  <th className="p-2 border-r border-slate-300">Rentang Waktu</th>
                  <th className="p-2 border-r border-slate-300">Alasan</th>
                  <th className="p-2 text-center">Status Keputusan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {pengajuanCutiList.map((c, idx) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="p-2 text-center border-r border-slate-300">{idx + 1}</td>
                    <td className="p-2 border-r border-slate-300">
                      <p className="font-semibold">{c.pegawaiNama}</p>
                      <p className="font-mono text-[10px] text-slate-500">NIP. {c.pegawaiNip}</p>
                    </td>
                    <td className="p-2 border-r border-slate-300">{c.jenisCuti}</td>
                    <td className="p-2 text-center border-r border-slate-300">{c.jumlahHari} Hari</td>
                    <td className="p-2 font-mono text-[11px] border-r border-slate-300">{c.tanggalMulai} s.d {c.tanggalSelesai}</td>
                    <td className="p-2 border-r border-slate-300">{c.alasan}</td>
                    <td className="p-2 text-center font-bold">{c.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {laporanType === 'kenaikan_pangkat' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-300">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                <tr>
                  <th className="p-2 border-r border-slate-300 text-center w-10">No</th>
                  <th className="p-2 border-r border-slate-300">Nama & NIP Pegawai</th>
                  <th className="p-2 border-r border-slate-300">Unit Kerja</th>
                  <th className="p-2 border-r border-slate-300">Layanan</th>
                  <th className="p-2 border-r border-slate-300">Rincian Usulan</th>
                  <th className="p-2 border-r border-slate-300 text-center">TMT</th>
                  <th className="p-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {layananList.map((lay, idx) => (
                  <tr key={lay.id} className="hover:bg-slate-50">
                    <td className="p-2 text-center border-r border-slate-300">{idx + 1}</td>
                    <td className="p-2 border-r border-slate-300">
                      <p className="font-semibold">{lay.pegawaiNama}</p>
                      <p className="font-mono text-[10px] text-slate-500">NIP. {lay.nip}</p>
                    </td>
                    <td className="p-2 border-r border-slate-300">{lay.unitKerja}</td>
                    <td className="p-2 border-r border-slate-300">{lay.jenisLayanan}</td>
                    <td className="p-2 border-r border-slate-300">{lay.detail}</td>
                    <td className="p-2 text-center font-mono border-r border-slate-300">{lay.tmtTarget}</td>
                    <td className="p-2 text-center font-bold">{lay.statusProses}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {laporanType === 'pensiun' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-300">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                <tr>
                  <th className="p-2 border-r border-slate-300 text-center w-10">No</th>
                  <th className="p-2 border-r border-slate-300">Nama & NIP</th>
                  <th className="p-2 border-r border-slate-300">Jabatan Terakhir</th>
                  <th className="p-2 border-r border-slate-300">Gol/Ruang</th>
                  <th className="p-2 border-r border-slate-300">Tanggal Lahir</th>
                  <th className="p-2 border-r border-slate-300">TMT Pensiun</th>
                  <th className="p-2 text-center">Status SK</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr className="hover:bg-slate-50">
                  <td className="p-2 text-center border-r border-slate-300">1</td>
                  <td className="p-2 border-r border-slate-300">
                    <p className="font-semibold">Ir. Bambang Soewardi, M.M.</p>
                    <p className="font-mono text-[10px] text-slate-500">NIP. 196608151991031002</p>
                  </td>
                  <td className="p-2 border-r border-slate-300">Teknik Jalan & Jembatan Ahli Utama</td>
                  <td className="p-2 border-r border-slate-300">IV/c</td>
                  <td className="p-2 border-r border-slate-300 font-mono">1966-08-15</td>
                  <td className="p-2 border-r border-slate-300 font-mono text-center">2026-09-01</td>
                  <td className="p-2 text-center font-bold text-emerald-700">SK Terbit (Selesai)</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Official Signatures Section */}
        <div className="mt-12 pt-6 flex justify-between items-end text-xs">
          <div className="space-y-1">
            <p className="text-slate-500 text-[10px]">Autentikasi Dokumen:</p>
            <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="font-bold text-[10px] text-slate-800">Sertifikat Digital BKD-SIMPEG</p>
                <p className="text-[9px] text-slate-400">Verifikasi QR Code Online</p>
              </div>
            </div>
          </div>

          <div className="text-right space-y-1">
            <p className="text-slate-600">Bandung, 22 September 2026</p>
            <p className="font-bold text-slate-900">KEPALA BADAN KEPEGAWAIAN DAERAH</p>
            <div className="h-16 flex items-center justify-end">
              <span className="font-mono text-[10px] text-slate-400">[Tanda Tangan Elektronik Sah]</span>
            </div>
            <p className="font-bold text-slate-900 underline">Dra. Hj. Ratna Sari, M.AP.</p>
            <p className="font-mono text-[10px] text-slate-600">NIP. 198503152010011002</p>
          </div>
        </div>
      </div>
    </div>
  );
};
