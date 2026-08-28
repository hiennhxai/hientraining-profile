import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Bell, X } from 'lucide-react';

interface ProofData {
  name: string;
  action: string;
  timeAgo: string;
}

export function LiveSocialProof() {
  const [proof, setProof] = useState<ProofData | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchLatestLead = async () => {
      try {
        // Fetch the most recent lead from Supabase
        const { data, error } = await supabase
          .from('leads')
          .select('name, created_at, source')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error || !data) return;

        // Check if the lead is within the last 24 hours
        const leadDate = new Date(data.created_at);
        const now = new Date();
        const diffMs = now.getTime() - leadDate.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);

        if (diffHours <= 24 && mounted) {
          // Format name (e.g., "Nguyen Van A" -> "A Nguyễn")
          const nameParts = data.name.trim().split(' ');
          const shortName = nameParts.length > 1 
            ? `${nameParts[nameParts.length - 1]} ${nameParts[0][0]}.` 
            : data.name;

          let actionStr = 'vừa đăng ký tư vấn';
          if (data.source.includes('Ebook') || data.source.includes('Tài Liệu')) {
            actionStr = 'vừa tải tài liệu miễn phí';
          } else if (data.source.includes('Khóa học')) {
            actionStr = 'vừa đăng ký khóa học';
          }

          let timeStr = 'vừa xong';
          if (diffHours >= 1) {
            timeStr = `${Math.floor(diffHours)} giờ trước`;
          } else if (diffMs >= 60000) {
            timeStr = `${Math.floor(diffMs / 60000)} phút trước`;
          }

          setProof({
            name: shortName,
            action: actionStr,
            timeAgo: timeStr
          });

          // Show the popup after a slight delay
          setTimeout(() => {
            if (mounted) setIsVisible(true);
          }, 3000);

          // Hide it automatically after 8 seconds
          setTimeout(() => {
            if (mounted) setIsVisible(false);
          }, 11000);
        }
      } catch (err) {
        console.error('Social proof fetch error:', err);
      }
    };

    fetchLatestLead();

    // Optionally set up real-time subscription here
    const channel = supabase
      .channel('public:leads')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'leads' }, (payload) => {
        if (!mounted) return;
        const newLead = payload.new;
        const nameParts = newLead.name.trim().split(' ');
        const shortName = nameParts.length > 1 
          ? `${nameParts[nameParts.length - 1]} ${nameParts[0][0]}.` 
          : newLead.name;
        
        let actionStr = 'vừa đăng ký tư vấn';
        if (newLead.source && newLead.source.includes('Ebook')) actionStr = 'vừa tải tài liệu';
        
        setProof({
          name: shortName,
          action: actionStr,
          timeAgo: 'vừa xong'
        });
        
        setIsVisible(true);
        setTimeout(() => setIsVisible(false), 8000);
      })
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  if (!proof) return null;

  return (
    <div 
      className={`fixed bottom-6 left-6 z-[150] transition-all duration-700 ease-out pointer-events-none ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
    >
      <div className="bg-white pointer-events-auto rounded-xl p-3 sm:p-4 shadow-xl border border-slate-200 flex items-start gap-3 max-w-[280px] sm:max-w-xs cursor-pointer hover:scale-105 transition-transform" onClick={() => setIsVisible(false)}>
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
          <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 animate-pulse" />
        </div>
        <div className="flex-1 min-w-0 pr-4">
          <p className="text-xs sm:text-sm text-slate-800 font-medium leading-snug">
            <span className="font-bold text-orange-600">{proof.name}</span> {proof.action}
          </p>
          <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">{proof.timeAgo}</p>
        </div>
        <button aria-label="Action button" className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 transition-colors">
          <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
}

