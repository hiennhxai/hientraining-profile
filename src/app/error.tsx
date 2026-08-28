"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center border border-slate-100">
        <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10" />
        </div>
        
        <h2 className="text-2xl font-black text-slate-900 mb-3">
          Rất tiếc! Có lỗi xảy ra.
        </h2>
        
        <p className="text-slate-600 mb-8 text-sm leading-relaxed">
          Hệ thống đang gặp một chút gián đoạn kết nối. Xin lỗi bạn vì sự bất tiện này.
          Vui lòng thử lại sau vài giây nhé!
        </p>

        <button
          onClick={() => reset()}
          className="w-full flex items-center justify-center gap-2 bg-orange-600 text-white font-bold py-3.5 px-6 rounded-xl hover:bg-orange-700 transition-all active:scale-95 shadow-lg shadow-orange-600/20"
        >
          <RefreshCcw className="w-5 h-5" />
          Tải Lại Trang
        </button>
      </div>
    </div>
  );
}
