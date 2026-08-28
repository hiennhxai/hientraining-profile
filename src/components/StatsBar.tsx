import { useState, useEffect } from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { getAdminData } from '../data/adminStore';
import { EditableWrapper } from './EditableWrapper';

interface StatsBarProps {
  lang: Language;
  isEditActive?: boolean;
  onEditField?: (fieldKey: string, fieldLabel: string, currentValue: string) => void;
}

export function StatsBar({ lang, isEditActive = false, onEditField }: StatsBarProps) {
  const t = translations[lang];
  const [gen, setGen] = useState(getAdminData().general);

  useEffect(() => {
    const handleUpdate = () => setGen(getAdminData().general);
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

  return (
    <div className="stats border-y border-slate-200 bg-white shadow-xs py-4 relative z-10">
      <div className="stats-in max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
        
        {/* Stat 1 */}
        <div className="stat p-4 rounded-xl hover:bg-orange-50/50 transition-colors">
          <EditableWrapper
            isEditActive={isEditActive}
            label="Sửa Số Liệu 1"
            onEdit={() => triggerEdit('stat1Value', 'Số Liệu 1', gen.stat1Value || '12+')}
          >
            <b className="text-3xl sm:text-4xl font-black font-mono text-orange-600">
              {gen.stat1Value || '12+'}
            </b>
          </EditableWrapper>

          <EditableWrapper
            isEditActive={isEditActive}
            label="Sửa Nhãn 1"
            onEdit={() => triggerEdit('stat1Label', 'Nhãn Số Liệu 1', gen.stat1Label || t.s1)}
          >
            <span className="block text-xs font-semibold text-slate-600 mt-1 uppercase tracking-wider">
              {gen.stat1Label || t.s1}
            </span>
          </EditableWrapper>
        </div>

        {/* Stat 2 */}
        <div className="stat p-4 rounded-xl hover:bg-amber-50/50 transition-colors">
          <EditableWrapper
            isEditActive={isEditActive}
            label="Sửa Số Liệu 2"
            onEdit={() => triggerEdit('stat2Value', 'Số Liệu 2', gen.stat2Value || '08+')}
          >
            <b className="text-3xl sm:text-4xl font-black font-mono text-amber-600">
              {gen.stat2Value || '08+'}
            </b>
          </EditableWrapper>

          <EditableWrapper
            isEditActive={isEditActive}
            label="Sửa Nhãn 2"
            onEdit={() => triggerEdit('stat2Label', 'Nhãn Số Liệu 2', gen.stat2Label || t.s2)}
          >
            <span className="block text-xs font-semibold text-slate-600 mt-1 uppercase tracking-wider">
              {gen.stat2Label || t.s2}
            </span>
          </EditableWrapper>
        </div>

        {/* Stat 3 */}
        <div className="stat p-4 rounded-xl hover:bg-orange-50/50 transition-colors">
          <EditableWrapper
            isEditActive={isEditActive}
            label="Sửa Số Liệu 3"
            onEdit={() => triggerEdit('stat3Value', 'Số Liệu 3', gen.stat3Value || '14+')}
          >
            <b className="text-3xl sm:text-4xl font-black font-mono text-orange-600">
              {gen.stat3Value || '14+'}
            </b>
          </EditableWrapper>

          <EditableWrapper
            isEditActive={isEditActive}
            label="Sửa Nhãn 3"
            onEdit={() => triggerEdit('stat3Label', 'Nhãn Số Liệu 3', gen.stat3Label || t.s3)}
          >
            <span className="block text-xs font-semibold text-slate-600 mt-1 uppercase tracking-wider">
              {gen.stat3Label || t.s3}
            </span>
          </EditableWrapper>
        </div>

        {/* Stat 4 */}
        <div className="stat p-4 rounded-xl hover:bg-red-50/50 transition-colors">
          <EditableWrapper
            isEditActive={isEditActive}
            label="Sửa Số Liệu 4"
            onEdit={() => triggerEdit('stat4Value', 'Số Liệu 4', gen.stat4Value || '04')}
          >
            <b className="text-3xl sm:text-4xl font-black font-mono text-red-600">
              {gen.stat4Value || '04'}
            </b>
          </EditableWrapper>

          <EditableWrapper
            isEditActive={isEditActive}
            label="Sửa Nhãn 4"
            onEdit={() => triggerEdit('stat4Label', 'Nhãn Số Liệu 4', gen.stat4Label || t.s4)}
          >
            <span className="block text-xs font-semibold text-slate-600 mt-1 uppercase tracking-wider">
              {gen.stat4Label || t.s4}
            </span>
          </EditableWrapper>
        </div>

        {/* Stat 5 */}
        <div className="stat col-span-2 md:col-span-1 p-4 rounded-xl hover:bg-orange-50/50 transition-colors">
          <EditableWrapper
            isEditActive={isEditActive}
            label="Sửa Số Liệu 5"
            onEdit={() => triggerEdit('stat5Value', 'Số Liệu 5', gen.stat5Value || '500+')}
          >
            <b className="text-3xl sm:text-4xl font-black font-mono text-orange-600">
              {gen.stat5Value || '500+'}
            </b>
          </EditableWrapper>

          <EditableWrapper
            isEditActive={isEditActive}
            label="Sửa Nhãn 5"
            onEdit={() => triggerEdit('stat5Label', 'Nhãn Số Liệu 5', gen.stat5Label || t.s5)}
          >
            <span className="block text-xs font-semibold text-slate-600 mt-1 uppercase tracking-wider">
              {gen.stat5Label || t.s5}
            </span>
          </EditableWrapper>
        </div>

      </div>
    </div>
  );
}
