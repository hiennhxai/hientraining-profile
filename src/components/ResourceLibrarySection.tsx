import { useState, useEffect, useMemo } from 'react';
import { Language, ResourceItem, ResourceCategory, ResourceFileType } from '../types';
import { getAdminData } from '../data/adminStore';
import { translations } from '../data/translations';
import { EditableWrapper } from './EditableWrapper';
import { 
  FolderDown, FileText, Table, FileArchive, HardDrive, ExternalLink, 
  Download, ArrowUpDown, Sparkles, Clock, Filter, Lock, CheckCircle2, FileCode, Search
} from 'lucide-react';

interface ResourceLibrarySectionProps {
  lang: Language;
  isEditActive?: boolean;
  onEditField?: (fieldKey: string, fieldLabel: string, currentValue: string) => void;
}

const RESOURCE_CATEGORY_LIST: { id: 'all' | ResourceCategory; labelVi: string; labelEn: string }[] = [
  { id: 'all', labelVi: 'Tất Cả Tài Liệu', labelEn: 'All Resources' },
  { id: 'script', labelVi: 'Kịch Bản Livestream', labelEn: 'Scripts & Speech' },
  { id: 'template', labelVi: 'Bảng Tính & Template', labelEn: 'Templates & Sheets' },
  { id: 'ebook', labelVi: 'Ebook & Giáo Trình', labelEn: 'Ebooks & Guides' },
  { id: 'software', labelVi: 'Phần Mềm & Preset', labelEn: 'Software & Presets' },
  { id: 'setup_guide', labelVi: 'Checklist & Studio Setup', labelEn: 'Checklist & Setup' },
];

const getFileTypeBadge = (fileType: ResourceFileType) => {
  switch (fileType) {
    case 'PDF':
      return { label: 'PDF DOCUMENT', bg: 'bg-red-50 text-red-600 border-red-200', icon: FileText };
    case 'DOCX':
      return { label: 'WORD DOCX', bg: 'bg-blue-50 text-blue-600 border-blue-200', icon: FileCode };
    case 'XLSX':
      return { label: 'EXCEL SHEET', bg: 'bg-emerald-50 text-emerald-600 border-emerald-200', icon: Table };
    case 'DRIVE':
      return { label: 'GOOGLE DRIVE', bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: HardDrive };
    case 'ZIP':
      return { label: 'ZIP ARCHIVE', bg: 'bg-purple-50 text-purple-600 border-purple-200', icon: FileArchive };
    default:
      return { label: 'LINK DOWNLOAD', bg: 'bg-slate-100 text-slate-700 border-slate-200', icon: ExternalLink };
  }
};

