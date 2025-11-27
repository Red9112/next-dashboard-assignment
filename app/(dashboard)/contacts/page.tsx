import fs from "fs";
import path from "path";
import Papa from "papaparse";
import ContactsTable from "./table";

type CSVRow = { [key: string]: string };

export default function ContactsPage() {
  // Lecture CSV côté serveur
  const filePath = path.join(process.cwd(), "data", "contacts_contact_rows.csv");
  const csvData = fs.readFileSync(filePath, "utf8");

  const { data } = Papa.parse(csvData, {
    header: true,
    skipEmptyLines: true,
  });

  const rows = data as CSVRow[];
console.log("SERVER READ ROWS:", rows.length);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
          Contacts
        </h1>
        <p className="text-gray-600 dark:text-gray-400">View and manage your contact database</p>
      </div>
      <ContactsTable rows={rows} />
    </div>
  );
 

}
 
