// components/CakeCanvas.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { CakeCandle } from "@/types";

interface CakeCanvasProps {
  candles: CakeCandle[];
  cakeSize: number;
  onCandleClick: (candleId: string) => void;
}

export default function CakeCanvas({
  candles,
  cakeSize,
  onCandleClick,
}: CakeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredCandle, setHoveredCandle] = useState<string | null>(null);
  const animationRef = useRef<number>();

  const canvasWidth = 800;
  const canvasHeight = 500;
  const cakeWidth = 400 + (cakeSize - 1) * 80;
  const cakeHeight = 150 + (cakeSize - 1) * 30;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Animation loop
    const animate = () => {
      drawFrame(ctx);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [candles, hoveredCandle, cakeSize]);

  const drawFrame = (ctx: CanvasRenderingContext2D) => {
    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw cake base
    drawCakeBase(ctx);

    // Draw all candles
    candles.forEach((candle) => {
      if (isValidCandlePosition(candle.position)) {
        drawCandle(ctx, candle, candle.id === hoveredCandle);
      }
    });
  };

  const drawCakeBase = (ctx: CanvasRenderingContext2D) => {
    const centerX = canvasWidth / 2;
    const cakeTop = canvasHeight - cakeHeight - 50;

    // Cake base (layers)
    const layers = cakeSize;
    const layerHeight = cakeHeight / layers;

    for (let i = 0; i < layers; i++) {
      const layerWidth = cakeWidth - i * 40;
      const layerY = cakeTop + i * layerHeight;

      // Layer shadow
      ctx.fillStyle = i === 0 ? "#FBBF24" : "#FCD34D";
      ctx.fillRect(centerX - layerWidth / 2, layerY, layerWidth, layerHeight);

      // Layer highlight
      ctx.fillStyle = i === 0 ? "#FDE68A" : "#FEF3C7";
      ctx.fillRect(
        centerX - layerWidth / 2 + 5,
        layerY + 2,
        layerWidth - 10,
        layerHeight - 4
      );
    }

    // Cake plate
    ctx.fillStyle = "#D1D5DB";
    ctx.fillRect(
      centerX - cakeWidth / 2 - 20,
      cakeTop + cakeHeight,
      cakeWidth + 40,
      10
    );
  };

  const drawCandle = (
    ctx: CanvasRenderingContext2D,
    candle: CakeCandle,
    isHovered: boolean
  ) => {
    const { x, y } = candle.position;
    const time = Date.now() / 1000;

    // ✅ FIX: Validate x, y are finite numbers
    if (!isFinite(x) || !isFinite(y) || !isFinite(candle.height)) {
      console.warn("Invalid candle data:", candle);
      return;
    }

    // Candle body with gradient - ✅ FIX: Ensure coordinates are valid
    const gradientStartY = Math.max(0, y - candle.height);
    const gradientEndY = Math.max(0, y);

    const gradient = ctx.createLinearGradient(
      Math.max(0, x - 8),
      gradientStartY,
      Math.max(0, x + 8),
      gradientEndY
    );

    gradient.addColorStop(0, candle.color);
    gradient.addColorStop(1, darkenColor(candle.color, 20));

    ctx.fillStyle = gradient;
    ctx.fillRect(x - 8, y - candle.height, 16, candle.height);

    // Candle wick
    ctx.fillStyle = "#1F2937";
    ctx.fillRect(x - 1, y - candle.height - 5, 2, 5);

    // Flame if lit
    if (candle.isLit) {
      drawFlame(ctx, x, y - candle.height - 5, candle.flameIntensity, time);
    }

    // Decoration based on importance
    if (candle.decorations.includes("gold-ring")) {
      ctx.fillStyle = "#FBBF24";
      ctx.fillRect(x - 10, y - candle.height + 20, 20, 3);
    }

    if (candle.decorations.includes("stars")) {
      drawStars(ctx, x, y - candle.height + 10);
    }

    // Hover effect
    if (isHovered) {
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 2;
      ctx.strokeRect(x - 12, y - candle.height - 10, 24, candle.height + 20);
    }
  };

  const drawFlame = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    intensity: number,
    time: number
  ) => {
    const flicker = Math.sin(time * 10) * 2;
    const size = 5 + (intensity / 100) * 10;

    if (!isFinite(x) || !isFinite(y + flicker) || !isFinite(size)) {
      return;
    }

    // Flame gradient
    const gradient = ctx.createRadialGradient(
      x,
      y + flicker,
      0,
      x,
      y + flicker,
      size
    );

    gradient.addColorStop(0, "#FFFFFF");
    gradient.addColorStop(0.3, "#FBBF24");
    gradient.addColorStop(0.6, "#F59E0B");
    gradient.addColorStop(1, "transparent");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(x, y + flicker, size * 0.7, size, 0, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawStars = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.fillStyle = "#FDE68A";
    for (let i = 0; i < 3; i++) {
      const starX = x - 15 + i * 15;
      // ✅ FIX: Validate star position
      if (!isFinite(starX) || !isFinite(y)) continue;

      ctx.beginPath();
      for (let j = 0; j < 5; j++) {
        const angle = (j * 2 * Math.PI) / 5 - Math.PI / 2;
        const radius = j % 2 === 0 ? 3 : 1.5;
        const pointX = starX + radius * Math.cos(angle);
        const pointY = y + radius * Math.sin(angle);

        if (j === 0) {
          ctx.moveTo(pointX, pointY);
        } else {
          ctx.lineTo(pointX, pointY);
        }
      }
      ctx.closePath();
      ctx.fill();
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Find clicked candle
    candles.forEach((candle) => {
      const { x, y } = candle.position;
      if (
        clickX >= x - 12 &&
        clickX <= x + 12 &&
        clickY >= y - candle.height - 10 &&
        clickY <= y + 10
      ) {
        onCandleClick(candle.id);
      }
    });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    let found = false;
    candles.forEach((candle) => {
      const { x, y } = candle.position;
      if (
        mouseX >= x - 12 &&
        mouseX <= x + 12 &&
        mouseY >= y - candle.height - 10 &&
        mouseY <= y + 10
      ) {
        setHoveredCandle(candle.id);
        found = true;
      }
    });

    if (!found) {
      setHoveredCandle(null);
    }
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasMouseMove}
        className="w-full h-auto rounded-2xl border-4 border-amber-100 cursor-pointer"
      />

      <div className="mt-4 text-center text-gray-600">
        <p>🕯️ Click candles to toggle flame • Hover to see details</p>
      </div>
    </div>
  );
}

function isValidCandlePosition(position: { x: number; y: number }): boolean {
  return (
    isFinite(position.x) &&
    isFinite(position.y) &&
    position.x >= 0 &&
    position.y >= 0
  );
}

// Helper function to darken colors
function darkenColor(color: string, percent: number): string {
  // Simple color darkening
  if (color.length === 7) {
    return (
      color +
      Math.floor(percent * 2.55)
        .toString(16)
        .padStart(2, "0")
    );
  }
  return color;
}
