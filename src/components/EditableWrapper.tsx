import React from 'react';
import { Edit3, Image as ImageIcon } from 'lucide-react';

interface EditableWrapperProps {
  isEditActive: boolean;
  type?: 'text' | 'image' | 'icon';
  label?: string;
  onEdit: () => void;
  children: React.ReactNode;
  className?: string;
}

export const EditableWrapper: React.FC<EditableWrapperProps> = ({
  isEditActive,
  type = 'text',
  label = 'Chỉnh sửa',
  onEdit,
  children,
  className = '',
}) => {
  if (!isEditActive) {
    return <>{children}</>;
  }

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onEdit();
      }}
      className={`relative group/editable cursor-pointer transition-all duration-200 hover:outline-2 hover:outline-dashed hover:outline-orange-500 hover:outline-offset-2 rounded-xl ${className}`}
      title={`Nhấp để ${label}`}
    >
      {children}

      {/* Hover Floating Edit Badge */}
      <div className="absolute -top-3 -right-3 z-[105] opacity-0 group-hover/editable:opacity-100 transition-all duration-200 transform scale-90 group-hover/editable:scale-100 pointer-events-none">
        <div className="bg-orange-600 text-white text-[10px] font-mono font-bold px-2 py-1 rounded-xl shadow-lg border border-white flex items-center gap-1">
          {type === 'image' ? (
            <ImageIcon className="w-3 h-3" />
          ) : (
            <Edit3 className="w-3 h-3" />
          )}
          <span>{label}</span>
        </div>
      </div>
    </div>
  );
};
