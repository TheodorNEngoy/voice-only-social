import "../styles/globals.css";
import type { ReactNode } from "react";
import { Metadata } from "next";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const metadata: Metadata = {
  title: "VoxOnly",
  description: "Voice-only social network with accessibility-first transcripts"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-white">
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </body>
    </html>
  );
}
