import "./globals.css";
import { Toaster } from "sonner";
import { Mona_Sans } from "next/font/google";
import type { Metadata } from "next";
import { NavBarDemo } from "@/components/ui/demo-navbar"; // ✅ Tubelight NavBar Demo

const monaSans = Mona_Sans({
    variable: "--font-mona-sans",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "PrepWise",
    description: "An AI-powered platform for preparing for mock interviews",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
        <body className={`${monaSans.className} antialiased pattern`}>
        {/* ✅ Tubelight NavBar added globally */}
        
        {children}
        <Toaster />
        </body>
        </html>
    );
}
