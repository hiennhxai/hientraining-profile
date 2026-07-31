import { useState, useEffect, useMemo } from 'react';
import { Language, ResourceItem } from '../types';
import { getAdminData } from '../data/adminStore';
import { translations } from '../data/translations';
import { EditableWrapper } from './EditableWrapper';
import { 
  FolderDown, FileText, Table, FileArchive, HardDrive, ExternalLink, 
  Download, ArrowUpDown, Sparkles, Clock, Filter, Lock, FileCode, Search
} from 'lucide-react';

interface ResourceLibrarySectionProps {
  lang: Language;
  isEditActive?: boolean;
  onEditField?: (fieldKey: string, fieldLabel: string, currentValue: string) => void;
}

const getFileTypeBadge = (fileTypeStr: string) => {
  const ft = (fileTypeStr || '').toUpperCase();
  if (ft.includes('PDF')) {
    return { label: 'PDF DOCUMENT', bg: 'bg-red-50 text-red-700 border-red-200', icon: FileText };
  } else if (ft.includes('DOC') || ft.includes('WORD')) {
    return { label: 'WORD DOCX', bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: FileCode };
  } else if (ft.includes('XLS') || ft.includes('EXCEL') || ft.includes('SHEET')) {
    return { label: 'EXCEL SHEET', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: Table };
  } else if (ft.includes('DRIVE') || ft.includes('CLOUD')) {
    return { label: 'GOOGLE DRIVE', bg: 'bg-amber-50 text-amber-800 border-amber-200', icon: HardDrive };
  } else if (ft.includes('ZIP') || ft.includes('RAR') || ft.includes('PRESET')) {
    return { label: 'ZIP ARCHIVE', bg: 'bg-purple-50 text-purple-700 border-purple-200', icon: FileArchive };
  }
  return { label: fileTypeStr || 'FILE DOWNLOAD', bg: 'bg-slate-100 text-slate-800 border-slate-300', icon: ExternalLink };
};

