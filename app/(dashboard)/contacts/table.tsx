"use client";

import { useEffect, useState } from "react";
import UpgradeModal from "@/components/UpgradeModal";

type Props = {
  rows: { [key: string]: string }[];
};

export default function ContactsTable({ rows }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const [state, setState] = useState<{
    allowedRows: { [key: string]: string }[];
    limitReached: boolean;
  }>({
    allowedRows: [],
    limitReached: false,
  });

  useEffect(() => {
    if (initialized) return; // Prevent re-running on every render
    
    const today = new Date().toISOString().split("T")[0];
    const stored = localStorage.getItem("contactLimit");
    const modalShown = localStorage.getItem("modalShownToday");
    const contactsViewedToday = localStorage.getItem("contactsViewedToday");

    let count = 0;

    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.date === today) {
        count = parsed.count;
      }
    }

    // Check if we've already viewed contacts today (to prevent double counting)
    let alreadyCounted = false;
    if (contactsViewedToday === today) {
      alreadyCounted = true;
    }

    // CAS 1 — Limite atteinte ou dépassée
    if (count >= 50) {
      setState({
        allowedRows: [],
        limitReached: true,
      });

      // Show modal immediately when visiting contacts page with limit reached
      setModalOpen(true);
      setInitialized(true);
      return;
    }

    // CAS 2 — Limite pas encore atteinte
    const remaining = 50 - count;
    const visibleRows = rows.slice(0, Math.min(remaining, rows.length));
    const rowsToShow = visibleRows.length;

    setState({
      allowedRows: visibleRows,
      limitReached: false,
    });

    // Only increment count once per day when contacts are first viewed
    if (!alreadyCounted && rowsToShow > 0) {
      const newCount = Math.min(count + rowsToShow, 50);
      
      localStorage.setItem(
        "contactLimit",
        JSON.stringify({
          date: today,
          count: newCount,
        })
      );
      
      localStorage.setItem("contactsViewedToday", today);

      // If we just hit exactly 50, show the modal
      if (newCount >= 50 && modalShown !== today) {
        setModalOpen(true);
        localStorage.setItem("modalShownToday", today);
        setState({
          allowedRows: [],
          limitReached: true,
        });
      }
    }

    setInitialized(true);
  }, [rows, initialized]);

  // CAS 1 — Limite dépassée
  if (state.limitReached) {
    return (
      <>
        {/* Page content - visible behind modal */}
        <div className="flex justify-center mt-10 animate-fadeIn">
          <div className="max-w-2xl w-full p-8 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-800/50 rounded-2xl shadow-xl backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                <span className="text-2xl">🚫</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-2">
                  Daily Limit Reached
                </h2>
                <p className="text-red-600 dark:text-red-400 text-base mb-4">
                  You have reached your daily limit of <strong>50 contacts</strong>.
                </p>
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-6">
                  Upgrade your account to unlock unlimited access and continue viewing contacts.
                </p>
                <button
                  onClick={() => setModalOpen(true)}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 font-medium"
                >
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL - Show when limit is reached, overlays the page */}
        <UpgradeModal 
          open={modalOpen} 
          onClose={() => {
            setModalOpen(false);
          }} 
        />
      </>
    );
  }

 // CAS 2 — Affichage normal
return (
  <>
    {/* Vérification : s'il n'y a pas encore de lignes, on attend */}
    {state.allowedRows.length === 0 ? (
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-12 border border-gray-200/50 dark:border-gray-700/50 shadow-lg text-center animate-pulse">
        <p className="text-gray-500 dark:text-gray-400">Loading contacts...</p>
      </div>
    ) : (
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg overflow-hidden animate-fadeIn">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-800 dark:to-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                {Object.keys(state.allowedRows[0]).map((col) => (
                  <th
                    key={col}
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
              {state.allowedRows.map((row, rowIndex) => (
                <tr 
                  key={rowIndex} 
                  className="bg-white/50 dark:bg-gray-900/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors duration-150"
                >
                  {Object.values(row).map((value, colIndex) => (
                    <td 
                      key={colIndex} 
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                    >
                      {value || <span className="text-gray-400">—</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 border-t border-gray-200/50 dark:border-gray-700/50">
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Showing <span className="font-bold text-blue-600 dark:text-blue-400">{state.allowedRows.length}</span> / <span className="font-bold">50</span> contacts allowed today
          </p>
        </div>
      </div>
    )}
  </>
);

}
