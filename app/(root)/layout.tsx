export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { isAuthenticated, signOut } from "@/lib/actions/auth.action";

const Layout = async ({ children }: { children: ReactNode }) => {
    const isUserAuthenticated = await isAuthenticated();

    if (!isUserAuthenticated) {
        console.log('not authenticated');
        redirect('/sign-in');
    }

    return (
        <div className="root-layout">
            <nav className="sticky top-0 z-50 backdrop-blur-md bg-background/80 flex justify-between items-center w-full px-8 py-4 shadow-sm transition-all duration-300 hover:shadow-md">
                <Link href="/" className="flex items-center gap-3 transition-transform duration-300 hover:scale-105">
                    <Image src="/logo.svg" alt="MockMate Logo" width={38} height={32} className="object-contain" />
                    <h2 className="text-primary-100 text-xl md:text-2xl font-bold">PrepWise</h2>
                </Link>
                <form action={signOut}>
                    <button 
                        type="submit" 
                        className="text-primary-100 hover:text-primary-200 transition-all duration-300 hover:scale-105 active:scale-95 px-4 py-2 rounded-full hover:bg-dark-200/50"
                    >
                        Sign Out
                    </button>
                </form>
            </nav>

            {children}
        </div>
    );
};

export default Layout;
