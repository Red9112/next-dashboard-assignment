"use client";

import { useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function UpgradeModal({ open, onClose }: Props) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black/60 dark:bg-black/70 backdrop-blur-md z-[9999] animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl w-full max-w-md mx-4 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 animate-scaleIn relative z-[10000]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">🚀</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Upgrade Required
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Unlock unlimited access</p>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            You have reached your daily limit of <strong className="text-gray-900 dark:text-white">50 contacts</strong>.
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            Upgrade your account to unlock unlimited access and explore all your contacts without restriction.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200 font-medium"
          >
            Cancel
          </button>

          <button
            onClick={() => alert("Premium feature coming soon")}
            className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40"
          >
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
}
