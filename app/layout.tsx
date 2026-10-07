import type { Metadata } from "next";
import "./globals.css";
import { TelemetryProvider } from "./context/TelemetryContext";
import Sidebar from "./components/Sidebar";
import TopHeader from "./components/TopHeader";

export const metadata: Metadata = {
  title: "FrostGuard AI - Intelligent Vaccine Cold-Chain Monitoring",
  description: "Next-Generation Cold-Chain Telemetry, Predictive Anomaly Detection & GXP Compliance",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-on-surface">
        <TelemetryProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
              <TopHeader />
              <div className="flex-1 lg:ml-72 pt-16">
                {children}
              </div>
            </div>
          </div>
        </TelemetryProvider>
      </body>
    </html>
  );
}
