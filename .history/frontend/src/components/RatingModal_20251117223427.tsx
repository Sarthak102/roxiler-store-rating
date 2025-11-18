// frontend/src/components/RatingModal.tsx
import React, { useState } from "react";
import Button from "./ui/button";

type Props = {
  open: boolean;
  initial?: number | null;
  onClose: () => void;
  onSave: (rating: number) => Promise<void> | void;
};

export default function RatingModal({
  open,
  initial = null,
  onClose,
  onSave,
}: Props) {
  const [rating, setRating] = useState<number>(initial ?? 0);
  const [saving, setSaving] = useState(false);

  React.useEffect(() => setRating(initial ?? 0), [initial, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h3 className="text-lg font-semibold mb-3">Rate this store</h3>

        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((v) => (
            <button
              key={v}
              onClick={() => setRating(v)}
              className={`px-3 py-2 rounded ${
                v <= rating ? "bg-yellow-300" : "bg-gray-100"
              }`}
            >
              {v}★
            </button>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            onClick={async () => {
              setSaving(true);
              try {
                await onSave(rating);
                onClose();
              } catch (err) {
                // let caller handle errors; simple fallback:
                alert("Failed to save rating");
              } finally {
                setSaving(false);
              }
            }}
            disabled={saving || rating === 0}
          >
            {saving ? "Saving..." : initial ? "Update rating" : "Save rating"}
          </Button>
        </div>
      </div>
    </div>
  );
}
