import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  Award, 
  GraduationCap, 
  Briefcase, 
  Shield, 
  Edit3, 
  Check, 
  Calendar,
  Layers,
  Save,
  FileText
} from 'lucide-react';

export const PegawaiProfil: React.FC = () => {
  const { currentUser, pegawaiList, updatePegawai, addToast } = useApp();
  const peg = pegawaiList.find((p) => p.id === currentUser?.pegawaiId) || pegawaiList[0];

  const [activeTab, setActiveTab] = useState<'biodata' | 'pekerjaan' | 'pendidikan' | 'pangkat' | 'kontak'>('biodata');

  // Edit contact state
  const [isEditingKontak, setIsEditingKontak] = useState(false);
  const [telepon, setTelepon] = useState(peg.telepon);
  const [email, setEmail] = useState(peg.email);
  const [alamat, setAlamat] = useState(peg.alamat);

  const handleSaveKontak = (e: React.FormEvent) => {
    e.preventDefault();
    updatePegawai(peg.id, {
      telepon,
      email,
      alamat
    });
    setIsEditingKontak(false);
    addToast('Data kontak berhasil diperbarui', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-center gap-5">
          <img
            src={peg.avatar}
            alt={peg.nama}
            className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover ring-2 ring-blue-600/20 shadow-md"
          />
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-1">
              <Shield className="w-3 h-3" />
              <span>{peg.statusKepegawaian} • {peg.statusKerja}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {peg.gelarDepan ? peg.gelarDepan + ' ' : ''}
              {peg.nama}
              {peg.gelarBelakang ? ', ' + peg.gelarBelakang : ''}
            </h2>
            <p className="font-mono text-xs text-slate-500 font-semibold mt-0.5">NIP. {peg.nip}</p>
            <p className="text-xs text-slate-600 mt-1 font-medium">{peg.jabatan} — {peg.unitKerja}</p>
          </div>
        </div>

        <button
          onClick={() => {
            setActiveTab('kontak');
            setIsEditingKontak(true);
          }}
          className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Edit3 className="w-4 h-4" />
          <span>Perbarui Kontak</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200/80 flex items-center gap-1 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('biodata')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'biodata' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Biodata Pribadi
        </button>
        <button
          onClick={() => setActiveTab('pekerjaan')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'pekerjaan' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Data Jabatan & Riwayat
        </button>
        <button
          onClick={() => setActiveTab('pendidikan')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'pendidikan' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Pendidikan ({peg.riwayatPendidikan?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('pangkat')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'pangkat' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Kepangkatan & Golongan
        </button>
        <button
          onClick={() => setActiveTab('kontak')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'kontak' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Kontak & Domisili
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        {/* Tab 1: Biodata */}
        {activeTab === 'biodata' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-100">
              Informasi Induk Kependudukan & Pribadi
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase">NIP (Nomor Induk Pegawai)</span>
                <p className="font-mono font-bold text-slate-800 text-sm mt-0.5">{peg.nip}</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Nama Lengkap</span>
                <p className="font-bold text-slate-800 text-sm mt-0.5">{peg.nama}</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Gelar Akademik</span>
                <p className="font-bold text-slate-800 text-sm mt-0.5">{peg.gelarDepan || '-'} / {peg.gelarBelakang || '-'}</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Tempat, Tanggal Lahir</span>
                <p className="font-medium text-slate-800 text-sm mt-0.5">{peg.tempatLahir}, {peg.tanggalLahir}</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Jenis Kelamin</span>
                <p className="font-medium text-slate-800 text-sm mt-0.5">{peg.jenisKelamin}</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Agama</span>
                <p className="font-medium text-slate-800 text-sm mt-0.5">{peg.agama}</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Status Kepegawaian</span>
                <p className="font-bold text-blue-600 text-sm mt-0.5">{peg.statusKepegawaian}</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Status Kedudukan</span>
                <p className="font-bold text-emerald-600 text-sm mt-0.5">{peg.statusKerja}</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Masa Kerja Keseluruhan</span>
                <p className="font-medium text-slate-800 text-sm mt-0.5">{peg.masaKerjaTahun} Tahun {peg.masaKerjaBulan} Bulan</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Pekerjaan & Jabatan */}
        {activeTab === 'pekerjaan' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-100">
                Posisi Jabatan Aktif Saat Ini
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs mt-3">
                <div className="p-3.5 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Jabatan Utama</span>
                  <p className="font-bold text-slate-800 mt-0.5">{peg.jabatan}</p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Unit Kerja / Dinas</span>
                  <p className="font-bold text-slate-800 mt-0.5">{peg.unitKerja}</p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">TMT Jabatan</span>
                  <p className="font-mono font-bold text-slate-800 mt-0.5">{peg.tmtJabatan}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                Kronologi / Riwayat Mutasi & Jabatan
              </h4>
              <div className="space-y-3">
                {peg.riwayatJabatan?.map((rj) => (
                  <div key={rj.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{rj.jabatan}</p>
                      <p className="text-[11px] text-slate-600 mt-0.5">{rj.unitKerja}</p>
                      <p className="font-mono text-[10px] text-slate-400 mt-2">Nomor SK: {rj.nomorSk}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 text-[10px] font-bold font-mono">
                      TMT: {rj.tmt}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Pendidikan */}
        {activeTab === 'pendidikan' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-100">
              Riwayat Pendidikan Formal & Ijazah
            </h3>

            <div className="space-y-3">
              {peg.riwayatPendidikan?.map((rp) => (
                <div key={rp.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold text-[10px] rounded">
                        {rp.jenjang}
                      </span>
                      <p className="text-xs font-bold text-slate-900">{rp.jurusan}</p>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{rp.institusi}</p>
                    <p className="font-mono text-[10px] text-slate-400 mt-2">No. Ijazah: {rp.nomorIjazah}</p>
                  </div>
                  <span className="text-xs font-bold text-slate-600">Lulus: {rp.tahunLulus}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Kepangkatan */}
        {activeTab === 'pangkat' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-100">
              Riwayat Kepangkatan & Golongan Ruang
            </h3>

            <div className="space-y-3">
              {peg.riwayatPangkat?.map((rpk) => (
                <div key={rpk.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded font-mono">
                        Golongan {rpk.golongan}
                      </span>
                      <p className="text-xs font-bold text-slate-900">{rpk.pangkat}</p>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Pejabat Penetap: {rpk.pejabatPenetap}</p>
                    <p className="font-mono text-[10px] text-slate-400 mt-2">No. SK: {rpk.nomorSk}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-bold font-mono">
                    TMT: {rpk.tmt}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Kontak */}
        {activeTab === 'kontak' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">
                Informasi Kontak & Domisili Pegawai
              </h3>
              {!isEditingKontak && (
                <button
                  onClick={() => setIsEditingKontak(true)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800"
                >
                  Edit Kontak
                </button>
              )}
            </div>

            {isEditingKontak ? (
              <form onSubmit={handleSaveKontak} className="space-y-4 text-xs max-w-lg">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email Dinas</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">No. WhatsApp / HP</label>
                  <input
                    type="text"
                    value={telepon}
                    onChange={(e) => setTelepon(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Alamat Tempat Tinggal Saat Ini</label>
                  <textarea
                    rows={3}
                    value={alamat}
                    onChange={(e) => setAlamat(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingKontak(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl shadow-md flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Kontak</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Email Kedinasan</span>
                  <p className="font-semibold text-slate-800 text-sm mt-0.5">{peg.email}</p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">No. Handphone / WhatsApp</span>
                  <p className="font-semibold text-slate-800 text-sm mt-0.5">{peg.telepon}</p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl sm:col-span-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Alamat Domisili Lengkap</span>
                  <p className="font-medium text-slate-800 text-sm mt-0.5">{peg.alamat}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
