"use client";

import { useCallback, useEffect, useState } from "react";
import { FeedbackForm } from "@/components/feedback/FeedbackForm";
import { FeedbackList } from "@/components/feedback/FeedbackList";

interface FeedbackEntry {
  id: string;
  name: string;
  email: string;
  rating: number;
  message: string;
  createdAt: string;
}

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<FeedbackEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchFeedbacks = useCallback(async () => {
    try {
      const res = await fetch("/api/feedback");
      const data = await res.json();
      setFeedbacks(data);
    } catch {
      // silently ignore fetch errors
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const handleSuccess = async () => {
    setSuccessMessage("Thank you! Your feedback has been submitted.");
    await fetchFeedbacks();
    setTimeout(() => setSuccessMessage(""), 4000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Feedback</h1>
          <p className="mt-2 text-muted-foreground">We&apos;d love to hear what you think.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-5">Share Your Thoughts</h2>

            {successMessage && (
              <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded p-3">
                {successMessage}
              </div>
            )}

            <FeedbackForm onSuccess={handleSuccess} />
          </div>

          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-5">Community Feedback</h2>

            {loading ? (
              <div className="text-center py-12 text-muted-foreground text-sm">Loading...</div>
            ) : (
              <FeedbackList feedbacks={feedbacks} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
