import "./globals.css";
import React from "react";
import { AppProviders } from "@/src/app-providers";

export const metadata = {
  title: "ArtSync Expo - On-chain Exhibition Check-in",
  description: "FHE-privacy on-chain exhibition check-in and NFT passes",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}


