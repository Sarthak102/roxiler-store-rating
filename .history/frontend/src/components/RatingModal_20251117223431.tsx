// frontend/src/components/RatingModal.tsx
import React, { useEffect, useState } from "react";
import Button from "./ui/button";
import { Star } from "lucide-react";
import { submitRating } from "../services/storeService";
import useAuth from "../hooks/useAuth";
import { useToast } from "../contexts/ToastContext";
import axios from "axios";

type Props = {
  storeId: string;
  initialRating?: number | null;
  initialComment?: string | null;
  onClose: () => void;
  onSaved: (saved: { rating: number; comment?: string }) => void;
};

export default function RatingModal({
  storeId,
  initialRating = null,
  initialComment = "",
  onClose,
  onSaved,
}: Props) {
  const { token } = useAuth();
  const toast = useToast();
  const [rating, setRating] = useState<number>(initialRating ?? 0);
  const [hover, setHover] = useState<number>(0);
  const [comment, setComment] = useState<string>(initialComment ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setRating(initialRating ?? 0);
    setComment(initialComment ?? "");
  }, [initialRating, initialComment]);

  const handleSubmit = async () => {
    if (!token) {
      toast.error("Please login to rate.");
      return;
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      toast.error("Please select a rating between 1 and 5.");
      return;
    }
    setSaving(true);
    try {
      await submitRating(storeId, { rating, comment: comment || undefined });
      onSaved({ rating, comment: comment || undefined });
      toast.success(initialRating ? "Rating updated" : "Rating saved");
      onClose();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.error || "Failed to submit rating");
      } else {
        toast.error("Failed to submit rating");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <h3 className="text-lg font-semibold mb-3">
          {initialRating ? "Update your rating" : "Rate this store"}
        </h3>

        <div className="flex items-center gap-2 mb-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              onClick={() => setRating(i)}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(0)}
              aria-label={`Rate ${i} star`}
              className="p-1"
            >
              <Star
                className={`w-7 h-7 ${
                  (hover || rating) >= i ? "text-yellow-400" : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Optional comment"
          className="w-full border p-2 rounded mb-4"
          rows={3}
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving..." : initialRating ? "Update" : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}
