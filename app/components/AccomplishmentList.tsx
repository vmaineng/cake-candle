"use client";

import { Accomplishment, CakeCandle } from "@/types";

interface AccomplishmentListProps {
  accomplishments: Accomplishment[];
  candles: CakeCandle[];
  onDeleteCandle: (candleId: string) => void;
}

export default function AccomplishmentList({
  accomplishments,
  candles,
  onDeleteCandle,
}: AccomplishmentListProps) {
  if (accomplishments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="text-4xl mb-2">🎂</div>
        <p>Your cake is empty!</p>
        <p className="text-sm mt-1">
          Add your first accomplishment to light a candle
        </p>
      </div>
    );
  }

  const getCandleForAccomplishment = (accomplishmentId: string) => {
    return candles.find(
      (candle) => candle.accomplishmentId === accomplishmentId
    );
  };

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      career: "bg-blue-100 text-blue-800",
      education: "bg-purple-100 text-purple-800",
      fitness: "bg-green-100 text-green-800",
      personal: "bg-yellow-100 text-yellow-800",
      creative: "bg-pink-100 text-pink-800",
      financial: "bg-emerald-100 text-emerald-800",
      relationship: "bg-red-100 text-red-800",
      travel: "bg-cyan-100 text-cyan-800",
      health: "bg-lime-100 text-lime-800",
      other: "bg-gray-100 text-gray-800",
    };
    return colors[category] || colors.other;
  };

  return (
    <div className="space-y-3 max-h-100 overflow-y-auto pr-2">
      {accomplishments.map((accomplishment) => {
        const candle = getCandleForAccomplishment(accomplishment.id);
        return (
          <div
            key={accomplishment.id}
            className="p-4 border rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">{candle?.isLit ? "🕯️" : "🕯️💨"}</div>

              <div className="flex-1 min-w-0"></div>
              <h3 className="font-semibold text-gray-800">
                {accomplishment.text}
              </h3>
              <div className="flex flex-wrap gap-2 mt-2">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(
                    accomplishment.category
                  )}`}
                >
                  {accomplishment.category}
                </span>
              </div>
            </div>
            <button
              onClick={() => candle && onDeleteCandle(candle.id)}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
              title="Delete this accomplishment"
            >
              Remove Candle
            </button>
          </div>
        );
      })}
    </div>
  );
}
