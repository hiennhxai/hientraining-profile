import React, { useState, useRef, useEffect } from 'react';
import { 
  Edit3, Save, Settings, LogOut, GripVertical, RotateCcw, 
  Minimize2, Maximize2, Move, ArrowUpRight, ArrowDownRight, Layout
} from 'lucide-react';

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
  // Position state: relative offset (x, y)
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isDraggingRef = useRef(false);
  const hasMovedRef = useRef(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);

  if (!isAdminMode) return null;

  // ─── ROBUST GLOBAL WINDOW POINTER DRAG ───
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Record starting mouse/touch position
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y,
    };
    hasMovedRef.current = false;
    isDraggingRef.current = false;

    const onPointerMove = (moveEvent: PointerEvent) => {
      if (!dragStartRef.current) return;
      const dx = moveEvent.clientX - dragStartRef.current.startX;
      const dy = moveEvent.clientY - dragStartRef.current.startY;
      const dist = Math.hypot(dx, dy);

      if (dist > 3) {
        hasMovedRef.current = true;
        isDraggingRef.current = true;
        setIsDragging(true);
      }

      if (hasMovedRef.current) {
        setPosition({
          x: dragStartRef.current.initialX + dx,
          y: dragStartRef.current.initialY + dy,
        });
      }
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);

      setIsDragging(false);
      setTimeout(() => {
        isDraggingRef.current = false;
        dragStartRef.current = null;
      }, 50);
    };

    // Attach listeners directly to window to guarantee continuous mouse tracking
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  const handleClickCapture = (e: React.MouseEvent) => {
    if (hasMovedRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // Quick Dock Presets
  const dockTopCenter = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPosition({ x: 0, y: 0 });
  };

  const dockTopRight = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rightMargin = (window.innerWidth / 2) - 180;
    setPosition({ x: Math.max(100, rightMargin), y: 0 });
  };

  const dockBottomRight = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rightMargin = (window.innerWidth / 2) - 180;
    const bottomMargin = window.innerHeight - 160;
    setPosition({ x: Math.max(100, rightMargin), y: bottomMargin });
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onClickCapture={handleClickCapture}
      style={{
        transform: `translate(calc(-50% + ${position.x}px), ${position.y}px)`,
        touchAction: 'none',
      }}
      className={`fixed top-16 left-1/2 z-[130] bg-slate-950/95 backdrop-blur-xl border border-slate-800 text-white rounded-2xl shadow-2xl flex items-center select-none transition-shadow ${
        isDragging 
          ? 'cursor-grabbing shadow-emerald-500/30 border-emerald-500/70 ring-2 ring-emerald-500/40 scale-[1.01]' 
          : 'cursor-grab hover:border-slate-700'
      } ${isCollapsed ? 'px-3 py-1.5 gap-2' : 'px-3.5 py-2 gap-2.5 max-w-[95vw] overflow-x-auto'}`}
      title="Bấm đè và rê chuột ở bất kỳ đâu để di chuyển thanh Admin Mode"
    >
      {/* ─── DRAG GRIP & BADGE ─── */}
      <div className="flex items-center gap-1.5 pr-2.5 border-r border-slate-800 shrink-0 cursor-grab active:cursor-grabbing">
        <GripVertical className="w-4 h-4 text-slate-400 hover:text-white transition-colors" />
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-xs font-mono font-bold text-slate-300">
          {isCollapsed ? 'ADMIN' : 'ADMIN MODE'}
        </span>
      </div>

      {/* ─── COLLAPSED MINIMAL MODE ─── */}
      {isCollapsed ? (
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleEditActive}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              isEditActive ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
            title="Bật/Tắt Chỉnh Sửa Live"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onOpenAdminPortal}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400"
            title="Mở Admin Portal"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsCollapsed(false)}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
            title="Mở rộng thanh Admin"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        /* ─── EXPANDED FULL TOOLBAR ─── */
        <>
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

          {/* Docking & Position Controls */}
          <div className="flex items-center gap-1 pl-1 border-l border-slate-800 shrink-0">
            <button
              onClick={dockTopRight}
              className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
              title="Đưa sang Góc Phải Trên"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={dockBottomRight}
              className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
              title="Đưa xuống Góc Phải Dưới"
            >
              <ArrowDownRight className="w-3.5 h-3.5" />
            </button>
            {(position.x !== 0 || position.y !== 0) && (
              <button
                onClick={dockTopCenter}
                className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
                title="Về Lại Giữa Trên"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
              title="Thu nhỏ thanh Admin (Tránh che màn hình)"
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Logout / Exit */}
          <button
            onClick={onLogout}
            className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-red-600/80 text-slate-400 hover:text-white transition-all cursor-pointer shrink-0 ml-1"
            title="Đăng xuất khỏi Admin"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </>
      )}
    </div>
  );
};



