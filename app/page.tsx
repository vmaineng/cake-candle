// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import AccomplishmentForm from "@/components/AddAccomplishmentForm";
import CakeCanvas from "@/components/CakeCanvas";
import AccomplishmentList from "@/components/AccomplishmentList";
import CelebrationEffects from "@/components/CelebrationEffects";
import { Accomplishment, CakeCandle } from "../types";
import { saveToLocalStorage, loadFromLocalStorage } from "../lib/localStorage";

export default function HomePage() {
  const [accomplishments, setAccomplishments] = useState<Accomplishment[]>([]);
  const [candles, setCandles] = useState<CakeCandle[]>([]);
  const [cakeSize, setCakeSize] = useState(1); // 1-5 tiers
  const [isCelebrating, setIsCelebrating] = useState(false);

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedAccomplishments = loadFromLocalStorage<Accomplishment[]>(
      "accomplishments",
      []
    );
    const savedCandles = loadFromLocalStorage<CakeCandle[]>("candles", []);

    setAccomplishments(savedAccomplishments);
    setCandles(savedCandles);
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    saveToLocalStorage("accomplishments", accomplishments);
    saveToLocalStorage("candles", candles);
  }, [accomplishments, candles]);

  const handleNewAccomplishment = (
    text: string,
    category: AccomplishmentCategory,
    importance: number
  ) => {
    // 1. Create accomplishment object
    const newAccomplishment: Accomplishment = {
      id: crypto.randomUUID(),
      text: text.trim(),
      category,
      date: new Date(),
      importance,
      mood: getMoodFromText(text),
      tags: extractTags(text),
    };

    // 2. Add to accomplishments list
    setAccomplishments((prev) => [newAccomplishment, ...prev]);

    // 3. Create corresponding candle
    const newCandle = createCandleFromAccomplishment(newAccomplishment);

    // 4. Add candle with celebration
    setCandles((prev) => [...prev, newCandle]);

    // 5. Trigger celebration effects
    triggerCelebration(newAccomplishment);

    // 6. Grow cake if needed
    checkAndGrowCake();
  };

  const createCandleFromAccomplishment = (
    accomplishment: Accomplishment
  ): CakeCandle => {
    // Calculate candle properties based on importance
    const height = 30 + accomplishment.importance * 10; // 40-80px
    const color = getCandleColor(
      accomplishment.category,
      accomplishment.importance
    );
    const flameIntensity = accomplishment.importance * 20; // 20-100

    // Generate random position (not too close to edges)
    const position = {
      x: Math.floor(Math.random() * 600) + 100,
      y: Math.floor(Math.random() * 200) + 50,
    };

    return {
      id: crypto.randomUUID(),
      accomplishmentId: accomplishment.id,
      height,
      color,
      position,
      flameIntensity,
      isLit: true,
      decorations: getDecorations(accomplishment.importance),
      createdAt: new Date(),
    };
  };

  const triggerCelebration = (accomplishment: Accomplishment) => {
    setIsCelebrating(true);

    // Auto-hide celebration after 3 seconds
    setTimeout(() => {
      setIsCelebrating(false);
    }, 3000);
  };

  const checkAndGrowCake = () => {
    // Grow cake every 5 accomplishments
    if (accomplishments.length % 5 === 0) {
      setCakeSize((prev) => Math.min(prev + 1, 5));
    }
  };

  const handleCandleClick = (candleId: string) => {
    // Find the accomplishment for this candle
    const candle = candles.find((c) => c.id === candleId);
    if (!candle) return;

    const accomplishment = accomplishments.find(
      (a) => a.id === candle.accomplishmentId
    );
    if (!accomplishment) return;

    // Toggle candle flame
    setCandles((prev) =>
      prev.map((c) => (c.id === candleId ? { ...c, isLit: !c.isLit } : c))
    );

    // Show accomplishment details
    alert(
      `🎉 ${
        accomplishment.text
      }\n📅 ${accomplishment.date.toLocaleDateString()}\n⭐ Importance: ${
        accomplishment.importance
      }/5`
    );
  };

  const handleDeleteCandle = (candleId: string) => {
    const candle = candles.find((c) => c.id === candleId);
    if (!candle) return;

    // Remove the candle
    setCandles((prev) => prev.filter((c) => c.id !== candleId));

    // Also remove the corresponding accomplishment
    setAccomplishments((prev) =>
      prev.filter((a) => a.id !== candle.accomplishmentId)
    );
  };

  const clearAll = () => {
    if (
      confirm("Are you sure you want to clear all accomplishments and candles?")
    ) {
      setAccomplishments([]);
      setCandles([]);
      setCakeSize(1);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 to-gray-800 p-4 md:p-8">
      {/* Celebration overlay */}
      {isCelebrating && <CelebrationEffects />}

      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
          🎂 Achievement Cake
        </h1>
        <p className="text-gray-300 text-lg">
          Every accomplishment lights a candle on your cake
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">✨</span> Add New Accomplishment
            </h2>
            <AccomplishmentForm onSubmit={handleNewAccomplishment} />
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Your Accomplishments</h2>
              <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-semibold">
                {accomplishments.length} total
              </span>
            </div>
            <AccomplishmentList
              accomplishments={accomplishments}
              candles={candles}
              onDeleteCandle={handleDeleteCandle}
            />

            {accomplishments.length > 0 && (
              <button
                onClick={clearAll}
                className="mt-4 w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                🗑️ Clear All Accomplishments
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Cake Display */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-2xl shadow-xl p-6 h-full border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">Your Celebration Cake</h2>
                <p className="text-gray-600">
                  {candles.filter((c) => c.isLit).length} candles burning bright
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    // Export cake as image
                    const canvas = document.querySelector("canvas");
                    if (canvas) {
                      const link = document.createElement("a");
                      link.download = "my-achievement-cake.png";
                      link.href = canvas.toDataURL();
                      link.click();
                    }
                  }}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  📸 Save Image
                </button>
              </div>
            </div>

            <CakeCanvas
              candles={candles}
              cakeSize={cakeSize}
              onCandleClick={handleCandleClick}
            />

            {/* Cake stats */}
            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              <div className="bg-pink-50 p-4 rounded-xl">
                <div className="text-2xl font-bold text-pink-600">
                  {candles.length}
                </div>
                <div className="text-sm text-pink-800">Total Candles</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-xl">
                <div className="text-2xl font-bold text-orange-600">
                  {candles.filter((c) => c.isLit).length}
                </div>
                <div className="text-sm text-orange-800">Lit Candles</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">
                  {new Set(accomplishments.map((a) => a.category)).size}
                </div>
                <div className="text-sm text-blue-800">Categories</div>
              </div>
            </div>

            {/* Progress to next cake size */}
            <div className="mt-6 p-4 bg-gradient-to-r from-pink-100 to-orange-100 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">
                  Cake Size: Level {cakeSize}/5
                </span>
                <span className="text-sm text-gray-600">
                  {5 - (accomplishments.length % 5)} more to level up!
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-pink-500 to-orange-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(accomplishments.length % 5) * 20}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                🎯 Tip: Add 5 accomplishments to grow your cake to the next
                size!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function getMoodFromText(text: string): Accomplishment["mood"] {
  const textLower = text.toLowerCase();
  if (textLower.includes("proud")) return "proud";
  if (textLower.includes("excited")) return "excited";
  if (textLower.includes("relieved")) return "relieved";
  if (textLower.includes("finally") || textLower.includes("after"))
    return "accomplished";
  return "happy";
}

function extractTags(text: string): string[] {
  const tags: string[] = [];
  const textLower = text.toLowerCase();

  if (textLower.includes("first")) tags.push("first-time");
  if (textLower.includes("week") || textLower.includes("daily"))
    tags.push("consistent");
  if (textLower.includes("month") || textLower.includes("year"))
    tags.push("long-term");
  if (textLower.includes("learn") || textLower.includes("study"))
    tags.push("learning");

  return tags;
}

function getCandleColor(
  category: AccomplishmentCategory,
  importance: number
): string {
  const baseColors: Record<AccomplishmentCategory, string> = {
    career: "#3B82F6",
    education: "#8B5CF6",
    fitness: "#10B981",
    personal: "#F59E0B",
    creative: "#EC4899",
    financial: "#059669",
    relationship: "#EF4444",
    travel: "#06B6D4",
    health: "#84CC16",
    other: "#6B7280",
  };

  const baseColor = baseColors[category];

  // Darken color for more important candles
  if (importance >= 4) {
    // Simple darkening - in reality you'd want a proper color manipulation library
    return baseColor + "CC"; // Add alpha for visual effect
  }

  return baseColor;
}

function getDecorations(importance: number): string[] {
  const decorations = [
    [], // Importance 1
    ["gold-ring"], // Importance 2
    ["stars"], // Importance 3
    ["stars", "sparkles"], // Importance 4
    ["diamond", "sparkles", "glitter"], // Importance 5
  ];
  return decorations[importance - 1] || [];
}
