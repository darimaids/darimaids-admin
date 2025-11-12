import type { Metadata } from "next";
import { Almarai } from "next/font/google";
import "./globals.css";

// components
import { Toaster } from "@/components/ui/sonner";

// util
import { ThemeProvider } from "@/utils/theme-provider";

// provider
import ReactQueryClientProvider from "@/provider/ReactQueryClientProvider";

const almarai = Almarai({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "700", "800"],
  variable: "--font-almarai",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Darimaids",
  description:
    "Professional Cleaning Services | Book expert home cleaning in minutes — quick, safe, and affordable.",
  icons: {
    icon: "/darimaid.svg",
    shortcut: "/darimaid.svg",
    apple: "/darimaid.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${almarai.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ReactQueryClientProvider>
            {children}
            <Toaster position="top-center" richColors />
          </ReactQueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
