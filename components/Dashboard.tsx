"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import Header from "@/components/Header";
import AddBookmarkForm from "@/components/AddBookmarkForm";
import BookmarkList from "@/components/BookmarkList";

interface Bookmark {
    id: string;
    title: string;
    url: string;
    created_at: string;
    user_id: string;
}

export default function Dashboard({ user }: { user: User }) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch bookmarks
    const fetchBookmarks = useCallback(async () => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("bookmarks")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching bookmarks:", error);
        }
        if (data) {
            setBookmarks(data);
        }
        setLoading(false);
    }, [user.id]);

    useEffect(() => {
        fetchBookmarks();

        // Real-time subscription for cross-tab sync
        const supabase = createClient();
        const channel = supabase
            .channel("bookmarks-realtime")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "bookmarks",
                    filter: `user_id=eq.${user.id}`,
                },
                (payload) => {
                    setBookmarks((prev) => {
                        if (prev.find((b) => b.id === payload.new.id)) return prev;
                        return [payload.new as Bookmark, ...prev];
                    });
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "DELETE",
                    schema: "public",
                    table: "bookmarks",
                },
                (payload) => {
                    setBookmarks((prev) =>
                        prev.filter((b) => b.id !== payload.old.id)
                    );
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user.id, fetchBookmarks]);

    // Called after a successful insert from AddBookmarkForm
    const handleBookmarkAdded = (newBookmark: Bookmark) => {
        setBookmarks((prev) => {
            if (prev.find((b) => b.id === newBookmark.id)) return prev;
            return [newBookmark, ...prev];
        });
    };

    // Called after a successful delete from BookmarkList
    const handleBookmarkDeleted = (id: string) => {
        setBookmarks((prev) => prev.filter((b) => b.id !== id));
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f]">
            {/* Ambient background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
                <Header user={user} />

                <main className="max-w-3xl mx-auto px-6 py-8 space-y-8">
                    <AddBookmarkForm
                        userId={user.id}
                        onBookmarkAdded={handleBookmarkAdded}
                    />
                    <BookmarkList
                        bookmarks={bookmarks}
                        loading={loading}
                        onDelete={handleBookmarkDeleted}
                    />
                </main>
            </div>
        </div>
    );
}
