import fs from "fs";
import path from "path";
import Papa from "papaparse";
import {
  BuildingOfficeIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import RemainingTodayCard from "./RemainingTodayCard";

export default function DashboardPage() {
  // --- Lire le CSV des agences ---
  const agenciesPath = path.join(process.cwd(), "data", "agencies_agency_rows.csv");
  const agenciesData = fs.readFileSync(agenciesPath, "utf8");
  const { data: agencies } = Papa.parse(agenciesData, {
    header: true,
    skipEmptyLines: true,
  });

  // --- Lire le CSV des contacts ---
  const contactsPath = path.join(
    process.cwd(),
    "data",
    "contacts_contact_rows.csv"
  );
  const contactsData = fs.readFileSync(contactsPath, "utf8");
  const { data: contacts } = Papa.parse(contactsData, {
    header: true,
    skipEmptyLines: true,
  });

  const totalAgencies = agencies.length;
  const totalContacts = contacts.length;

  // Fake daily activity data
  const dailyActivity = [
    { day: "Mon", count: 14 },
    { day: "Tue", count: 18 },
    { day: "Wed", count: 22 },
    { day: "Thu", count: 35 },
    { day: "Fri", count: 20 },
    { day: "Sat", count: 15 },
    { day: "Sun", count: 10 },
  ];

  // Fake recent contacts
  const recentContacts = contacts.slice(0, 5);

  // --------------------------------------------------
  // 🔥  EXTRACTEUR DE NOM ROBUSTE POUR TOUS LES CSV
  // --------------------------------------------------
  function extractName(row: any) {
    if (!row || typeof row !== "object") return "Unknown";

    const lowerKeys = Object.keys(row).reduce((acc, key) => {
      acc[key.toLowerCase()] = row[key];
      return acc;
    }, {} as Record<string, any>);

    // FULL NAME direct
    const fullNameKeys = ["fullname", "full_name", "full name", "name"];
    for (const key of fullNameKeys) {
      if (lowerKeys[key]) return String(lowerKeys[key]).trim();
    }

    // FIRST + LAST NAME combos
    const firstNameKeys = ["first_name", "firstname", "first", "given_name", "givenname", "fname"];
    const lastNameKeys = ["last_name", "lastname", "last", "surname", "lname", "family_name"];

    let first = "";
    let last = "";

    for (const key of firstNameKeys) {
      if (lowerKeys[key]) {
        first = lowerKeys[key];
        break;
      }
    }

    for (const key of lastNameKeys) {
      if (lowerKeys[key]) {
        last = lowerKeys[key];
        break;
      }
    }

    if (first || last) return `${first} ${last}`.trim();

    // If at least one non-empty string field looks like a name
    const possibleName = Object.values(row).find(
      (val) => typeof val === "string" && val.length > 2 && /^[A-Za-z]/.test(val)
    );
    if (possibleName) return possibleName;

    return "Unknown";
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-slideIn">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
        {/* CARD 1 — Agencies */}
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <BuildingOfficeIcon className="h-6 w-6 text-white" />
              </div>
            </div>
            <p className="text-blue-100 text-sm font-medium mb-1">Total Agencies</p>
            <h2 className="text-4xl font-bold text-white mb-0">{totalAgencies.toLocaleString()}</h2>
          </div>
        </div>

        {/* CARD 2 — Contacts */}
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 shadow-xl shadow-emerald-500/25 hover:shadow-2xl hover:shadow-emerald-500/40 transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <UsersIcon className="h-6 w-6 text-white" />
              </div>
            </div>
            <p className="text-emerald-100 text-sm font-medium mb-1">Total Contacts</p>
            <h2 className="text-4xl font-bold text-white mb-0">{totalContacts.toLocaleString()}</h2>
          </div>
        </div>

        {/* CARD 3 — Remaining */}
        <RemainingTodayCard />
      </div>

      {/* Charts and Lists Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* DAILY ACTIVITY */}
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 animate-fadeIn">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Daily Activity</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Contacts viewed this week</p>
            </div>
          </div>
          <div className="flex items-end justify-between gap-2 h-48">
            {dailyActivity.map((item, index) => {
              const maxCount = Math.max(...dailyActivity.map(d => d.count));
              const height = (item.count / maxCount) * 100;
              
              return (
                <div key={item.day} className="flex-1 flex flex-col items-center group">
                  <div className="relative w-full flex items-end justify-center h-full">
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-blue-500 to-blue-400 dark:from-blue-600 dark:to-blue-500 transition-all duration-300 hover:from-blue-600 hover:to-blue-500 group-hover:shadow-lg group-hover:shadow-blue-500/50"
                      style={{ height: `${height}%`, minHeight: '8px' }}
                    ></div>
                    <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-medium px-2 py-1 rounded mb-2 whitespace-nowrap">
                      {item.count} contacts
                    </div>
                  </div>
                  <p className="mt-3 text-xs font-medium text-gray-600 dark:text-gray-400">{item.day}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* RECENT CONTACTS */}
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 animate-fadeIn">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Contacts</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Last viewed contacts</p>
            </div>
          </div>
          <div className="space-y-1">
            {recentContacts.map((c, i) => {
              const name = extractName(c);
              return (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                      {name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{c.email || "No email"}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
