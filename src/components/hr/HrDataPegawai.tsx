import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Pegawai, StatusKepegawaian, StatusKerja } from '../../types';
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  Download, 
  Printer, 
  Eye, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  MoreVertical, 
  ChevronDown, 
  Building2, 
  GraduationCap, 
  Briefcase, 
  FileText, 
  Upload, 
  X, 
  Save,
  Clock,
  Shield,
  FileSpreadsheet
} from 'lucide-react';

export const HrDataPegawai: React.FC = () => {
  const { 
    pegawaiList, 
    addPegawai, 
    updatePegawai, 
    deletePegawai, 
    toggleStatusPegawai, 
    addDokumenPegawai, 
    setActivePreviewDoc,
    addToast 
  } = useApp();

  // Search & Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedGolongan, setSelectedGolongan] = useState('ALL');

  // Modals State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDetailPegawai, setSelectedDetailPegawai] = useState<Pegawai | null>(null);
  const [detailActiveTab, setDetailActiveTab] = useState<'biodata' | 'jabatan' | 'pendidikan' | 'pangkat' | 'dokumen'>('biodata');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPegawai, setEditingPegawai] = useState<Pegawai | null>(null);

  // Upload Doc for selected employee modal
  const [isUploadDocModalOpen, setIsUploadDocModalOpen] = useState(false);
  const [newDocNama, setNewDocNama] = useState('');
  const [newDocKategori, setNewDocKategori] = useState<any>('SK');
  const [newDocNomor, setNewDocNomor] = useState('');

  // Form State for Add Pegawai
  const [formData, setFormData] = useState({
    nip: '',
    nama: '',
    gelarDepan: '',
    gelarBelakang: '',
    email: '',
    telepon: '',
    tempatLahir: '',
    tanggalLahir: '',
    jenisKelamin: 'Laki-laki' as 'Laki-laki' | 'Perempuan',
    agama: 'Islam' as Pegawai['agama'],
    alamat: '',
    unitKerja: 'Dinas Komunikasi dan Informatika',
    jabatan: 'Pranata Komputer Ahli Pertama',
    golongan: 'III/a - Penata Muda',
    statusKepegawaian: 'PNS' as StatusKepegawaian,
    statusKerja: 'Aktif' as StatusKerja,
    pendidikanTerakhir: 'S1 Teknik Informatika',
    tmtGolongan: '2024-04-01',
    tmtJabatan: '2024-04-01',
    masaKerjaTahun: 1,
    masaKerjaBulan: 0,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=256&auto=format&fit=crop'
  });

  // Unique lists for filters
  const unitList = useMemo(() => {
    return Array.from(new Set(pegawaiList.map((p) => p.unitKerja)));
  }, [pegawaiList]);

  const golonganList = useMemo(() => {
    return Array.from(new Set(pegawaiList.map((p) => p.golongan)));
  }, [pegawaiList]);

  // Filtered List
  const filteredPegawai = useMemo(() => {
    return pegawaiList.filter((p) => {
      const matchSearch =
        p.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.nip.includes(searchTerm) ||
        p.jabatan.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchUnit = selectedUnit === 'ALL' || p.unitKerja === selectedUnit;
      const matchStatus = selectedStatus === 'ALL' || p.statusKepegawaian === selectedStatus;
      const matchGolongan = selectedGolongan === 'ALL' || p.golongan === selectedGolongan;

      return matchSearch && matchUnit && matchStatus && matchGolongan;
    });
  }, [pegawaiList, searchTerm, selectedUnit, selectedStatus, selectedGolongan]);

  // Export to CSV simulation
  const handleExportCSV = () => {
    const headers = ['NIP', 'Nama', 'Gelar', 'Unit Kerja', 'Jabatan', 'Golongan', 'Status', 'Status Kerja', 'Email', 'Telepon'];
    const rows = filteredPegawai.map(p => [
      `="${p.nip}"`,
      `"${p.nama}"`,
      `"${p.gelarBelakang || ''}"`,
      `"${p.unitKerja}"`,
      `"${p.jabatan}"`,
      `"${p.golongan}"`,
      `"${p.statusKepegawaian}"`,
      `"${p.statusKerja}"`,
      `"${p.email}"`,
      `"${p.telepon}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Daftar_Pegawai_SIMPEG_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('Data pegawai berhasil diekspor ke format Excel/CSV', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nip || !formData.nama) {
      addToast('NIP dan Nama Pegawai wajib diisi', 'warning');
      return;
    }

    addPegawai({
      ...formData,
      sisaCutiTahunan: 12,
      totalHakCuti: 12,
      riwayatJabatan: [
        {
          id: `rj-${Date.now()}`,
          jabatan: formData.jabatan,
          unitKerja: formData.unitKerja,
          tmt: formData.tmtJabatan,
          nomorSk: '821.2/SK-PENG/2026',
          tanggalSk: formData.tmtJabatan
        }
      ],
      riwayatPendidikan: [
        {
          id: `rp-${Date.now()}`,
          jenjang: 'D4/S1',
          institusi: 'Perguruan Tinggi Terakreditasi',
          jurusan: formData.pendidikanTerakhir,
          tahunLulus: '2023',
          nomorIjazah: 'IJZ/REG/2023/001'
        }
      ],
      riwayatPangkat: [
        {
          id: `rpk-${Date.now()}`,
          golongan: formData.golongan.split(' ')[0],
          pangkat: formData.golongan.split('- ')[1] || 'Penata Muda',
          tmt: formData.tmtGolongan,
          nomorSk: '823/SK-GOL/2026',
          pejabatPenetap: 'Kepala BKD'
        }
      ],
      dokumen: []
    });

    setIsAddModalOpen(false);
    setFormData({
      nip: '',
      nama: '',
      gelarDepan: '',
      gelarBelakang: '',
      email: '',
      telepon: '',
      tempatLahir: '',
      tanggalLahir: '',
      jenisKelamin: 'Laki-laki',
      agama: 'Islam',
      alamat: '',
      unitKerja: 'Dinas Komunikasi dan Informatika',
      jabatan: 'Pranata Komputer Ahli Pertama',
      golongan: 'III/a - Penata Muda',
      statusKepegawaian: 'PNS',
      statusKerja: 'Aktif',
      pendidikanTerakhir: 'S1 Teknik Informatika',
      tmtGolongan: '2024-04-01',
      tmtJabatan: '2024-04-01',
      masaKerjaTahun: 1,
      masaKerjaBulan: 0,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=256&auto=format&fit=crop'
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPegawai) return;
    updatePegawai(editingPegawai.id, editingPegawai);
    setIsEditModalOpen(false);
  };

  const handleUploadDocSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDetailPegawai || !newDocNama) return;

    addDokumenPegawai(selectedDetailPegawai.id, {
      pegawaiId: selectedDetailPegawai.id,
      namaDokumen: newDocNama,
      kategori: newDocKategori,
      nomorSurat: newDocNomor || '800/DOC/2026',
      tanggalDokumen: new Date().toISOString().split('T')[0],
      ukuranFile: '1.2 MB',
      format: 'PDF',
      statusVerifikasi: 'Terverifikasi'
    });

    setIsUploadDocModalOpen(false);
    setNewDocNama('');
    setNewDocNomor('');

    // Update local selected view
    const updated = pegawaiList.find(p => p.id === selectedDetailPegawai.id);
    if (updated) setSelectedDetailPegawai(updated);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Master Data Pegawai ASN</h2>
          <p className="text-xs text-slate-500">
            Kelola profil, jabatan, golongan, dokumen resmi, dan riwayat seluruh pegawai instansi.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Export Excel/CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Export Excel</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Cetak Data"
          >
            <Printer className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Pegawai</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari Nama, NIP, atau Jabatan..."
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          {/* Unit Kerja Filter */}
          <div className="relative">
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 appearance-none bg-white pr-8 text-slate-700"
            >
              <option value="ALL">Semua Unit Kerja ({unitList.length})</option>
              {unitList.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          </div>

          {/* Status Kepegawaian */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 appearance-none bg-white pr-8 text-slate-700"
            >
              <option value="ALL">Semua Status (PNS, PPPK, dll)</option>
              <option value="PNS">PNS (Pegawai Negeri Sipil)</option>
              <option value="PPPK">PPPK</option>
              <option value="Honorer">Honorer / Kontrak</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          </div>

          {/* Golongan Filter */}
          <div className="relative">
            <select
              value={selectedGolongan}
              onChange={(e) => setSelectedGolongan(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 appearance-none bg-white pr-8 text-slate-700"
            >
              <option value="ALL">Semua Golongan/Ruang</option>
              {golonganList.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>

        {/* Filter Summary tags */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>Menampilkan <strong className="text-slate-800">{filteredPegawai.length}</strong> dari {pegawaiList.length} total pegawai</span>
          {(searchTerm || selectedUnit !== 'ALL' || selectedStatus !== 'ALL' || selectedGolongan !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedUnit('ALL');
                setSelectedStatus('ALL');
                setSelectedGolongan('ALL');
              }}
              className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Pegawai Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Pegawai</th>
                <th className="px-4 py-3.5">NIP & Golongan</th>
                <th className="px-4 py-3.5">Jabatan & Unit Kerja</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Keaktifan</th>
                <th className="px-4 py-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredPegawai.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                    <Users className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-600">Tidak ada data pegawai yang cocok</p>
                    <p className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau reset filter.</p>
                  </td>
                </tr>
              ) : (
                filteredPegawai.map((peg) => (
                  <tr key={peg.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Pegawai Avatar & Nama */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={peg.avatar}
                          alt={peg.nama}
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900">
                            {peg.gelarDepan ? peg.gelarDepan + ' ' : ''}
                            {peg.nama}
                            {peg.gelarBelakang ? ', ' + peg.gelarBelakang : ''}
                          </p>
                          <p className="text-[11px] text-slate-400">{peg.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* NIP & Golongan */}
                    <td className="px-4 py-3.5">
                      <p className="font-mono text-slate-800 font-medium">{peg.nip}</p>
                      <span className="inline-block mt-0.5 px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-semibold rounded">
                        {peg.golongan}
                      </span>
                    </td>

                    {/* Jabatan & Unit */}
                    <td className="px-4 py-3.5 max-w-xs">
                      <p className="font-semibold text-slate-800 line-clamp-1">{peg.jabatan}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-1 flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                        {peg.unitKerja}
                      </p>
                    </td>

                    {/* Status Kepegawaian */}
                    <td className="px-4 py-3.5">
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                        peg.statusKepegawaian === 'PNS'
                          ? 'bg-blue-100 text-blue-800'
                          : peg.statusKepegawaian === 'PPPK'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {peg.statusKepegawaian}
                      </span>
                    </td>

                    {/* Keaktifan Status */}
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => toggleStatusPegawai(peg.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold transition-colors cursor-pointer ${
                          peg.statusKerja === 'Aktif'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : peg.statusKerja === 'Cuti'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : peg.statusKerja === 'Pensiun'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                        }`}
                        title="Klik untuk ubah status keaktifan"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          peg.statusKerja === 'Aktif' ? 'bg-emerald-500' : 'bg-slate-400'
                        }`} />
                        <span>{peg.statusKerja}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedDetailPegawai(peg);
                            setDetailActiveTab('biodata');
                          }}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Lihat Detail Profil"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingPegawai({ ...peg });
                            setIsEditModalOpen(true);
                          }}
                          className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Data Pegawai"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Yakin ingin menghapus data ${peg.nama}?`)) {
                              deletePegawai(peg.id);
                            }
                          }}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Pegawai"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: DETAIL PEGAWAI (MULTI-TAB) */}
      {selectedDetailPegawai && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-slate-100 max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-4">
                <img
                  src={selectedDetailPegawai.avatar}
                  alt={selectedDetailPegawai.nama}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-200"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedDetailPegawai.gelarDepan ? selectedDetailPegawai.gelarDepan + ' ' : ''}
                    {selectedDetailPegawai.nama}
                    {selectedDetailPegawai.gelarBelakang ? ', ' + selectedDetailPegawai.gelarBelakang : ''}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-xs text-slate-500 font-semibold">
                      NIP. {selectedDetailPegawai.nip}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                      {selectedDetailPegawai.golongan}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedDetailPegawai(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 mt-3 shrink-0 overflow-x-auto text-xs font-semibold">
              <button
                onClick={() => setDetailActiveTab('biodata')}
                className={`py-2 px-3 border-b-2 transition-colors cursor-pointer ${
                  detailActiveTab === 'biodata'
                    ? 'border-blue-600 text-blue-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Biodata & Pekerjaan
              </button>
              <button
                onClick={() => setDetailActiveTab('jabatan')}
                className={`py-2 px-3 border-b-2 transition-colors cursor-pointer ${
                  detailActiveTab === 'jabatan'
                    ? 'border-blue-600 text-blue-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Riwayat Jabatan ({selectedDetailPegawai.riwayatJabatan?.length || 0})
              </button>
              <button
                onClick={() => setDetailActiveTab('pendidikan')}
                className={`py-2 px-3 border-b-2 transition-colors cursor-pointer ${
                  detailActiveTab === 'pendidikan'
                    ? 'border-blue-600 text-blue-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Pendidikan ({selectedDetailPegawai.riwayatPendidikan?.length || 0})
              </button>
              <button
                onClick={() => setDetailActiveTab('pangkat')}
                className={`py-2 px-3 border-b-2 transition-colors cursor-pointer ${
                  detailActiveTab === 'pangkat'
                    ? 'border-blue-600 text-blue-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Riwayat Pangkat ({selectedDetailPegawai.riwayatPangkat?.length || 0})
              </button>
              <button
                onClick={() => setDetailActiveTab('dokumen')}
                className={`py-2 px-3 border-b-2 transition-colors cursor-pointer ${
                  detailActiveTab === 'dokumen'
                    ? 'border-blue-600 text-blue-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Dokumen Digital ({selectedDetailPegawai.dokumen?.length || 0})
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto py-4 text-xs">
              {detailActiveTab === 'biodata' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Jabatan Saat Ini</span>
                      <p className="font-semibold text-slate-800 mt-0.5">{selectedDetailPegawai.jabatan}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Unit Kerja</span>
                      <p className="font-semibold text-slate-800 mt-0.5">{selectedDetailPegawai.unitKerja}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Status Kepegawaian</span>
                      <p className="font-semibold text-slate-800 mt-0.5">{selectedDetailPegawai.statusKepegawaian} ({selectedDetailPegawai.statusKerja})</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Masa Kerja</span>
                      <p className="font-semibold text-slate-800 mt-0.5">{selectedDetailPegawai.masaKerjaTahun} Tahun {selectedDetailPegawai.masaKerjaBulan} Bulan</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Sisa Hak Cuti</span>
                      <p className="font-semibold text-emerald-700 mt-0.5">{selectedDetailPegawai.sisaCutiTahunan} dari {selectedDetailPegawai.totalHakCuti} Hari</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Pendidikan Terakhir</span>
                      <p className="font-semibold text-slate-800 mt-0.5">{selectedDetailPegawai.pendidikanTerakhir}</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200/80 space-y-2">
                    <h4 className="font-bold text-slate-800 text-xs">Informasi Pribadi & Kontak</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><span className="text-slate-400">Tempat, Tanggal Lahir:</span> <p className="font-medium text-slate-800">{selectedDetailPegawai.tempatLahir}, {selectedDetailPegawai.tanggalLahir}</p></div>
                      <div><span className="text-slate-400">Jenis Kelamin / Agama:</span> <p className="font-medium text-slate-800">{selectedDetailPegawai.jenisKelamin} / {selectedDetailPegawai.agama}</p></div>
                      <div><span className="text-slate-400">Email:</span> <p className="font-medium text-slate-800">{selectedDetailPegawai.email}</p></div>
                      <div><span className="text-slate-400">No. Telepon / WA:</span> <p className="font-medium text-slate-800">{selectedDetailPegawai.telepon}</p></div>
                      <div className="col-span-2"><span className="text-slate-400">Alamat Tempat Tinggal:</span> <p className="font-medium text-slate-800">{selectedDetailPegawai.alamat}</p></div>
                    </div>
                  </div>
                </div>
              )}

              {detailActiveTab === 'jabatan' && (
                <div className="space-y-3">
                  {selectedDetailPegawai.riwayatJabatan?.length === 0 ? (
                    <p className="text-slate-400 text-center py-6">Belum ada riwayat jabatan tersimpan.</p>
                  ) : (
                    selectedDetailPegawai.riwayatJabatan?.map((rj) => (
                      <div key={rj.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-slate-900">{rj.jabatan}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">{rj.unitKerja}</p>
                          </div>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                            TMT: {rj.tmt}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-2 font-mono">No. SK: {rj.nomorSk}</p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {detailActiveTab === 'pendidikan' && (
                <div className="space-y-3">
                  {selectedDetailPegawai.riwayatPendidikan?.length === 0 ? (
                    <p className="text-slate-400 text-center py-6">Belum ada riwayat pendidikan tersimpan.</p>
                  ) : (
                    selectedDetailPegawai.riwayatPendidikan?.map((rp) => (
                      <div key={rp.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-slate-900">{rp.jenjang} - {rp.jurusan}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">{rp.institusi} (Lulus {rp.tahunLulus})</p>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-2 font-mono">No. Ijazah: {rp.nomorIjazah}</p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {detailActiveTab === 'pangkat' && (
                <div className="space-y-3">
                  {selectedDetailPegawai.riwayatPangkat?.length === 0 ? (
                    <p className="text-slate-400 text-center py-6">Belum ada riwayat kenaikan pangkat tersimpan.</p>
                  ) : (
                    selectedDetailPegawai.riwayatPangkat?.map((rpk) => (
                      <div key={rpk.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-slate-900">Golongan {rpk.golongan} ({rpk.pangkat})</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">Penetap: {rpk.pejabatPenetap}</p>
                          </div>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
                            TMT: {rpk.tmt}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-2 font-mono">No. SK: {rpk.nomorSk}</p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {detailActiveTab === 'dokumen' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2">
                    <p className="text-xs font-bold text-slate-700">Berkas & Arsip Digital</p>
                    <button
                      onClick={() => setIsUploadDocModalOpen(true)}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Dokumen Baru</span>
                    </button>
                  </div>

                  {selectedDetailPegawai.dokumen?.length === 0 ? (
                    <p className="text-slate-400 text-center py-6">Belum ada dokumen digital yang diunggah.</p>
                  ) : (
                    selectedDetailPegawai.dokumen?.map((dok) => (
                      <div key={dok.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="w-6 h-6 text-blue-600 shrink-0" />
                          <div>
                            <p className="font-bold text-slate-800">{dok.namaDokumen}</p>
                            <p className="text-[10px] text-slate-400 font-mono">
                              {dok.kategori} • {dok.ukuranFile} • {dok.tanggalDokumen}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setActivePreviewDoc(dok)}
                          className="px-3 py-1 bg-white hover:bg-blue-50 text-blue-600 border border-slate-200 text-xs font-semibold rounded-lg shadow-xs"
                        >
                          Preview & Unduh
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-100 flex justify-end shrink-0">
              <button
                onClick={() => setSelectedDetailPegawai(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH PEGAWAI */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-800">Formulir Tambah Pegawai ASN</h3>
                <p className="text-xs text-slate-500">Daftarkan pegawai baru ke dalam sistem kepegawaian</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="py-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">NIP (18 Digit) *</label>
                  <input
                    type="text"
                    value={formData.nip}
                    onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                    placeholder="199512302022031001"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nama Lengkap *</label>
                  <input
                    type="text"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    placeholder="Nama tanpa gelar"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Gelar Depan (opsional)</label>
                  <input
                    type="text"
                    value={formData.gelarDepan}
                    onChange={(e) => setFormData({ ...formData, gelarDepan: e.target.value })}
                    placeholder="Contoh: Dr., Ir., dr."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Gelar Belakang</label>
                  <input
                    type="text"
                    value={formData.gelarBelakang}
                    onChange={(e) => setFormData({ ...formData, gelarBelakang: e.target.value })}
                    placeholder="Contoh: S.Kom., M.T.I."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Email Dinas</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="pegawai@instansi.go.id"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">No. WhatsApp / HP</label>
                  <input
                    type="text"
                    value={formData.telepon}
                    onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                    placeholder="08123456789"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Unit Kerja</label>
                  <select
                    value={formData.unitKerja}
                    onChange={(e) => setFormData({ ...formData, unitKerja: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Dinas Komunikasi dan Informatika">Dinas Komunikasi dan Informatika</option>
                    <option value="Badan Kepegawaian Daerah">Badan Kepegawaian Daerah</option>
                    <option value="Sekretariat Daerah">Sekretariat Daerah</option>
                    <option value="Dinas Kesehatan & RSUD">Dinas Kesehatan & RSUD</option>
                    <option value="Inspektorat Daerah">Inspektorat Daerah</option>
                    <option value="Badan Pengelola Keuangan dan Aset Daerah">Badan Pengelola Keuangan dan Aset Daerah</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Jabatan</label>
                  <input
                    type="text"
                    value={formData.jabatan}
                    onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Pangkat / Golongan</label>
                  <select
                    value={formData.golongan}
                    onChange={(e) => setFormData({ ...formData, golongan: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="IV/b - Pembina Tingkat I">IV/b - Pembina Tingkat I</option>
                    <option value="IV/a - Pembina">IV/a - Pembina</option>
                    <option value="III/d - Penata Tingkat I">III/d - Penata Tingkat I</option>
                    <option value="III/c - Penata">III/c - Penata</option>
                    <option value="III/b - Penata Muda Tingkat I">III/b - Penata Muda Tingkat I</option>
                    <option value="III/a - Penata Muda">III/a - Penata Muda</option>
                    <option value="Golongan IX - PPPK">Golongan IX - PPPK</option>
                    <option value="II/c - Pengatur">II/c - Pengatur</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Status Kepegawaian</label>
                  <select
                    value={formData.statusKepegawaian}
                    onChange={(e) => setFormData({ ...formData, statusKepegawaian: e.target.value as StatusKepegawaian })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="PNS">PNS (Pegawai Negeri Sipil)</option>
                    <option value="PPPK">PPPK (Perjanjian Kerja)</option>
                    <option value="Honorer">Honorer / Kontrak</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tempat Lahir</label>
                  <input
                    type="text"
                    value={formData.tempatLahir}
                    onChange={(e) => setFormData({ ...formData, tempatLahir: e.target.value })}
                    placeholder="Bandung"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    value={formData.tanggalLahir}
                    onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">Alamat Domisili</label>
                  <input
                    type="text"
                    value={formData.alamat}
                    onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                    placeholder="Jl. Merdeka No. 10, Kota Bandung"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Pegawai</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT PEGAWAI */}
      {isEditModalOpen && editingPegawai && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">Edit Data Pegawai: {editingPegawai.nama}</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="py-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={editingPegawai.nama}
                  onChange={(e) => setEditingPegawai({ ...editingPegawai, nama: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Jabatan</label>
                  <input
                    type="text"
                    value={editingPegawai.jabatan}
                    onChange={(e) => setEditingPegawai({ ...editingPegawai, jabatan: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Pangkat / Golongan</label>
                  <input
                    type="text"
                    value={editingPegawai.golongan}
                    onChange={(e) => setEditingPegawai({ ...editingPegawai, golongan: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Email</label>
                  <input
                    type="email"
                    value={editingPegawai.email}
                    onChange={(e) => setEditingPegawai({ ...editingPegawai, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Telepon</label>
                  <input
                    type="text"
                    value={editingPegawai.telepon}
                    onChange={(e) => setEditingPegawai({ ...editingPegawai, telepon: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Alamat</label>
                <input
                  type="text"
                  value={editingPegawai.alamat}
                  onChange={(e) => setEditingPegawai({ ...editingPegawai, alamat: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: UPLOAD DOKUMEN PEGAWAI */}
      {isUploadDocModalOpen && selectedDetailPegawai && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">Upload Dokumen Digital</h3>
              <button onClick={() => setIsUploadDocModalOpen(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadDocSubmit} className="py-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nama Dokumen *</label>
                <input
                  type="text"
                  value={newDocNama}
                  onChange={(e) => setNewDocNama(e.target.value)}
                  placeholder="Contoh: SK Kenaikan Pangkat IV/a"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Kategori Dokumen</label>
                <select
                  value={newDocKategori}
                  onChange={(e) => setNewDocKategori(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="SK">Surat Keputusan (SK)</option>
                  <option value="Surat Tugas">Surat Tugas / SPT</option>
                  <option value="Sertifikat">Sertifikat Diklat / Ujikom</option>
                  <option value="Pendidikan">Ijazah / Transkrip</option>
                  <option value="Kenaikan Pangkat">Dokumen Kenaikan Pangkat</option>
                  <option value="Pensiun">Dokumen Pensiun</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nomor Surat / SK</label>
                <input
                  type="text"
                  value={newDocNomor}
                  onChange={(e) => setNewDocNomor(e.target.value)}
                  placeholder="821.2/SK-001/BKD/2026"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                />
              </div>

              <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl text-center bg-slate-50">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <p className="font-semibold text-slate-700">Pilih berkas PDF atau JPG</p>
                <p className="text-[10px] text-slate-400">Maksimal 10 MB per dokumen</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadDocModalOpen(false)}
                  className="px-3 py-2 bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl"
                >
                  Unggah Dokumen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
