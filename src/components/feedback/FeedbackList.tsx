"use client";

interface FeedbackEntry {
  id: string;
  name: string;
  email: string;
  rating: number;
  message: string;
  createdAt: string;
}

interface FeedbackListProps {
  feedbacks: FeedbackEntry[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-lg ${star <= rating ? "text-yellow-400" : "text-gray-200"}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function FeedbackList({ feedbacks }: FeedbackListProps) {
  if (feedbacks.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-4xl mb-3">💬</p>
        <p className="text-sm">No feedback yet. Be the first to share!</p>
      </div>
    );
  }

  const avgRating = feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground border-b pb-3">
        <span>
          {feedbacks.length} {feedbacks.length === 1 ? "response" : "responses"}
        </span>
        <span className="flex items-center gap-1">
          <span className="text-yellow-400">★</span>
          {avgRating.toFixed(1)} avg
        </span>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
        {feedbacks.map((fb) => (
          <div key={fb.id} className="rounded-lg border bg-card p-4 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium text-sm">{fb.name}</p>
                <p className="text-xs text-muted-foreground">{fb.email}</p>
              </div>
              <div className="text-right shrink-0">
                <StarRating rating={fb.rating} />
                <p className="text-xs text-muted-foreground mt-0.5">{timeAgo(fb.createdAt)}</p>
              </div>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">{fb.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
