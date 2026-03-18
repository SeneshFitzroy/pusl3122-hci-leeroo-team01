/**
 * AR Logo — Industry-standard icon per HCI/UX conventions.
 * Google Scene Viewer & Apple AR Quick Look style. Geometric, recognizable, accessible.
 */
export default function ARLogoIcon({ className = 'h-12 w-12', invert = false }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      shapeRendering="geometricPrecision"
      className={`block ${className} ${invert ? 'brightness-0 invert' : ''}`}
      aria-hidden
    >
      {/* Viewfinder frame — AR placement affordance (HCI standard) */}
      <path d="M8 18V8h10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" />
      <path d="M40 18V8H30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" />
      <path d="M8 30v10h10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" />
      <path d="M40 30v10H30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" />
      {/* Isometric 3D cube — universal AR symbol */}
      <path d="M24 14l10 7v14L24 40 14 33V19l10-5z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" fill="none" />
      <path d="M24 14v26M14 19v14l10 7 10-7V19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" />
      {/* AR label — bold, legible (WCAG AA) */}
      <text x="24" y="28" textAnchor="middle" dominantBaseline="middle" fill="currentColor" fontSize="10" fontWeight="800" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.5">AR</text>
    </svg>
  )
}
