"use client";

import { useEffect, useState } from "react";
import { ClockIcon } from "@heroicons/react/24/outline";

export default function RemainingTodayCard() {
  const [remainingToday, setRemainingToday] = useState(50);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const stored = localStorage.getItem("contactLimit");

    let remaining = 50;
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.date === today) {
        remaining = Math.max(0, 50 - parsed.count);
      }
    }

    setRemainingToday(remaining);
  }, []);

  const percentage = (remainingToday / 50) * 100;
  const isLow = remainingToday <= 10;

  return (
    <div className={`group relative overflow-hidden rounded-2xl p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 ${
      isLow 
        ? "bg-gradient-to-br from-amber-500 to-orange-500 shadow-amber-500/25 hover:shadow-2xl hover:shadow-amber-500/40"
        : "bg-gradient-to-br from-purple-500 to-pink-500 shadow-purple-500/25 hover:shadow-2xl hover:shadow-purple-500/40"
    }`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <ClockIcon className="h-6 w-6 text-white" />
          </div>
        </div>
        <p className={`text-sm font-medium mb-1 ${isLow ? "text-amber-100" : "text-purple-100"}`}>
          Remaining Today
        </p>
        <h2 className="text-4xl font-bold text-white mb-3">{remainingToday}</h2>
        <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isLow ? "bg-white" : "bg-white"
            }`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

