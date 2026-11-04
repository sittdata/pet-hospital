"use client";

import { useState, useMemo } from "react";
import { RiCalendarEventLine, RiInformationFill } from "@remixicon/react";
import { Chip } from "@/components/base/badges/chip";
import { cx } from "@/utils/cx";

export interface HeatmapRow {
  label: string;
  values: number[];
}

export interface HeatmapRange {
  id: string;
  label: string;
  headline?: string;
  delta?: string;
  rows: HeatmapRow[];
}

export interface HeatmapChartCardProps {
  title?: string;
  headline?: string;
  delta?: string;
  deltaColor?: "lime" | "rose" | "neutral";
  rows?: HeatmapRow[];
  columns?: string[];
  color?: string;
  activeColor?: string;
  max?: number;
  ranges?: HeatmapRange[];
  defaultRange?: string;
  format?: (value: number) => string;
  className?: string;
}

const DEFAULT_COLUMNS = [
  "00:00",
  "02:00",
  "04:00",
  "06:00",
  "08:00",
  "10:00",
  "12:00",
  "14:00",
  "16:00",
  "18:00",
  "20:00",
  "22:00",
];

const DEFAULT_ROWS: HeatmapRow[] = [
  { label: "Mon", values: [2, 1, 1, 3, 7, 12, 15, 14, 18, 24, 12, 4] },
  { label: "Tue", values: [2, 1, 0, 3, 8, 13, 16, 13, 17, 23, 11, 4] },
  { label: "Wed", values: [1, 1, 0, 2, 6, 11, 14, 12, 16, 21, 10, 3] },
  { label: "Thu", values: [2, 1, 1, 3, 7, 12, 15, 14, 18, 24, 12, 5] },
  { label: "Fri", values: [3, 2, 1, 4, 9, 15, 18, 17, 22, 29, 16, 7] },
  { label: "Sat", values: [4, 3, 2, 5, 12, 19, 25, 23, 27, 32, 19, 8] },
  { label: "Sun", values: [5, 3, 2, 5, 14, 21, 26, 24, 28, 31, 18, 8] },
];

const RAMP_STEPS = [0.08, 0.28, 0.52, 0.76, 1.0];

