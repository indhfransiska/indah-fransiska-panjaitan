export type UserRole = 'hr_admin' | 'pegawai';

export type StatusKepegawaian = 'PNS' | 'PPPK' | 'Honorer' | 'Kontrak';
export type StatusKerja = 'Aktif' | 'Cuti' | 'Pensiun' | 'Tugas Belajar' | 'Nonaktif';

export interface RiwayatJabatan {
  id: string;
  jabatan: string;
  unitKerja: string;
  tmt: string;
  nomorSk: string;
  tanggalSk: string;
}

export interface RiwayatPendidikan {
  id: string;
  jenjang: 'SMA/SMK' | 'D3' | 'D4/S1' | 'S2' | 'S3';
  institusi: string;
  jurusan: string;
  tahunLulus: string;
  nomorIjazah: string;
}

export interface RiwayatPangkat {
  id: string;
  golongan: string;
  pangkat: string;
  tmt: string;
  nomorSk: string;
  pejabatPenetap: string;
}

export interface DokumenKepegawaian {
  id: string;
  pegawaiId: string;
  namaDokumen: string;
  kategori: 'SK' | 'Surat Tugas' | 'Sertifikat' | 'Pendidikan' | 'Kenaikan Pangkat' | 'Pensiun' | 'Lainnya';
  nomorSurat?: string;
  tanggalDokumen: string;
  ukuranFile: string;
  format: 'PDF' | 'JPG' | 'PNG';
  statusVerifikasi: 'Terverifikasi' | 'Menunggu' | 'Ditolak';
  fileUrl?: string;
}

export interface Pegawai {
  id: string;
  nip: string;
  nama: string;
  gelarDepan?: string;
  gelarBelakang?: string;
  email: string;
  telepon: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  agama: 'Islam' | 'Kristen' | 'Katolik' | 'Hindu' | 'Buddha' | 'Konghucu';
  alamat: string;
  unitKerja: string;
  jabatan: string;
  eselon?: string;
  golongan: string; // e.g. 'IV/a - Pembina'
  statusKepegawaian: StatusKepegawaian;
  statusKerja: StatusKerja;
  pendidikanTerakhir: string;
  tmtGolongan: string;
  tmtJabatan: string;
  masaKerjaTahun: number;
  masaKerjaBulan: number;
  sisaCutiTahunan: number;
  totalHakCuti: number;
  avatar: string;
  riwayatJabatan: RiwayatJabatan[];
  riwayatPendidikan: RiwayatPendidikan[];
  riwayatPangkat: RiwayatPangkat[];
  dokumen: DokumenKepegawaian[];
}

export type JenisCuti = 
  | 'Cuti Tahunan'
  | 'Cuti Sakit'
  | 'Cuti Alasan Penting'
  | 'Cuti Melahirkan'
  | 'Cuti Besar'
  | 'Cuti di Luar Tanggungan Negara';

export type StatusPengajuanCuti = 'Menunggu Persetujuan' | 'Disetujui' | 'Ditolak';

export interface PengajuanCuti {
  id: string;
  pegawaiId: string;
  pegawaiNip: string;
  pegawaiNama: string;
  pegawaiJabatan: string;
  pegawaiUnit: string;
  jenisCuti: JenisCuti;
  tanggalMulai: string;
  tanggalSelesai: string;
  jumlahHari: number;
  alasan: string;
  alamatSelamaCuti: string;
  teleponSelamaCuti: string;
  namaDokumenPendukung?: string;
  status: StatusPengajuanCuti;
  catatanHr?: string;
  tanggalPengajuan: string;
  disetujuiOleh?: string;
  tanggalDiproses?: string;
}

export type StatusAbsensi = 'Hadir' | 'Terlambat' | 'Izin' | 'Sakit' | 'Cuti' | 'Alpa';

export interface AbsensiRecord {
  id: string;
  pegawaiId: string;
  pegawaiNama: string;
  nip: string;
  unitKerja: string;
  tanggal: string; // YYYY-MM-DD
  jamMasuk?: string; // HH:mm
  jamPulang?: string; // HH:mm
  status: StatusAbsensi;
  keterangan?: string;
  lokasi?: string;
}

export interface LayananKepegawaian {
  id: string;
  pegawaiId: string;
  pegawaiNama: string;
  nip: string;
  unitKerja: string;
  jenisLayanan: 'Kenaikan Pangkat' | 'Kenaikan Gaji Berkala' | 'Mutasi' | 'Promosi' | 'Pensiun' | 'Pencantuman Gelar';
  detail: string;
  tmtTarget: string;
  statusProses: 'Diusulkan' | 'Verifikasi BKN/BKD' | 'Disetujui' | 'Selesai';
  nomorSk?: string;
  tanggalUpdate: string;
}

export interface NotifikasiItem {
  id: string;
  targetRole: 'all' | 'hr_admin' | 'pegawai';
  targetPegawaiId?: string;
  judul: string;
  pesan: string;
  kategori: 'cuti' | 'kenaikan_pangkat' | 'pensiun' | 'dokumen' | 'absensi' | 'info';
  waktu: string;
  sudahDibaca: boolean;
  linkMenu?: string;
}

export interface AuthUser {
  id: string;
  nip: string;
  nama: string;
  email: string;
  role: UserRole;
  avatar: string;
  pegawaiId?: string; // Links to Pegawai profile if role is 'pegawai'
  jabatan: string;
  unitKerja: string;
}
