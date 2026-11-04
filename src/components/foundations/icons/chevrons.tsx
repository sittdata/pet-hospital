import type { SVGProps } from "react";
import { cx } from "@/utils/cx";

type IconProps = SVGProps<SVGSVGElement>;

export function ChevronRightSmall({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden {...props} className={cx("rtl:rotate-180", className)}>
      <path
        d="M4.5 3L7.14645 5.64645C7.34171 5.84171 7.34171 6.15829 7.14645 6.35355L4.5 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ChevronDownSmall(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden {...props}>
      <path
        d="M4 7L7.29289 10.2929C7.68342 10.6834 8.31658 10.6834 8.70711 10.2929L12 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
