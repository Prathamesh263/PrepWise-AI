"use client"

import { Home, User, Briefcase, FileText } from 'lucide-react'
import { NavBar } from "@/components/ui/tubelight-navbar"


export function NavBarDemo() {
    const navItems = [
        { name: 'Home', url: '/', icon: Home },
        { name: 'Your Interview', url: '/interview', icon: User },
        { name: 'Feedback', url: '/feedback', icon: FileText },
        { name: 'Sign-out', url: '/', icon: Briefcase }

    ]

    return <NavBar items={navItems} />
}
