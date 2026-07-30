import React from 'react';
import { ShieldCheck, Edit3, Eye, Save, Settings, LogOut, Check, Sparkles } from 'lucide-react';

interface InlineEditToolbarProps {
  isAdminMode: boolean;
  isEditActive: boolean;
  onToggleEditActive: () => void;
  onOpenAdminPortal: () => void;
  onSaveAll: () => Promise<void>;
  onLogout: () => void;
  isSaving: boolean;
}

export const InlineEditToolbar: React.FC<InlineEditToolbarProps> = ({
  isAdminMode,
  isEditActive,
  onToggleEditActive,
  onOpenAdminPortal,
  onSaveAll,
  onLogout,
  isSaving,
}) => {
  if (!isAdminMode) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[110] bg-slate-950/90 backdrop-blur-xl border border-slate-800 text-white px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-3 animate-fadeIn max-w-[95vw] overflow-x-auto">
      {/* Admin Mode Badge */}
      <div className="flex items-center gap-2 pr-3 border-r border-slate-800 shrink-0">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-xs font-mono font-bold text-slate-300">ADMIN MODE</span>
      </div>

      {/* Toggle Live Edit Mode */}
      <button
        onClick={onToggleEditActive}
        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
          isEditActive
            ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
            : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
        }`}
      >
        <Edit3 className="w-3.5 h-3.5" />
        <span>{isEditActive ? 'Đang Bật Chỉnh Sửa Live' : 'Bật Chỉnh Sửa Trực Quan'}</span>
      </button>

      {/* Open Deep Admin Portal */}
      <button
        onClick={onOpenAdminPortal}
        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
      >
        <Settings className="w-3.5 h-3.5 text-amber-400" />
        <span>Admin Portal Chuyên Sâu</span>
      </button>

      {/* Save All to Supabase */}
      <button
        onClick={onSaveAll}
        disabled={isSaving}
        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
          isSaving
            ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20'
        }`}
      >
        {isSaving ? (
          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <Save className="w-3.5 h-3.5" />
        )}
        <span>{isSaving ? 'Đang Lưu...' : 'Lưu Thay Đổi'}</span>
      </button>

      {/* Logout / Exit */}
      <button
        onClick={onLogout}
        className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-red-600/80 text-slate-400 hover:text-white transition-all cursor-pointer shrink-0 ml-1"
        title="Đăng xuất khỏi Admin"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  );
};
