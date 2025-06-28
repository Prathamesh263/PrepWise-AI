"use client"

import { AuthorCard } from "@/components/ui/content-card"

export function AuthorCardDemo() {
    return (
        <AuthorCard
            backgroundImage="https://images.unsplash.com/photo-1544077960-604201fe74bc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1651&q=80"
            author={{
                name: "Manu Arora",
                avatar: "https://ui.aceternity.com/_next/image?url=%2Fmanu.png&w=256&q=75",
                readTime: "2 min read"
            }}
            content={{
                title: "Author Card",
                description: "Card with Author avatar, complete name and time to read - most suitable for blogs."
            }}
        />
    )
}