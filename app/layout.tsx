import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "Ebookin Aja — Your Premium Reading Platform",
  description: "Browse, read, and manage your ebook library with Ebookin Aja. A premium dark reading experience with rose accents.",
  keywords: ["ebook", "reading", "library", "dark mode", "premium reader"],
  authors: [{ name: "Ebookin Aja Team" }],
  openGraph: {
    title: "Ebookin Aja — Your Premium Reading Platform",
    description: "Browse, read, and manage your ebook library with Ebookin Aja.",
    url: "https://ebookin-aja.vercel.app",
    siteName: "Ebookin Aja",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ebookin Aja Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ebookin Aja — Your Premium Reading Platform",
    description: "Browse, read, and manage your ebook library with Ebookin Aja.",
    images: ["/og-image.png"],
  },
};

import { Agentation } from "agentation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  if (theme === 'light') {
                    document.documentElement.setAttribute('data-theme', 'light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning className="font-body antialiased" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}>
        <AuthProvider>{children}</AuthProvider>
        {process.env.NODE_ENV === "development" && <Agentation />}
      </body>
    </html>
  );
}
