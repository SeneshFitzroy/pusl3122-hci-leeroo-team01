/**
 * AR Logo — transparent background, scalable.
 * Cube wireframe with corner brackets and "AR" text.
 */
export default function ARLogoIcon({ className = 'h-12 w-12', invert = false }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${invert ? 'brightness-0 invert' : ''}`}
      aria-hidden
    >
      {/* Corner brackets (viewfinder) */}
      <path d="M10 22V10h12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M54 22V10H42" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 42v12h12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M54 42v12H42" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Isometric cube wireframe */}
      <path d="M24 48 L32 40 L40 48 L32 56 Z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M32 40 L32 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M40 48 L40 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 48 L24 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M32 24 L40 32 L40 48" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M32 24 L24 32 L24 48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* AR text on front face */}
      <text x="32" y="48" textAnchor="middle" dominantBaseline="middle" fill="currentColor" fontSize="12" fontWeight="bold" fontFamily="system-ui, sans-serif">AR</text>
    </svg>
  )
}
