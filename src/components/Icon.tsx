/*
 * Lightweight inline-SVG icon set (Feather-style, 24px grid).
 *
 * The design reference used Unicode emoji as placeholders; the README asks to
 * "Replace with the codebase's real icon set ... do not ship emoji in production."
 * This is that icon set — one stroke-based component, no emoji.
 */
import type { CSSProperties } from 'react';

export type IconName =
  | 'cross' // medical plus (brand mark)
  | 'home'
  | 'list'
  | 'plus'
  | 'alert'
  | 'monitor'
  | 'bell'
  | 'power'
  | 'search'
  | 'chevron-left'
  | 'chevron-down'
  | 'check'
  | 'close'
  | 'pin'
  | 'sync'
  | 'crosshair'
  | 'dashboard'
  | 'people'
  | 'gauge'
  | 'worker'
  | 'reports'
  | 'settings'
  | 'minus';

const PATHS: Record<IconName, JSX.Element> = {
  cross: <path d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7z" fill="currentColor" stroke="none" />,
  home: (
    <path d="M3 11l9-8 9 8M5 9.5V21h5v-6h4v6h5V9.5" />
  ),
  list: <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  alert: (
    <path d="M10.3 3.6 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.6a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01" />
  ),
  monitor: <path d="M3 4h18v12H3zM8 20h8M12 16v4" />,
  bell: <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" />,
  power: <path d="M18.4 6.6a9 9 0 1 1-12.8 0M12 2v10" />,
  search: <path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3" />,
  'chevron-left': <path d="M15 18l-6-6 6-6" />,
  'chevron-down': <path d="M6 9l6 6 6-6" />,
  check: <path d="M20 6L9 17l-5-5" />,
  close: <path d="M18 6L6 18M6 6l12 12" />,
  pin: <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />,
  sync: <path d="M21 2v6h-6M3 22v-6h6M3.5 9a9 9 0 0 1 14.8-3.4L21 8M20.5 15a9 9 0 0 1-14.8 3.4L3 16" />,
  crosshair: <path d="M12 2v4M12 18v4M2 12h4M18 12h4M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" />,
  dashboard: <path d="M3 3h8v8H3zM13 3h8v5h-8zM13 12h8v9h-8zM3 13h8v8H3z" />,
  people: <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 16 11" />,
  gauge: <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM13.4 10.6 19 5M3 12a9 9 0 0 1 18 0" />,
  worker: <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM6 21v-1a6 6 0 0 1 12 0v1" />,
  reports: <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M9 13h6M9 17h6" />,
  settings: <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-2.81 1.17V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />,
};

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: CSSProperties;
  'aria-hidden'?: boolean;
  title?: string;
}

export function Icon({
  name,
  size = 20,
  color = 'currentColor',
  strokeWidth = 1.9,
  style,
  title,
}: IconProps) {
  const filled = name === 'cross';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={filled ? 'none' : color}
      color={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      style={{ flexShrink: 0, display: 'block', ...style }}
    >
      {title ? <title>{title}</title> : null}
      {PATHS[name]}
    </svg>
  );
}