export function HeatmapChartCard({
  title = "Busy Hours",
  headline = "Emergency Care Open 24/7",
  delta = "Best for Check-ups: Mornings",
  deltaColor = "lime",
  rows = DEFAULT_ROWS,
  columns = DEFAULT_COLUMNS,
  color = "var(--color-accent-500)",
  activeColor = "var(--color-accent-400)",
  max,
  format = (val) => `${val} mins`,
  className,
}: HeatmapChartCardProps) {
  const [hovered, setHovered] = useState<{ row: number; col: number } | null>(null);

  const flatValues = useMemo(() => rows.flatMap((r) => r.values), [rows]);
  const maxValue = max ?? Math.max(1, ...flatValues);

  const isHovering = hovered !== null;
  const currentVal = isHovering ? rows[hovered.row]?.values[hovered.col] ?? 0 : 0;

  const getDayFullName = (short: string) => {
    switch (short) {
      case "Mon": return "Monday";
      case "Tue": return "Tuesday";
      case "Wed": return "Wednesday";
      case "Thu": return "Thursday";
      case "Fri": return "Friday";
      case "Sat": return "Saturday";
      case "Sun": return "Sunday";
      default: return short;
    }
  };

  const currentLabel = isHovering
    ? `${getDayFullName(rows[hovered.row]?.label)} · ${columns[hovered.col]}`
    : title;

  const currentDisplayValue = isHovering ? format(currentVal) : headline;

  const getCellColor = (val: number, active: boolean) => {
    const intensity = Math.round(8 + 92 * Math.max(0, Math.min(1, val / maxValue)));
    const targetColor = active ? activeColor : color;
    return `color-mix(in srgb, ${targetColor} ${intensity}%, var(--color-background-tertiary-default))`;
  };

  return (
    <div
      className={cx(
        "flex w-full flex-col rounded-3xl bg-background-primary-default border border-border-button-default p-4 sm:p-5 shadow-xs transition-colors",
        className
      )}
    >
      {/* Chart Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-caption-1-semibold text-text-tertiary truncate">
              {currentLabel}
            </span>
            {isHovering && (
              <span className="text-[11px] px-1.5 py-0.5 rounded-md font-semibold bg-accent-500/10 text-accent-500 animate-fade-in">
                {currentVal <= 5 ? "Fast" : currentVal <= 18 ? "Moderate" : "Peak Hours"}
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-2.5 flex-wrap">
            <h4 className="text-title-2-medium text-text-primary tabular-nums tracking-tight">
              {currentDisplayValue}
            </h4>
            {!isHovering && delta && (
              <Chip color={deltaColor} variant="bold" className="text-[11px]">
                {delta}
              </Chip>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 text-caption-2-medium text-text-tertiary bg-background-secondary-default px-2.5 py-1 rounded-xl border border-border-button-default">
          <RiCalendarEventLine className="size-3.5 text-accent-500" />
          <span>Real-time Triage</span>
        </div>
      </div>

      {/* Heatmap Grid Matrix */}
      <div
        className="grid min-h-0 w-full flex-1 gap-1"
        style={{
          gridTemplateColumns: `auto repeat(${columns.length}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows.length}, minmax(0, 1fr)) auto`,
        }}
        onMouseLeave={() => setHovered(null)}
      >
        {rows.map((row, rIdx) => (
          <div key={row.label} className="contents">
            <span
              className={cx(
                "flex items-center pe-2 text-caption-2-medium whitespace-nowrap transition-colors duration-150 ease-out select-none",
                hovered?.row === rIdx ? "text-accent-500 font-bold" : "text-text-tertiary"
              )}
            >
              {row.label}
            </span>
            {columns.map((col, cIdx) => {
              const val = row.values[cIdx] ?? 0;
              const isSelected = hovered?.row === rIdx && hovered?.col === cIdx;
              return (
                <div
                  key={col}
                  role="img"
                  tabIndex={0}
                  aria-label={`${getDayFullName(row.label)} ${col}: ${format(val)}`}
                  className={cx(
                    "min-h-[18px] sm:min-h-[22px] rounded-[5px] transition-all duration-150 ease-out cursor-pointer",
                    isSelected ? "ring-2 ring-accent-500 scale-110 z-10 shadow-sm" : "hover:scale-105"
                  )}
                  style={{ backgroundColor: getCellColor(val, isSelected) }}
                  onMouseEnter={() => setHovered({ row: rIdx, col: cIdx })}
                  onFocus={() => setHovered({ row: rIdx, col: cIdx })}
                />
              );
            })}
          </div>
        ))}

        {/* Empty Corner Spacer */}
        <span aria-hidden="true" />

        {/* Column Time Slices */}
        {columns.map((col, cIdx) => (
          <span
            key={col}
            className={cx(
              "truncate pt-1.5 text-center text-[10px] sm:text-caption-2-medium transition-colors duration-150 ease-out select-none",
              hovered?.col === cIdx ? "text-accent-500 font-bold" : "text-text-tertiary",
              cIdx % 2 !== 0 && "hidden sm:inline-block"
            )}
          >
            {col}
          </span>
        ))}
      </div>

      {/* Footer Legend */}
      <div className="flex w-full items-center justify-between pt-3 mt-2 border-t border-border-button-default text-[11px] text-text-tertiary">
        <span className="flex items-center gap-1 text-text-tertiary">
          <RiInformationFill className="size-3.5 text-foreground-icon-tertiary" />
          <span>Tap or hover a cell to see estimated visitors</span>
        </span>

        <div className="flex items-center gap-1.5">
          <span>Less</span>
          <div className="flex items-center gap-1">
            {RAMP_STEPS.map((step, idx) => (
              <span
                key={idx}
                className="size-3 rounded-[3px] shadow-2xs"
                style={{ backgroundColor: getCellColor(step * maxValue, false) }}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
