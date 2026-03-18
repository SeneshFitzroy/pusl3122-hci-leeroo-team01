/**
 * AR Logo — crisp, high-contrast Augmented Reality icon. Fills container 100%.
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
      style={{ imageRendering: 'auto' }}
      aria-hidden
    >
      {/* Isometric cube — fills viewBox, thick strokes for clarity */}
      <path d="M24 6l14 10v20L24 46 10 36V16l14-10z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M24 6v40M10 16v20l14 10 14-10V16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* AR text — large, bold, crisp */}
      <text x="24" y="28" textAnchor="middle" dominantBaseline="middle" fill="currentColor" fontSize="14" fontWeight="800" fontFamily="system-ui, sans-serif">AR</text>
    </svg>
  )
}
