import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let bgColor = 'bg-white border-slate-200 text-slate-800 shadow-xl';
        let Icon = Info;
        let iconColor = 'text-blue-600 bg-blue-50';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          iconColor = 'text-emerald-600 bg-emerald-50';
          bgColor = 'bg-white border-emerald-200 text-slate-800 shadow-xl shadow-emerald-500/5';
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          iconColor = 'text-rose-600 bg-rose-50';
          bgColor = 'bg-white border-rose-200 text-slate-800 shadow-xl shadow-rose-500/5';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          iconColor = 'text-amber-600 bg-amber-50';
          bgColor = 'bg-white border-amber-200 text-slate-800 shadow-xl shadow-amber-500/5';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border ${bgColor} transition-all duration-300 animate-in fade-in slide-in-from-bottom-3`}
          >
            <div className={`p-1.5 rounded-lg shrink-0 ${iconColor}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 pt-0.5 text-xs font-medium leading-relaxed">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded-md hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
