"use client";

import { useState, useEffect, useRef, useMemo, type ComponentType, type ReactNode } from "react";
import { RiArrowDownSLine, RiRefreshLine } from "@remixicon/react";
import { motion, AnimatePresence, useReducedMotion, type Transition } from "motion/react";
import { cx } from "@/utils/cx";

export interface TaskChip {
  label: string;
  icon?: ReactNode;
}

export interface TaskStep {
  label: string;
  chips?: TaskChip[];
}

export interface TaskItem {
  title: string;
  runningTitle?: string;
  icon?: ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
  steps: TaskStep[];
}

export interface TaskListProps {
  tasks: TaskItem[];
  run?: boolean;
  stepInterval?: number;
  startDelay?: number;
  revealed?: number;
  collapseOnComplete?: boolean | "all";
  working?: string | false;
  onComplete?: () => void;
  className?: string;
  allowReplay?: boolean;
}

const SOFT_EASE = [0.22, 1, 0.36, 1] as const;
const VAR_FADE = "--bui-reveal-fade";
const MASK_IMAGE = `linear-gradient(to bottom, #000 calc(100% - var(${VAR_FADE}, 0px)), transparent calc(100% + 1px))`;
const MASK_STYLE = { WebkitMaskImage: MASK_IMAGE, maskImage: MASK_IMAGE };

const UNIT_INITIAL = { opacity: 0, height: 0, y: 4, filter: "blur(6px)", [VAR_FADE]: "22px" };
const UNIT_ANIMATE = { opacity: 1, height: "auto", y: 0, filter: "blur(0px)", [VAR_FADE]: "0px" };
const UNIT_TRANSITION: Transition = {
  height: { duration: 0.38, ease: SOFT_EASE },
  opacity: { duration: 0.42, ease: SOFT_EASE },
  filter: { duration: 0.42, ease: SOFT_EASE },
  y: { duration: 0.42, ease: SOFT_EASE },
  [VAR_FADE]: { duration: 0.44, ease: SOFT_EASE },
};

function useRevealMask(reduce: boolean) {
  const [active, setActive] = useState(!reduce);
  return {
    style: active ? MASK_STYLE : undefined,
    onAnimationComplete: () => setActive(false),
  };
}

const GUIDE_PATH = "M0.5 0 V8 Q0.5 14 6.5 14 H11.5";
const LINE_TRANSITION = { duration: 0.12, ease: "linear" as const, delay: 0 };