export function ResourceLibrarySection({ lang, isEditActive = false, onEditField }: ResourceLibrarySectionProps) {
  const [resources, setResources] = useState<ResourceItem[]>(getAdminData().resources || []);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [searchQuery, setSearchQuery] = useState('');

  const t = translations[lang];
  const isVi = lang === 'vi';

  useEffect(() => {
    const handleUpdate = () => {
      setResources(getAdminData().resources || []);
    };
    window.addEventListener('admin_data_updated', handleUpdate);
    window.addEventListener('supabase_realtime_update', handleUpdate);
    return () => {
      window.removeEventListener('admin_data_updated', handleUpdate);
      window.removeEventListener('supabase_realtime_update', handleUpdate);
    };
  }, []);

  const triggerEdit = (key: string, label: string, currentVal: string) => {
    if (onEditField) onEditField(key, label, currentVal);
  };

  // Calculate Category Counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: resources.length };
    resources.forEach((res) => {
      const cat = res.cat || 'Khác';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [resources]);

  // Only categories with count > 0
  const activeCategories = useMemo(() => {
    const categories = Object.keys(categoryCounts).filter((cat) => cat !== 'all' && categoryCounts[cat] > 0);
    return ['all', ...categories];
  }, [categoryCounts]);

  // Category Pretty Label Mapper
  const getCategoryLabel = (cat: string) => {
    if (cat === 'all') return isVi ? 'Tất Cả Tài Liệu' : 'All Resources';
    if (cat === 'script') return 'Kịch Bản Livestream';
    if (cat === 'template') return 'Bảng Tính & Template';
    if (cat === 'ebook') return 'Ebook Giáo Trình';
    if (cat === 'software') return 'Phần Mềm & Preset';
    if (cat === 'setup_guide') return 'Checklist & Studio Setup';
    return cat;
  };

  // Filter & Sort Resources
  const filteredResources = useMemo(() => {
    let result = [...resources];

    // Category Filter
    if (selectedCategory !== 'all') {
      result = result.filter((r) => r.cat === selectedCategory);
    }

    // Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          (r.description && r.description.toLowerCase().includes(q)) ||
          (r.tags && r.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    // Sort Order
    result.sort((a, b) => {
      const dateA = a.date || '2026.01.01';
      const dateB = b.date || '2026.01.01';
      if (sortOrder === 'newest') {
        return dateB.localeCompare(dateA);
      } else {
        return dateA.localeCompare(dateB);
      }
    });

    return result;
  }, [resources, selectedCategory, searchQuery, sortOrder]);

  return (
    <section id="resources" className="py-5 sm:py-8 bg-slate-50 relative border-b border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-extrabold text-orange-600 bg-orange-50 border border-orange-200 uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
                <FolderDown className="w-4 h-4 text-orange-600" />
                <span>KHO TÀI LIỆU HỌC VIÊN ({filteredResources.length})</span>
              </span>
            </div>

            <EditableWrapper
              isEditActive={isEditActive}
              label="Sửa Tiêu Đề Kho Tài Liệu"
              onEdit={() => triggerEdit('resourceTitle', 'Tiêu Đề Kho Tài Liệu', 'Tài Liệu & Biểu Mẫu Thực Chiến')}
            >
              <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {isVi ? 'Tài Liệu & Biểu Mẫu Thực Chiến' : 'Practical Resources & Templates'}
              </h2>
            </EditableWrapper>

            <p className="text-slate-700 text-xs sm:text-sm font-medium leading-relaxed">
              {isVi 
                ? 'Hệ thống Ebook, Kịch bản Livestream chốt đơn, Bảng tính Ánh sáng Studio & Preset OBS miễn phí dành cho học viên và thương hiệu.'
                : 'Free Ebooks, Livestream Scripts, Studio Lighting Calculators & OBS Presets for trainees & brands.'}
            </p>
          </div>

          {/* Sort Order Selector & Search Input */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 shrink-0 self-start md:self-auto w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:flex-initial">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={isVi ? "Tìm tài liệu..." : "Search resources..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 md:w-48 transition-all shadow-2xs"
              />
            </div>

            {/* Sort Toggle */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-300 shadow-2xs shrink-0">
              <span className="text-xs font-mono font-bold text-slate-500 pl-2 flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              </span>

              <button
                type="button"
                onClick={() => setSortOrder('newest')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  sortOrder === 'newest'
                    ? 'bg-slate-900 text-amber-400 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Mới Nhất</span>
              </button>

              <button
                type="button"
                onClick={() => setSortOrder('oldest')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  sortOrder === 'oldest'
                    ? 'bg-slate-900 text-amber-400 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Cũ Nhất</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Tabs — Touch-Scrollable Horizontal Pill Bar on Mobile */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-extrabold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-orange-600" />
              <span>DANH MỤC TÀI LIỆU</span>
            </span>

            {selectedCategory !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span>Xem Tất Cả</span>
              </button>
            )}
          </div>

          {/* Smooth Touch Horizon Scroll Pill Bar */}
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-2 pt-0.5 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
            {activeCategories.map((catId) => {
              const count = categoryCounts[catId] || 0;
              const isActive = selectedCategory === catId;
              const label = getCategoryLabel(catId);

              return (
                <button
                  key={catId}
                  type="button"
                  onClick={() => setSelectedCategory(catId)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border shrink-0 ${
                    isActive
                      ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                      : 'bg-white text-slate-800 border-slate-300 hover:border-orange-400 hover:bg-orange-50/40'
                  }`}
                >
                  <span>{label}</span>
                  <sup className={`font-mono text-[10px] font-black leading-none ml-0.5 ${
                    isActive ? 'text-amber-300' : 'text-orange-600'
                  }`}>
                    ({count})
                  </sup>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column Responsive Balanced Resource Cards Grid */}
        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-1">
            {filteredResources.map((res, index) => {
              const badge = getFileTypeBadge(res.fileType);
              const BadgeIcon = badge.icon;
              const hasDescription = Boolean(res.description && res.description.trim());
              const hasAccessNote = Boolean(res.accessNote && res.accessNote.trim());
              const fileIndexNumber = filteredResources.length - index;

              return (
                <div
                  key={res.id}
                  className="rounded-2xl bg-white border-2 border-slate-900 hover:border-orange-600 transition-all p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-xl group"
                >
                  <div className="space-y-3">
                    {/* Top Metadata Row: Badges Cluster on Left, Date on Right */}
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Prominent High-Visibility Sequential Index Badge */}
                        <span className="px-2.5 py-0.5 rounded-lg bg-slate-900 text-amber-400 font-mono text-xs sm:text-sm font-black shrink-0 shadow-2xs border border-amber-400/30">
                          #{fileIndexNumber}
                        </span>

                        {/* File Format Badge */}
                        <span className={`px-2.5 py-0.5 rounded-lg font-mono text-[10px] sm:text-[11px] font-black flex items-center gap-1 shrink-0 ${badge.bg}`}>
                          <BadgeIcon className="w-3.5 h-3.5" />
                          <span>{badge.label}</span>
                        </span>

                        {/* File Size */}
                        {res.fileSize && (
                          <span className="text-[10px] sm:text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md border border-slate-200 shrink-0">
                            {res.fileSize}
                          </span>
                        )}
                      </div>

                      {/* Date */}
                      <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 font-semibold shrink-0">
                        {res.date}
                      </span>
                    </div>

                    {/* Title & Download Button Block: Responsive Stack on Mobile, Side-by-Side on Desktop */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pt-0.5">
                      {/* Title — Full width on mobile so long text doesn't squeeze! */}
                      <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-orange-600 transition-colors leading-snug flex-1">
                        {res.title}
                      </h3>

                      {/* Prominent Action Button — Full width on mobile for easy thumb tap, shrink-0 on desktop */}
                      <a
                        href={res.fileUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-black text-white bg-slate-900 hover:bg-orange-600 transition-all shadow-md cursor-pointer group-hover:scale-[1.02] shrink-0 w-full sm:w-auto"
                      >
                        <Download className="w-4 h-4 text-amber-400 group-hover:text-white" />
                        <span>{res.fileType && res.fileType.toUpperCase().includes('DRIVE') ? (isVi ? 'Xem Link Drive' : 'Open Drive') : (isVi ? 'Tải Về Ngay' : 'Download')}</span>
                      </a>
                    </div>
                  </div>

                  {/* Bottom Line: Optional Description & Access Note */}
                  {(hasDescription || hasAccessNote || (res.tags && res.tags.length > 0)) && (
                    <div className="pt-2.5 border-t border-slate-100 space-y-2 text-xs sm:text-sm text-slate-700 font-medium">
                      {hasDescription && (
                        <p className="line-clamp-2 text-xs sm:text-sm leading-relaxed text-slate-600 font-medium">
                          {res.description}
                        </p>
                      )}

                      {hasAccessNote && (
                        <div className="p-2 rounded-xl bg-orange-50 border border-orange-200 text-xs text-orange-950 font-medium flex items-start gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />
                          <span><strong>Ghi chú:</strong> {res.accessNote}</span>
                        </div>
                      )}

                      {res.tags && res.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {res.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="p-8 bg-white rounded-2xl border-2 border-slate-900 text-center space-y-2">
            <FolderDown className="w-8 h-8 text-slate-400 mx-auto animate-bounce" />
            <h4 className="text-base font-extrabold text-slate-800">Chưa tìm thấy tài liệu phù hợp!</h4>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-orange-600 text-white font-bold text-xs shadow-md cursor-pointer hover:bg-orange-500 transition-all inline-block"
            >
              Xem Tất Cả Tài Liệu
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
