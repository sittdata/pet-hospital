import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export const CatIcon: React.FC<IconProps> = ({ className = 'size-5', ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path d="M12 5c-4.418 0-8 3.358-8 7.5 0 2.38 1.168 4.512 3 5.86V21l3.5-1.5h3L17 21v-2.64c1.832-1.348 3-3.48 3-5.86 0-4.142-3.582-7.5-8-7.5z" />
    <path d="M4.5 9.5L3 4l5.5 2.5" />
    <path d="M19.5 9.5L21 4l-5.5 2.5" />
    <circle cx="9" cy="13" r="1" fill="currentColor" />
    <circle cx="15" cy="13" r="1" fill="currentColor" />
    <path d="M11 15.5c.5.5 1.5.5 2 0" />
  </svg>
);

export const DogIcon: React.FC<IconProps> = ({ className = 'size-5', ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path d="M10 5.172a2 2 0 0 0-2-2H6.5A2.5 2.5 0 0 0 4 5.672V10a2 2 0 0 0 2 2h4" />
    <path d="M14 5.172a2 2 0 0 1 2-2h1.5A2.5 2.5 0 0 1 20 5.672V10a2 2 0 0 1-2 2h-4" />
    <rect x="6" y="8" width="12" height="12" rx="4" />
    <circle cx="9" cy="13" r="1" fill="currentColor" />
    <circle cx="15" cy="13" r="1" fill="currentColor" />
    <path d="M11 16.5h2" />
  </svg>
);

export const RabbitIcon: React.FC<IconProps> = ({ className = 'size-5', ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path d="M8 2c-1.5 1-2 4-1 7l2 1" />
    <path d="M16 2c1.5 1 2 4 1 7l-2 1" />
    <circle cx="12" cy="14" r="7" />
    <circle cx="9.5" cy="13" r="1" fill="currentColor" />
    <circle cx="14.5" cy="13" r="1" fill="currentColor" />
    <path d="M11.5 16l.5.5.5-.5" />
    <path d="M6 14h2" />
    <path d="M16 14h2" />
  </svg>
);

export const SmallPetIcon: React.FC<IconProps> = ({ className = 'size-5', ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <circle cx="12" cy="13" r="7" />
    <path d="M7 6a2 2 0 0 1 2 2" />
    <path d="M17 6a2 2 0 0 0-2 2" />
    <circle cx="9.5" cy="12.5" r="1" fill="currentColor" />
    <circle cx="14.5" cy="12.5" r="1" fill="currentColor" />
    <ellipse cx="12" cy="15" rx="1.5" ry="1" fill="currentColor" />
  </svg>
);

