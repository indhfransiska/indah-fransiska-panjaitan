import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  CheckCheck, 
  CalendarOff, 
  Award, 
  FolderArchive, 
  Info, 
  Clock, 
  Check, 
  ChevronRight,
  Filter
} from 'lucide-react';

export const HrNotifikasi: React.FC = () => {
  const { notifikasiList, markNotifikasiAsRead, markAllNotifikasiAsRead, setActiveTab } = useApp();
  const [filterKategori, setFilterKategori] = useState<string>('ALL');

  const filtered = notifikasiList.filter((n) => {
    if (filterKategori === 'ALL') return true;
    if (filterKategori === 'UNREAD') return !n.sudahDibaca;
    return n.kategori === filterKategori;
  });

  const getIcon = (kat: string) => {
    switch (kat) {
      case 'cuti':
        return <CalendarOff className="w-5 h-5 text-amber-600" />;
      case 'kenaikan_pangkat':
      case 'pensiun':
        return <Award className="w-5 h-5 text-purple-600" />;
      case 'dokumen':
        return <FolderArchive className="w-5 h-5 text-blue-600" />;
      default:
        return <Info className="w-5 h-5 text-indigo-600" />;
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Pusat Notifikasi & Agenda Kepegawaian</h2>
          <p className="text-xs text-slate-500">
            Pemberitahuan resmi pengajuan cuti, masa pensiun, kenaikan pangkat berkala, dan edaran BKD.
          </p>
        </div>

        <button
          onClick={markAllNotifikasiAsRead}
          className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <CheckCheck className="w-4 h-4" />
          <span>Tandai Semua Telah Dibaca</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200/80 flex items-center gap-1 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setFilterKategori('ALL')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
            filterKategori === 'ALL' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Semua ({notifikasiList.length})
        </button>
        <button
          onClick={() => setFilterKategori('UNREAD')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
            filterKategori === 'UNREAD' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Belum Dibaca ({notifikasiList.filter(n => !n.sudahDibaca).length})
        </button>
        <button
          onClick={() => setFilterKategori('cuti')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
            filterKategori === 'cuti' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Cuti
        </button>
        <button
          onClick={() => setFilterKategori('pensiun')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
            filterKategori === 'pensiun' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Pensiun
        </button>
        <button
          onClick={() => setFilterKategori('dokumen')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
            filterKategori === 'dokumen' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Dokumen
        </button>
      </div>

      {/* Notifikasi List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-10 text-center text-slate-400">
            <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-xs font-semibold text-slate-600">Tidak ada notifikasi dalam filter ini</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`p-4 flex items-start gap-3.5 transition-colors ${
                item.sudahDibaca ? 'hover:bg-slate-50 opacity-80' : 'bg-blue-50/40 hover:bg-blue-50/70'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs shrink-0">
                {getIcon(item.kategori)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-900">{item.judul}</h4>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3" />
                    {item.waktu}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.pesan}</p>

                <div className="mt-2 flex items-center gap-3">
                  {!item.sudahDibaca && (
                    <button
                      onClick={() => markNotifikasiAsRead(item.id)}
                      className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                      Tandai sudah dibaca
                    </button>
                  )}
                  {item.linkMenu && (
                    <button
                      onClick={() => {
                        markNotifikasiAsRead(item.id);
                        setActiveTab(item.linkMenu!);
                      }}
                      className="text-[11px] font-semibold text-slate-700 hover:text-blue-600 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Buka Layanan</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
