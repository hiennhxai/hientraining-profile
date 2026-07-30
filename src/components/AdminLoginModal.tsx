import React, { useState, FormEvent } from 'react';
import { Language } from '../types';
import { Lock, ShieldCheck, X, KeyRound, UserCheck, AlertCircle } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  lang: Language;
  onClose: () => void;
  onSuccess: () => void;
}

export function AdminLoginModal({ isOpen, lang, onClose, onSuccess }: AdminLoginModalProps) {
  const isVi = lang === 'vi';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validate credentials: ID = admin, Password = admin123
    if (username.trim().toLowerCase() === 'admin' && password === 'admin123') {
      setUsername('');
      setPassword('');
      onSuccess();
    } else {
      setErrorMsg(
        isVi 
          ? 'Mật khẩu hoặc Tên đăng nhập không đúng! Vui lòng thử lại.' 
          : 'Invalid Admin Credentials! Please try again.'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-[120] bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 text-slate-900">
        
        {/* Close Button */}
        <button
          onClick={() => { setErrorMsg(null); onClose(); }}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 border border-slate-200 text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {isVi ? 'ĐĂNG NHẬP QUẢN TRỊ VIÊN' : 'ADMIN PORTAL LOGIN'}
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">
            {isVi ? 'Nhập ID & Mật khẩu để truy cập hệ thống cấu hình Super Admin' : 'Enter Admin ID & Password to access control portal'}
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-orange-600" />
              <span>{isVi ? 'Tên đăng nhập (ID):' : 'Admin ID:'}</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-mono text-sm text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-orange-600" />
              <span>{isVi ? 'Mật khẩu:' : 'Password:'}</span>
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-mono text-sm text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => { setErrorMsg(null); onClose(); }}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              {isVi ? 'Hủy' : 'Cancel'}
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-extrabold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isVi ? 'Đăng Nhập Admin' : 'Login'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
