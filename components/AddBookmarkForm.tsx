"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Bookmark {
    id: string;
    title: string;
    url: string;
    created_at: string;
    user_id: string;
}

interface AddBookmarkFormProps {
    userId: string;
    onBookmarkAdded: (bookmark: Bookmark) => void;
}

export default function AddBookmarkForm({
    userId,
    onBookmarkAdded,
}: AddBookmarkFormProps) {
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!title.trim() || !url.trim()) {
            setError("Both title and URL are required.");
            return;
        }

        // Basic URL validation
        try {
            new URL(url.startsWith("http") ? url : `https://${url}`);
        } catch {
            setError("Please enter a valid URL.");
            return;
        }

        setLoading(true);

        const supabase = createClient();
        const finalUrl = url.startsWith("http") ? url : `https://${url}`;

        const { data, error: insertError } = await supabase
            .from("bookmarks")
            .insert({
                title: title.trim(),
                url: finalUrl,
                user_id: userId,
            })
            .select()
            .single();

        setLoading(false);

        if (insertError) {
            setError("Failed to add bookmark. Please try again.");
            console.error("Insert error:", insertError);
            return;
        }

        // Immediately update the parent's state
        if (data) {
            onBookmarkAdded(data as Bookmark);
        }

        setTitle("");
        setUrl("");
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <svg
                        className="w-5 h-5 text-indigo-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4.5v15m7.5-7.5h-15"
                        />
                    </svg>
                    Add Bookmark
                </h2>

                <div className="flex flex-col sm:flex-row gap-3">
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200"
                    />
                    <input
                        type="text"
                        placeholder="https://example.com"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] cursor-pointer whitespace-nowrap"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <svg
                                    className="w-4 h-4 animate-spin"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                Adding...
                            </span>
                        ) : (
                            "Add"
                        )}
                    </button>
                </div>

                {error && (
                    <p className="mt-3 text-sm text-red-400 flex items-center gap-1.5">
                        <svg
                            className="w-4 h-4 shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                            />
                        </svg>
                        {error}
                    </p>
                )}
            </div>
        </form>
    );
}
