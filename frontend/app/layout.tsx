import type { Metadata } from "next";
import "./globals.css";
import { CurrentUserProvider } from "@/components/current-user";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: { default: "E-Commerce", template: "%s | E-Commerce" },
  description: "A simple storefront for the Spring Boot E-Commerce project.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <CurrentUserProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-background focus:p-3"
          >
            Skip to content
          </a>
          <Header />
          <main
            id="main-content"
            className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10"
          >
            {children}
          </main>
          <Footer />
          <Toaster theme="light" closeButton />
        </CurrentUserProvider>
      </body>
    </html>
  );
}
