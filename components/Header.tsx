"use client";

import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";

interface HeaderProps {
    user: User;
}

export default function Header({ user }: HeaderProps) {
    const router = useRouter();

    const handleSignOut = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    };

    const avatarUrl = user.user_metadata?.avatar_url;
    const displayName =
        user.user_metadata?.full_name || user.email || "User";

    return (
        <header className="sticky top-0 z-50 w-full bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
            <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20">
                        <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-lg font-semibold text-white tracking-tight">
                        Smart Bookmark
                    </h1>
                </div>

                {/* User info + Sign out */}
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-3">
                        {avatarUrl && (
                            <Image
                                src={avatarUrl}
                                alt="Avatar"
                                width={32}
                                height={32}
                                className="rounded-full ring-2 ring-white/10"
                            />
                        )}
                        <span className="text-sm text-gray-300 font-medium">
                            {displayName}
                        </span>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-4 py-2 transition-all duration-200 cursor-pointer"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                            />
                        </svg>
                        Sign Out
                    </button>
                </div>
            </div>
        </header>
    );
}
