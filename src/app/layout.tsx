import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NGO OS — AI Humanitarian Command Center",
  description:
    "An AI-powered intelligence dashboard for humanitarian organizations. Upload field data, receive NLP-driven crisis extraction, resource matching, and impact tracking with real-time geospatial visualization.",
  keywords: [
    "NGO",
    "humanitarian",
    "AI",
    "decision system",
    "crisis response",
    "impact tracking",
    "resource matching",
    "GIS",
    "command center",
  ],
  authors: [{ name: "NGO OS Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Leaflet CSS */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        {/* Inter Font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen bg-ngo-dark-950 bg-grid-pattern">
        {children}
      </body>
    </html>
  );
}
