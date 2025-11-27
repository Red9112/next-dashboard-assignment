import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import ThemeProvider from "./theme-provider";

export const metadata = {
  title: "Dashboard Agencies",
  description: "Assignment dashboard with Clerk authentication",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  try {
                    const theme = localStorage.getItem('dashboard-theme');
                    if (theme === 'dark') {
                      document.documentElement.classList.add('dark');
                    } else {
                      document.documentElement.classList.remove('dark');
                    }
                  } catch (e) {}
                })();
              `,
            }}
          />
        </head>
        <body suppressHydrationWarning className="transition-colors bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
