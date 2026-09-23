import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  AuthUser, 
  UserRole, 
  Pegawai, 
  PengajuanCuti, 
  AbsensiRecord, 
  LayananKepegawaian, 
  NotifikasiItem, 
  DokumenKepegawaian 
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_PEGAWAI, 
  INITIAL_PENGAJUAN_CUTI, 
  INITIAL_ABSENSI, 
  INITIAL_LAYANAN_KEPEGAWAIAN, 
  INITIAL_NOTIFIKASI 
} from '../data/initialData';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface AppContextType {
  currentUser: AuthUser | null;
  setCurrentUser: (user: AuthUser | null) => void;
  login: (nip: string, pass: string) => { success: boolean; message?: string };
  logout: () => void;
  switchRole: (role: UserRole) => void;
  
  // Pegawai State
  pegawaiList: Pegawai[];
  addPegawai: (pegawai: Omit<Pegawai, 'id'>) => void;
  updatePegawai: (id: string, data: Partial<Pegawai>) => void;
  deletePegawai: (id: string) => void;
  toggleStatusPegawai: (id: string) => void;

  // Cuti State
  pengajuanCutiList: PengajuanCuti[];
  addPengajuanCuti: (data: {
    jenisCuti: PengajuanCuti['jenisCuti'];
    tanggalMulai: string;
    tanggalSelesai: string;
    jumlahHari: number;
    alasan: string;
    alamatSelamaCuti: string;
    teleponSelamaCuti: string;
    namaDokumenPendukung?: string;
  }) => boolean;
  approveCuti: (id: string, catatan?: string) => void;
  rejectCuti: (id: string, catatan: string) => void;

  // Absensi State
  absensiList: AbsensiRecord[];
  todayPresensi: AbsensiRecord | null;
  doPresensiMasuk: (lokasi?: string) => void;
  doPresensiPulang: () => void;

  // Layanan Kepegawaian
  layananList: LayananKepegawaian[];
  updateLayananStatus: (id: string, status: LayananKepegawaian['statusProses'], nomorSk?: string) => void;
  addLayanan: (layanan: Omit<LayananKepegawaian, 'id' | 'tanggalUpdate'>) => void;

  // Dokumen
  addDokumenPegawai: (pegawaiId: string, doc: Omit<DokumenKepegawaian, 'id'>) => void;
  activePreviewDoc: DokumenKepegawaian | null;
  setActivePreviewDoc: (doc: DokumenKepegawaian | null) => void;

  // Notifikasi
  notifikasiList: NotifikasiItem[];
  markNotifikasiAsRead: (id: string) => void;
  markAllNotifikasiAsRead: () => void;
  unreadCount: number;

  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;

  // Modals & Toasts
  isLogoutModalOpen: boolean;
  setIsLogoutModalOpen: (open: boolean) => void;
  isChangePasswordModalOpen: boolean;
  setIsChangePasswordModalOpen: (open: boolean) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  toasts: Toast[];
  addToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistence with localStorage fallback
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('simpeg_current_user');
      return saved ? JSON.parse(saved) : INITIAL_USERS[0]; // Default logged in as HR Admin for instant preview
    } catch {
      return INITIAL_USERS[0];
    }
  });

  const [pegawaiList, setPegawaiList] = useState<Pegawai[]>(() => {
    try {
      const saved = localStorage.getItem('simpeg_pegawai_list');
      return saved ? JSON.parse(saved) : INITIAL_PEGAWAI;
    } catch {
      return INITIAL_PEGAWAI;
    }
  });

  const [pengajuanCutiList, setPengajuanCutiList] = useState<PengajuanCuti[]>(() => {
    try {
      const saved = localStorage.getItem('simpeg_cuti_list');
      return saved ? JSON.parse(saved) : INITIAL_PENGAJUAN_CUTI;
    } catch {
      return INITIAL_PENGAJUAN_CUTI;
    }
  });

  const [absensiList, setAbsensiList] = useState<AbsensiRecord[]>(() => {
    try {
      const saved = localStorage.getItem('simpeg_absensi_list');
      return saved ? JSON.parse(saved) : INITIAL_ABSENSI;
    } catch {
      return INITIAL_ABSENSI;
    }
  });

  const [layananList, setLayananList] = useState<LayananKepegawaian[]>(() => {
    try {
      const saved = localStorage.getItem('simpeg_layanan_list');
      return saved ? JSON.parse(saved) : INITIAL_LAYANAN_KEPEGAWAIAN;
    } catch {
      return INITIAL_LAYANAN_KEPEGAWAIAN;
    }
  });

  const [notifikasiList, setNotifikasiList] = useState<NotifikasiItem[]>(() => {
    try {
      const saved = localStorage.getItem('simpeg_notifikasi_list');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFIKASI;
    } catch {
      return INITIAL_NOTIFIKASI;
    }
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [activePreviewDoc, setActivePreviewDoc] = useState<DokumenKepegawaian | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync to local storage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('simpeg_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('simpeg_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('simpeg_pegawai_list', JSON.stringify(pegawaiList));
  }, [pegawaiList]);

  useEffect(() => {
    localStorage.setItem('simpeg_cuti_list', JSON.stringify(pengajuanCutiList));
  }, [pengajuanCutiList]);

  useEffect(() => {
    localStorage.setItem('simpeg_absensi_list', JSON.stringify(absensiList));
  }, [absensiList]);

  useEffect(() => {
    localStorage.setItem('simpeg_layanan_list', JSON.stringify(layananList));
  }, [layananList]);

  useEffect(() => {
    localStorage.setItem('simpeg_notifikasi_list', JSON.stringify(notifikasiList));
  }, [notifikasiList]);

  // Toast Helper
  const addToast = (message: string, type: Toast['type'] = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth Functions
  const login = (nipInput: string, passInput: string) => {
    const cleanNip = nipInput.trim();
    if (!cleanNip || !passInput) {
      return { success: false, message: 'NIP / Username dan Password wajib diisi.' };
    }

    // Check HR user
    if (cleanNip === '198503152010011002' || cleanNip.toLowerCase() === 'admin') {
      if (passInput === 'admin123' || passInput === 'admin') {
        const adminUser = INITIAL_USERS[0];
        setCurrentUser(adminUser);
        setActiveTab('dashboard');
        addToast(`Selamat datang kembali, ${adminUser.nama}`, 'success');
        return { success: true };
      } else {
        return { success: false, message: 'Password salah untuk akun Admin. Coba "admin123".' };
      }
    }

    // Check Pegawai user
    if (cleanNip === '199208202018021001' || cleanNip.toLowerCase() === 'pegawai' || cleanNip.toLowerCase() === 'budi') {
      if (passInput === 'user123' || passInput === 'pegawai' || passInput === 'budi123') {
        const pegUser = INITIAL_USERS[1];
        setCurrentUser(pegUser);
        setActiveTab('dashboard');
        addToast(`Selamat datang kembali, ${pegUser.nama}`, 'success');
        return { success: true };
      } else {
        return { success: false, message: 'Password salah untuk akun Pegawai. Coba "user123".' };
      }
    }

    // Match against any pegawai in the list
    const foundPegawai = pegawaiList.find(p => p.nip === cleanNip);
    if (foundPegawai) {
      if (passInput === '123456' || passInput === 'password') {
        const newUser: AuthUser = {
          id: `user-${foundPegawai.id}`,
          nip: foundPegawai.nip,
          nama: `${foundPegawai.gelarDepan ? foundPegawai.gelarDepan + ' ' : ''}${foundPegawai.nama}${foundPegawai.gelarBelakang ? ', ' + foundPegawai.gelarBelakang : ''}`,
          email: foundPegawai.email,
          role: 'pegawai',
          pegawaiId: foundPegawai.id,
          avatar: foundPegawai.avatar,
          jabatan: foundPegawai.jabatan,
          unitKerja: foundPegawai.unitKerja
        };
        setCurrentUser(newUser);
        setActiveTab('dashboard');
        addToast(`Selamat datang kembali, ${newUser.nama}`, 'success');
        return { success: true };
      } else {
        return { success: false, message: 'Password salah. Gunakan password default "123456".' };
      }
    }

    return { 
      success: false, 
      message: 'NIP/Username tidak terdaftar dalam basis data SIMPEG. Periksa kembali atau gunakan tombol login cepat.' 
    };
  };

  const logout = () => {
    setCurrentUser(null);
    setIsLogoutModalOpen(false);
    setActiveTab('dashboard');
    addToast('Anda telah berhasil keluar dari sistem.', 'info');
  };

  const switchRole = (newRole: UserRole) => {
    if (newRole === 'hr_admin') {
      setCurrentUser(INITIAL_USERS[0]);
    } else {
      setCurrentUser(INITIAL_USERS[1]);
    }
    setActiveTab('dashboard');
    addToast(`Beralih peran sebagai ${newRole === 'hr_admin' ? 'HR / Administrator' : 'Pegawai'}`, 'info');
  };

  // Pegawai CRUD
  const addPegawai = (newPegawaiData: Omit<Pegawai, 'id'>) => {
    const id = `peg-${Date.now()}`;
    const newPegawai: Pegawai = {
      id,
      ...newPegawaiData
    };
    setPegawaiList((prev) => [newPegawai, ...prev]);
    addToast(`Data pegawai ${newPegawai.nama} berhasil ditambahkan ke database`, 'success');
  };

  const updatePegawai = (id: string, data: Partial<Pegawai>) => {
    setPegawaiList((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
    addToast('Data pegawai berhasil diperbarui', 'success');
  };

  const deletePegawai = (id: string) => {
    const peg = pegawaiList.find((p) => p.id === id);
    setPegawaiList((prev) => prev.filter((p) => p.id !== id));
    addToast(`Pegawai ${peg?.nama || ''} telah dihapus dari sistem`, 'warning');
  };

  const toggleStatusPegawai = (id: string) => {
    setPegawaiList((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newStatus: Pegawai['statusKerja'] = p.statusKerja === 'Aktif' ? 'Nonaktif' : 'Aktif';
          return { ...p, statusKerja: newStatus };
        }
        return p;
      })
    );
    addToast('Status keaktifan pegawai berhasil diperbarui', 'info');
  };

  // Cuti Logic
  const addPengajuanCuti = (data: {
    jenisCuti: PengajuanCuti['jenisCuti'];
    tanggalMulai: string;
    tanggalSelesai: string;
    jumlahHari: number;
    alasan: string;
    alamatSelamaCuti: string;
    teleponSelamaCuti: string;
    namaDokumenPendukung?: string;
  }) => {
    if (!currentUser) return false;
    const currentPeg = pegawaiList.find(p => p.id === currentUser.pegawaiId) || pegawaiList[0];

    const newId = `cuti-${Date.now()}`;
    const newCuti: PengajuanCuti = {
      id: newId,
      pegawaiId: currentPeg.id,
      pegawaiNip: currentPeg.nip,
      pegawaiNama: `${currentPeg.gelarDepan ? currentPeg.gelarDepan + ' ' : ''}${currentPeg.nama}${currentPeg.gelarBelakang ? ', ' + currentPeg.gelarBelakang : ''}`,
      pegawaiJabatan: currentPeg.jabatan,
      pegawaiUnit: currentPeg.unitKerja,
      jenisCuti: data.jenisCuti,
      tanggalMulai: data.tanggalMulai,
      tanggalSelesai: data.tanggalSelesai,
      jumlahHari: data.jumlahHari,
      alasan: data.alasan,
      alamatSelamaCuti: data.alamatSelamaCuti,
      teleponSelamaCuti: data.teleponSelamaCuti,
      namaDokumenPendukung: data.namaDokumenPendukung || 'surat_keterangan.pdf',
      status: 'Menunggu Persetujuan',
      tanggalPengajuan: new Date().toISOString().split('T')[0]
    };

    setPengajuanCutiList((prev) => [newCuti, ...prev]);

    // Send notification to HR
    const newNotif: NotifikasiItem = {
      id: `notif-${Date.now()}`,
      targetRole: 'hr_admin',
      judul: 'Pengajuan Cuti Baru',
      pesan: `${newCuti.pegawaiNama} mengajukan ${newCuti.jenisCuti} (${data.jumlahHari} hari).`,
      kategori: 'cuti',
      waktu: 'Baru saja',
      sudahDibaca: false,
      linkMenu: 'cuti'
    };
    setNotifikasiList((prev) => [newNotif, ...prev]);

    addToast('Pengajuan cuti berhasil dikirimkan ke HR/Admin.', 'success');
    return true;
  };

  const approveCuti = (id: string, catatan?: string) => {
    setPengajuanCutiList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          // If cuti tahunan, reduce sisa cuti
          if (item.jenisCuti === 'Cuti Tahunan') {
            setPegawaiList((pegs) =>
              pegs.map((p) => {
                if (p.id === item.pegawaiId) {
                  const newBalance = Math.max(0, p.sisaCutiTahunan - item.jumlahHari);
                  return { ...p, sisaCutiTahunan: newBalance };
                }
                return p;
              })
            );
          }

          // Notify employee
          const employeeNotif: NotifikasiItem = {
            id: `notif-${Date.now()}`,
            targetRole: 'pegawai',
            targetPegawaiId: item.pegawaiId,
            judul: 'Pengajuan Cuti Disetujui',
            pesan: `Permohonan ${item.jenisCuti} (${item.tanggalMulai} s.d ${item.tanggalSelesai}) telah disetujui HR.`,
            kategori: 'cuti',
            waktu: 'Baru saja',
            sudahDibaca: false,
            linkMenu: 'pengajuan-cuti'
          };
          setNotifikasiList((n) => [employeeNotif, ...n]);

          return {
            ...item,
            status: 'Disetujui',
            catatanHr: catatan || 'Disetujui sesuai regulasi kepegawaian yang berlaku.',
            disetujuiOleh: currentUser?.nama || 'Administrator HR',
            tanggalDiproses: new Date().toISOString().split('T')[0]
          };
        }
        return item;
      })
    );
    addToast('Permohonan cuti telah disetujui', 'success');
  };

  const rejectCuti = (id: string, catatan: string) => {
    setPengajuanCutiList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          // Notify employee
          const employeeNotif: NotifikasiItem = {
            id: `notif-${Date.now()}`,
            targetRole: 'pegawai',
            targetPegawaiId: item.pegawaiId,
            judul: 'Pengajuan Cuti Ditolak',
            pesan: `Permohonan ${item.jenisCuti} tidak dapat disetujui. Alasan: ${catatan}`,
            kategori: 'cuti',
            waktu: 'Baru saja',
            sudahDibaca: false,
            linkMenu: 'pengajuan-cuti'
          };
          setNotifikasiList((n) => [employeeNotif, ...n]);

          return {
            ...item,
            status: 'Ditolak',
            catatanHr: catatan,
            disetujuiOleh: currentUser?.nama || 'Administrator HR',
            tanggalDiproses: new Date().toISOString().split('T')[0]
          };
        }
        return item;
      })
    );
    addToast('Permohonan cuti telah ditolak', 'info');
  };

  // Today Presensi for logged in employee
  const todayStr = '2026-09-22';
  const todayPresensi = currentUser?.pegawaiId
    ? absensiList.find((a) => a.pegawaiId === currentUser.pegawaiId && a.tanggal === todayStr) || null
    : null;

  const doPresensiMasuk = (lokasi = 'Kantor BKD / Diskominfo (Radius Valid)') => {
    if (!currentUser || !currentUser.pegawaiId) return;
    const peg = pegawaiList.find((p) => p.id === currentUser.pegawaiId);
    if (!peg) return;

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeStr = `${hours}:${minutes}`;

    // On time if before 07:30
    const isLate = parseInt(hours, 10) > 7 || (parseInt(hours, 10) === 7 && parseInt(minutes, 10) > 30);
    const status: AbsensiRecord['status'] = isLate ? 'Terlambat' : 'Hadir';

    const newRecord: AbsensiRecord = {
      id: `abs-${Date.now()}`,
      pegawaiId: peg.id,
      pegawaiNama: `${peg.gelarDepan ? peg.gelarDepan + ' ' : ''}${peg.nama}${peg.gelarBelakang ? ', ' + peg.gelarBelakang : ''}`,
      nip: peg.nip,
      unitKerja: peg.unitKerja,
      tanggal: todayStr,
      jamMasuk: timeStr,
      status,
      keterangan: isLate ? `Terlambat ${minutes} menit` : 'Tepat Waktu',
      lokasi
    };

    setAbsensiList((prev) => [newRecord, ...prev.filter((a) => !(a.pegawaiId === peg.id && a.tanggal === todayStr))]);
    addToast(`Presensi Masuk berhasil dicatat pada pukul ${timeStr} WIB (${status})`, 'success');
  };

  const doPresensiPulang = () => {
    if (!currentUser || !currentUser.pegawaiId) return;
    const pegId = currentUser.pegawaiId;

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeStr = `${hours}:${minutes}`;

    setAbsensiList((prev) =>
      prev.map((a) => {
        if (a.pegawaiId === pegId && a.tanggal === todayStr) {
          return { ...a, jamPulang: timeStr };
        }
        return a;
      })
    );
    addToast(`Presensi Pulang berhasil dicatat pada pukul ${timeStr} WIB. Selamat beristirahat!`, 'success');
  };

  // Layanan Kepegawaian CRUD
  const updateLayananStatus = (id: string, status: LayananKepegawaian['statusProses'], nomorSk?: string) => {
    setLayananList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            statusProses: status,
            nomorSk: nomorSk || item.nomorSk,
            tanggalUpdate: new Date().toISOString().split('T')[0]
          };
        }
        return item;
      })
    );
    addToast(`Status berkas layanan kepegawaian diperbarui menjadi: ${status}`, 'success');
  };

  const addLayanan = (layanan: Omit<LayananKepegawaian, 'id' | 'tanggalUpdate'>) => {
    const newItem: LayananKepegawaian = {
      id: `lay-${Date.now()}`,
      ...layanan,
      tanggalUpdate: new Date().toISOString().split('T')[0]
    };
    setLayananList((prev) => [newItem, ...prev]);
    addToast(`Usulan layanan ${layanan.jenisLayanan} berhasil diajukan`, 'success');
  };

  // Dokumen
  const addDokumenPegawai = (pegawaiId: string, doc: Omit<DokumenKepegawaian, 'id'>) => {
    const newDoc: DokumenKepegawaian = {
      id: `dok-${Date.now()}`,
      ...doc
    };
    setPegawaiList((prev) =>
      prev.map((p) => {
        if (p.id === pegawaiId) {
          return { ...p, dokumen: [newDoc, ...p.dokumen] };
        }
        return p;
      })
    );
    addToast(`Dokumen ${doc.namaDokumen} berhasil diunggah`, 'success');
  };

  // Notifikasi
  const markNotifikasiAsRead = (id: string) => {
    setNotifikasiList((prev) => prev.map((n) => (n.id === id ? { ...n, sudahDibaca: true } : n)));
  };

  const markAllNotifikasiAsRead = () => {
    setNotifikasiList((prev) => prev.map((n) => ({ ...n, sudahDibaca: true })));
    addToast('Semua notifikasi telah ditandai dibaca', 'info');
  };

  const filteredNotifikasi = notifikasiList.filter((n) => {
    if (!currentUser) return false;
    if (currentUser.role === 'hr_admin') {
      return n.targetRole === 'hr_admin' || n.targetRole === 'all';
    } else {
      return (
        n.targetRole === 'all' ||
        (n.targetRole === 'pegawai' && (!n.targetPegawaiId || n.targetPegawaiId === currentUser.pegawaiId))
      );
    }
  });

  const unreadCount = filteredNotifikasi.filter((n) => !n.sudahDibaca).length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        login,
        logout,
        switchRole,
        pegawaiList,
        addPegawai,
        updatePegawai,
        deletePegawai,
        toggleStatusPegawai,
        pengajuanCutiList,
        addPengajuanCuti,
        approveCuti,
        rejectCuti,
        absensiList,
        todayPresensi,
        doPresensiMasuk,
        doPresensiPulang,
        layananList,
        updateLayananStatus,
        addLayanan,
        addDokumenPegawai,
        activePreviewDoc,
        setActivePreviewDoc,
        notifikasiList: filteredNotifikasi,
        markNotifikasiAsRead,
        markAllNotifikasiAsRead,
        unreadCount,
        activeTab,
        setActiveTab,
        isSidebarOpen,
        setIsSidebarOpen,
        isLogoutModalOpen,
        setIsLogoutModalOpen,
        isChangePasswordModalOpen,
        setIsChangePasswordModalOpen,
        isProfileModalOpen,
        setIsProfileModalOpen,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