function TreeGuide({ first, last, reduce }: { first: boolean; last: boolean; reduce: boolean }) {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 start-0 w-3 text-foreground-icon-quaternary">
      <svg width={12} height={15} viewBox="0 0 12 15" fill="none" className="absolute top-0 start-0 rtl:-scale-x-100">
        <motion.path
          d={GUIDE_PATH}
          stroke="currentColor"
          strokeWidth="1"
          initial={!reduce && { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.14, ease: "linear", delay: first ? 0 : 0.12 }}
        />
      </svg>
      {!last && (
        <motion.span
          className="absolute start-0 w-px origin-top bg-current"
          style={{ top: 8, bottom: 0 }}
          initial={!reduce && { scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={LINE_TRANSITION}
        />
      )}
    </span>
  );
}

function ShimmerText({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span aria-label={typeof children === "string" ? children : undefined} className={cx("agent-progress-loading-text", className)}>
      {children}
    </span>
  );
}

function LogRow({
  first,
  last,
  reduce,
  className,
  children,
}: {
  first: boolean;
  last: boolean;
  reduce: boolean;
  className?: string;
  children: ReactNode;
}) {
  const mask = useRevealMask(reduce);
  return (
    <motion.li
      initial={!reduce && UNIT_INITIAL}
      animate={UNIT_ANIMATE}
      transition={UNIT_TRANSITION}
      {...mask}
      className={cx("relative overflow-hidden ps-4", className)}
    >
      <TreeGuide first={first} last={last} reduce={reduce} />
      {children}
    </motion.li>
  );
}

function StepChip({ chip }: { chip: TaskChip }) {
  return (
    <span className="me-0.5 ms-[3px] inline-flex max-w-full -translate-y-px items-center gap-1 rounded-md border py-0.5 pe-1.5 align-middle border-border-button-default/50 bg-background-secondary-default transition-colors duration-150 ease hover:border-border-button-hover hover:bg-background-tertiary-default ps-1.5">
      {chip.icon ? (
        <span aria-hidden="true" className="flex size-3.5 shrink-0 items-center justify-center">
          {chip.icon}
        </span>
      ) : null}
      <span className="truncate text-caption-2-medium text-text-primary">{chip.label}</span>
    </span>
  );
}

function StepRow({
  step,
  active,
  first,
  last,
  reduce,
}: {
  step: TaskStep;
  active: boolean;
  first: boolean;
  last: boolean;
  reduce: boolean;
}) {
  return (
    <LogRow first={first} last={last} reduce={reduce}>
      <span className="block py-1 text-body-regular text-text-secondary">
        {active ? <ShimmerText>{step.label}</ShimmerText> : step.label}
        {step.chips?.map((c, i) => (
          <StepChip key={`${c.label}-${i}`} chip={c} />
        ))}
      </span>
    </LogRow>
  );
}

function RevealContainer({ reduce, children }: { reduce: boolean; children: ReactNode }) {
  const mask = useRevealMask(reduce);
  return (
    <motion.section
      initial={!reduce && UNIT_INITIAL}
      animate={UNIT_ANIMATE}
      transition={UNIT_TRANSITION}
      {...mask}
      className="overflow-hidden"
    >
      {children}
    </motion.section>
  );
}

function TitleMorph({ label, running }: { label: string; running: boolean }) {
  return (
    <span className="relative flex min-w-0 overflow-hidden">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={label}
          initial={{ opacity: 0, y: 4, filter: "blur(3px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -4, filter: "blur(3px)" }}
          transition={{ duration: 0.26, ease: SOFT_EASE }}
          className="block truncate"
        >
          {running ? <ShimmerText>{label}</ShimmerText> : label}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function TaskGroup({
  task,
  headIndex,
  endIndex,
  revealed,
  total,
  collapseOnComplete,
  reduce,
}: {
  task: TaskItem;
  headIndex: number;
  endIndex: number;
  revealed: number;
  total: number;
  collapseOnComplete: boolean | "all";
  reduce: boolean;
}) {
  const [collapsedManual, setCollapsedManual] = useState<boolean | null>(null);
  const isFinished = revealed >= endIndex;
  const Icon = task.icon;

  const isOpen =
    collapsedManual ??
    !(collapseOnComplete === "all" ? revealed >= total : collapseOnComplete && isFinished);

  const displayTitle = isFinished ? task.title : task.runningTitle ?? task.title;

  return (
    <RevealContainer reduce={reduce}>
      <button
        type="button"
        onClick={() => setCollapsedManual(!isOpen)}
        aria-expanded={isOpen}
        className="group flex w-full cursor-pointer items-center gap-2 rounded-md py-0.5 text-start outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
      >
        {Icon ? <Icon className="size-4 shrink-0 text-foreground-icon-secondary" /> : null}
        <span className="min-w-0 flex-1 text-body-medium text-text-secondary">
          <TitleMorph label={displayTitle} running={!isFinished} />
        </span>
        <RiArrowDownSLine
          aria-hidden="true"
          className={cx(
            "size-4 shrink-0 text-foreground-icon-tertiary transition-transform duration-300 ease group-hover:text-foreground-icon-secondary",
            isOpen ? "rotate-180" : "rotate-0"
          )}
        />
      </button>

      <motion.div
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ height: { duration: 0.3, ease: SOFT_EASE }, opacity: { duration: 0.22, ease: "easeOut" } }}
        className="overflow-hidden"
      >
        <ul aria-live="polite" className="mt-0.5 ms-2 flex flex-col">
          {task.steps.map((st, i) => {
            const stepAbsIdx = headIndex + 1 + i;
            if (revealed <= stepAbsIdx) return null;
            const isLastOfRevealed = i === Math.min(revealed - headIndex - 2, task.steps.length - 1);
            return (
              <StepRow
                key={`${st.label}-${i}`}
                step={st}
                active={!reduce && revealed === stepAbsIdx + 1 && revealed < total}
                first={i === 0}
                last={isLastOfRevealed}
                reduce={reduce}
              />
            );
          })}
        </ul>
      </motion.div>
    </RevealContainer>
  );
}

const starOffsets = [
  { x: 50, y: 50, scale: 1 },
  { x: 18, y: 22, scale: 0.5 },
  { x: 82, y: 24, scale: 0.55 },
  { x: 16, y: 78, scale: 0.45 },
  { x: 80, y: 78, scale: 0.4 },
];

function StarsIcon() {
  return (
    <span aria-hidden="true" className="relative block shrink-0 size-[21px] text-foreground-icon-secondary">
      {starOffsets.map((e, a) => {
        const s = 14 * e.scale;
        return (
          <svg
            key={a}
            viewBox="0 0 24 24"
            className="absolute animate-pulse"
            style={{
              width: s,
              height: s,
              left: `${e.x}%`,
              top: `${e.y}%`,
              marginLeft: -s / 2,
              marginTop: -s / 2,
              animationDuration: "1.4s",
              animationDelay: `${(1.4 * a * 0.7) / 5}s`,
            }}
          >
            <path
              d="M12 0C13 7 17 11 24 12C17 13 13 17 12 24C11 17 7 13 0 12C7 11 11 7 12 0Z"
              fill="currentColor"
            />
          </svg>
        );
      })}
    </span>
  );
}

function ElapsedTimer() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const interval = window.setInterval(() => {
      setSeconds((performance.now() - start) / 1000);
    }, 100);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <span className="font-mono text-caption-1-regular text-text-tertiary tabular-nums">
      {seconds.toFixed(1)}s
    </span>
  );
}

function WorkingIndicator({ label, reduce, className }: { label: string; reduce: boolean; className?: string }) {
  const mask = useRevealMask(reduce);
  return (
    <motion.div
      initial={!reduce && UNIT_INITIAL}
      animate={UNIT_ANIMATE}
      transition={UNIT_TRANSITION}
      {...mask}
      className={cx("overflow-hidden", className)}
    >
      <div className="py-1 flex items-center gap-2">
        <StarsIcon />
        <ShimmerText className="text-body-medium">{label}</ShimmerText>
        <ElapsedTimer />
      </div>
    </motion.div>
  );
}

function useRevealTicker({
  total,
  run = true,
  stepInterval = 850,
  startDelay = 320,
  revealed,
  onComplete,
}: {
  total: number;
  run?: boolean;
  stepInterval?: number;
  startDelay?: number;
  revealed?: number;
  onComplete?: () => void;
}) {
  const isControlled = revealed !== undefined;
  const [internalCount, setInternalCount] = useState<number>(0);
  const current = isControlled ? Math.max(0, Math.min(revealed, total)) : internalCount;

  useEffect(() => {
    if (isControlled || !run || current >= total) return;
    const delay = current === 0 ? startDelay : stepInterval;
    const timer = window.setTimeout(() => setInternalCount((c) => c + 1), delay);
    return () => window.clearTimeout(timer);
  }, [isControlled, run, current, total, startDelay, stepInterval]);

  const completedFired = useRef<boolean>(false);
  useEffect(() => {
    if (total === 0 || current < total) {
      completedFired.current = false;
      return;
    }
    if (!completedFired.current) {
      completedFired.current = true;
      onComplete?.();
    }
  }, [current, total, onComplete]);

  return {
    revealed: current,
    reset: () => {
      completedFired.current = false;
      setInternalCount(0);
    },
  };
}

export function TaskList({
  tasks,
  run = true,
  stepInterval = 850,
  startDelay = 320,
  revealed: controlledRevealed,
  collapseOnComplete = false,
  working = "กำลังดำเนินการ...",
  onComplete,
  className,
  allowReplay = true,
}: TaskListProps) {
  const reduce = useReducedMotion() ?? false;

  const indexedTasks = useMemo(() => {
    const indices = tasks.reduce<number[]>((acc, t) => [...acc, acc[acc.length - 1] + 1 + t.steps.length], [0]);
    return tasks.map((task, i) => ({
      task,
      headIndex: indices[i],
      endIndex: indices[i + 1],
    }));
  }, [tasks]);

  const totalSteps = (indexedTasks.length > 0 ? indexedTasks[indexedTasks.length - 1].endIndex : 0) + (controlledRevealed === undefined ? 1 : 0);

  const { revealed, reset } = useRevealTicker({
    total: totalSteps,
    run,
    stepInterval,
    startDelay,
    revealed: controlledRevealed,
    onComplete,
  });

  const isCompleted = revealed >= totalSteps;

  return (
    <div className={cx("flex w-full flex-col gap-3", className)}>
      <div className="flex flex-col gap-[5px]">
        {indexedTasks.map(({ task, headIndex, endIndex }, idx) => {
          if (revealed <= headIndex) return null;
          return (
            <TaskGroup
              key={`${task.title}-${idx}`}
              task={task}
              headIndex={headIndex}
              endIndex={endIndex}
              revealed={revealed}
              total={totalSteps}
              collapseOnComplete={collapseOnComplete}
              reduce={reduce}
            />
          );
        })}

        {working !== false && revealed > 0 && revealed < totalSteps ? (
          <WorkingIndicator label={working} reduce={reduce} />
        ) : null}
      </div>

      {allowReplay && isCompleted && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.28, ease: SOFT_EASE }}
            className="pt-2"
          >
            <button
              type="button"
              onClick={reset}
              className="flex cursor-pointer items-center gap-1.5 self-start rounded-lg border border-border-button-default bg-background-primary-default px-2.5 py-1.5 text-body-medium text-text-secondary shadow-xs transition-colors duration-150 ease hover:bg-background-primary-hover hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring focus-visible:outline-none button-press-motion"
            >
              <RiRefreshLine className="size-4" aria-hidden="true" />
              <span>Run again</span>
            </button>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