export function ResourceLibrarySection({ lang, isEditActive = false, onEditField }: ResourceLibrarySectionProps) {
  const [resources, setResources] = useState<ResourceItem[]>(getAdminData().resources || []);
  const [selectedCategory, setSelectedCategory] = useState<'all' | ResourceCategory>('all');
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
      const cat = res.cat || 'template';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [resources]);

  // Only categories with count > 0
  const activeCategories = useMemo(() => {
    return RESOURCE_CATEGORY_LIST.filter((cat) => {
      if (cat.id === 'all') return true;
      const count = categoryCounts[cat.id] || 0;
      return count > 0;
    });
  }, [categoryCounts]);

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
          r.description.toLowerCase().includes(q) ||
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
    <section id="resources" className="py-12 sm:py-16 bg-white relative border-b border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold text-orange-600 bg-orange-50 border border-orange-200 uppercase tracking-wider flex items-center gap-1">
                <FolderDown className="w-3 h-3 text-orange-600" />
                <span>KHO TÀI LIỆU HỌC VIÊN</span>
              </span>
            </div>

            <EditableWrapper
              isEditActive={isEditActive}
              label="Sửa Tiêu Đề Kho Tài Liệu"
              onEdit={() => triggerEdit('resourceTitle', 'Tiêu Đề Kho Tài Liệu', 'Tài Liệu & Biểu Mẫu Thực Chiến')}
            >
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {isVi ? 'Tài Liệu & Biểu Mẫu Thực Chiến' : 'Practical Resources & Templates'}
              </h2>
            </EditableWrapper>

            <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed">
              {isVi 
                ? 'Hệ thống Ebook, Kịch bản Livestream chốt đơn, Bảng tính Ánh sáng Studio & Preset OBS miễn phí dành cho học viên và thương hiệu.'
                : 'Free Ebooks, Livestream Scripts, Studio Lighting Calculators & OBS Presets for trainees & brands.'}
            </p>
          </div>

          {/* Sort Order Selector & Search Input */}
          <div className="flex flex-wrap items-center gap-2 shrink-0 self-start md:self-auto">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={isVi ? "Tìm tài liệu..." : "Search resources..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 w-36 sm:w-44 transition-all"
              />
            </div>

            {/* Sort Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <span className="text-[11px] font-mono font-bold text-slate-500 pl-2 flex items-center gap-1">
                <ArrowUpDown className="w-3 h-3 text-slate-400" />
              </span>

              <button
                type="button"
                onClick={() => setSortOrder('newest')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  sortOrder === 'newest'
                    ? 'bg-slate-900 text-amber-400 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Mới Nhất</span>
              </button>

              <button
                type="button"
                onClick={() => setSortOrder('oldest')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  sortOrder === 'oldest'
                    ? 'bg-slate-900 text-amber-400 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Cũ Nhất</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Tabs (Count > 0 only) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Filter className="w-3 h-3 text-orange-600" />
              <span>DANH MỤC TÀI LIỆU</span>
            </span>

            {selectedCategory !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className="text-[11px] font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
              >
                <span>Xem Tất Cả</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1">
            {activeCategories.map((cat) => {
              const count = categoryCounts[cat.id] || 0;
              const isActive = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-0.5 border ${
                    isActive
                      ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-orange-400 hover:bg-orange-50/40'
                  }`}
                >
                  <span>{isVi ? cat.labelVi : cat.labelEn}</span>
                  {/* Superscript Count */}
                  <sup className={`font-mono text-[9px] font-black leading-none ml-0.5 ${
                    isActive ? 'text-amber-300' : 'text-orange-600'
                  }`}>
                    ({count})
                  </sup>
                </button>
              );
            })}
          </div>
        </div>

        {/* Resource Items Grid */}
        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 pt-2">
            {filteredResources.map((res) => {
              const badge = getFileTypeBadge(res.fileType);
              const BadgeIcon = badge.icon;

              return (
                <div
                  key={res.id}
                  className="rounded-2xl bg-slate-50/80 border border-slate-200/90 hover:border-orange-400 transition-all p-5 flex flex-col justify-between space-y-4 group hover:bg-white hover:shadow-lg"
                >
                  <div className="space-y-2.5">
                    {/* Header Row: File Badge & Date */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-md border font-mono text-[9px] font-extrabold flex items-center gap-1 ${badge.bg}`}>
                          <BadgeIcon className="w-3 h-3" />
                          <span>{badge.label}</span>
                        </span>

                        {res.fileSize && (
                          <span className="text-[10px] font-mono font-semibold text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
                            {res.fileSize}
                          </span>
                        )}
                      </div>

                      <span className="text-[10px] font-mono text-slate-400 font-semibold">
                        {res.date}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-orange-600 transition-colors leading-snug">
                      {res.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {res.description}
                    </p>

                    {/* Access Note / Password Note */}
                    {res.accessNote && (
                      <div className="p-2.5 rounded-xl bg-orange-50/70 border border-orange-100 text-[11px] text-orange-950 font-medium flex items-start gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />
                        <span><strong>Ghi chú:</strong> {res.accessNote}</span>
                      </div>
                    )}

                    {/* Tags */}
                    {res.tags && res.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {res.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[9px] font-mono font-semibold text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Download / Action Button */}
                  <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-500 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{isVi ? 'File Đã Kiểm Duyệt An Toàn' : 'Verified Safe Download'}</span>
                    </span>

                    <a
                      href={res.fileUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold text-white bg-slate-900 hover:bg-orange-600 transition-all shadow-xs cursor-pointer group-hover:scale-[1.02]"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-400 group-hover:text-white" />
                      <span>{res.fileType === 'DRIVE' ? (isVi ? 'Truy Cập Drive' : 'Open Drive') : (isVi ? 'Tải Về File' : 'Download File')}</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
            <FolderDown className="w-8 h-8 text-slate-300 mx-auto animate-bounce" />
            <h4 className="text-sm font-extrabold text-slate-800">Chưa tìm thấy tài liệu phù hợp!</h4>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-orange-600 text-white font-bold text-xs shadow-xs cursor-pointer hover:bg-orange-500 transition-all inline-block"
            >
              Xem Tất Cả Tài Liệu
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
