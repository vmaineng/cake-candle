"use client";

import { useState } from "react";
import { AccomplishmentCategory } from "@/types";

const CATEGORIES: {
  value: AccomplishmentCategory;
  label: string;
  emoji: string;
}[] = [
  { value: "career", label: "Career", emoji: "💼" },
  { value: "education", label: "Education", emoji: "🎓" },
  { value: "fitness", label: "Fitness", emoji: "💪" },
  { value: "personal", label: "Personal", emoji: "🌟" },
  { value: "creative", label: "Creative", emoji: "🎨" },
  { value: "financial", label: "Financial", emoji: "💰" },
  { value: "relationship", label: "Relationship", emoji: "❤️" },
  { value: "travel", label: "Travel", emoji: "✈️" },
  { value: "health", label: "Health", emoji: "🌿" },
  { value: "other", label: "Other", emoji: "✨" },
];

interface AccomplishmentFormProps {
  onSubmit: (text: string, category: AccomplishmentCategory) => void;
}

export default function AddAccomplishmentForm({
  onSubmit,
}: AccomplishmentFormProps) {
  const [text, setText] = useState("");
  const [category, setCategory] = useState<AccomplishmentCategory>("personal");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      onSubmit(text, category);
      setText("");
      setIsSubmitting(false);
    }, 300);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What did you accomplish? 🎯
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Example: Ran my first 5K race today! 🏃‍♂️"
          className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
          maxLength={200}
          disabled={isSubmitting}
        />
        <div className="text-sm text-gray-500 mt-1">
          {text.length}/200 characters • Be specific and proud!
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category 📂
        </label>
        <div className="grid grid-cols-5 gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setCategory(cat.value)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${
                category === cat.value
                  ? "bg-pink-100 border-pink-500 text-pink-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
              disabled={isSubmitting}
            >
              <span className="text-lg">{cat.emoji}</span>
              <span className="text-xs mt-1">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Need inspiration? Try these:
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            "Finished a book I've been reading",
            "Woke up early for a week straight",
            "Learned a new recipe and cooked it",
            "Helped a friend with a project",
            "Organized my workspace",
            "Went for a morning walk",
            "Saved money this month",
            "Called a family member",
          ].map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => setText(suggestion)}
              className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              disabled={isSubmitting}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={!text.trim() || isSubmitting}
        className={`
          w-full py-3 px-4 rounded-lg font-bold text-lg transition-all duration-300
          ${
            !text.trim() || isSubmitting
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-pink-500 to-orange-500 text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          }
        `}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Lighting your candle...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            🎉 Add to Cake & Light Candle!
          </span>
        )}
      </button>
    </form>
  );
}
