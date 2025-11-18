// frontend/src/components/RatingModal.tsx
import { useEffect, useState } from "react";
import { submitRating } from "../services/storeService";
import useAuth from "../hooks/useAuth";
import axios from "axios";

type Props = {
  storeId: string;
  initialRating?: number | null;
  initialComment?: string | null;
  onClose: () => void;
  onSaved: () => void;
};

export default function RatingModal({ storeId, initialRating = null, initialComment = "", onClose, onSaved }: Props) {
  const { token } = useAuth();
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
      alert("Please login to rate.");
      return;
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      alert("Please select a rating between 1 and 5.");
      return;
    }
    setSaving(true);
    try {
      await submitRating(storeId, { rating, comment: comment || undefined });
      onSaved();
      onClose();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        // axios error likely contains server response
        alert(err.response?.data?.error || "Failed to submit rating");
      } else {
        console.error("Unexpected error submitting rating:", err);
        alert("Failed to submit rating");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h3 className="text-lg font-semibold mb-3">Rate this store</h3>

        <div className="flex items-center gap-2 mb-3">
          {[1,2,3,4,5].map((i) => (
            <button
              key={i}
              onClick={() => setRating(i)}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(0)}
              className="text-2xl leading-none"
              aria-label={`Rate ${i} star`}
              style={{ background: "transparent", border: "none", cursor: "pointer" }}
            >
              <span style={{ color: (hover || rating) >= i ? "#FFD166" : "#CCCCCC" }}>
                ★
              </span>
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
          <button onClick={onClose} className="px-3 py-2 rounded border">Cancel</button>
          <button onClick={handleSubmit} disabled={saving} className="px-3 py-2 rounded bg-green-600 text-white">
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}