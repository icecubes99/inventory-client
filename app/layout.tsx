import type { Metadata } from "next";
import "./globals.css";
import { ReactQueryClientProvider } from "@/client/react-query/react-query";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Inventory Management System",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryClientProvider>
      <html lang="en">
        <body
          className={`antialiased`}
        >
          <Toaster />
          {children}
        </body>
      </html>
    </ReactQueryClientProvider>
  );
}
