/**
 * Color utilities for realistic, industrial furniture image color change.
 * Uses sepia→hue-rotate→saturate pipeline for precise, material-accurate previews.
 */

/**
 * Convert hex color to HSL { h, s, l } (h: 0-360, s/l: 0-1)
 */
export function hexToHSL(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return { h: 0, s: 0, l: 0.5 }
  let r = parseInt(result[1], 16) / 255
  let g = parseInt(result[2], 16) / 255
  let b = parseInt(result[3], 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  return { h: h * 360, s, l }
}

/** Base hue of typical furniture upholstery (tan/brown) for hue-rotate reference */
const BASE_UPHOLSTERY_HUE = 35

/**
 * Returns CSS filter for realistic fabric/leather color shift.
 * Pipeline: light sepia unifies tones → dampened hue-rotate → saturate match.
 * Industrial-grade: conservative shifts to avoid artificial look.
 */
export function getHueRotateFilter(hex, baseHue = BASE_UPHOLSTERY_HUE) {
  const { h, s } = hexToHSL(hex)
  let delta = h - baseHue
  if (delta > 180) delta -= 360
  if (delta < -180) delta += 360
  const dampened = Math.round(delta * 0.75)
  const sat = Math.max(0.92, Math.min(1.12, 0.95 + s * 0.25))
  return `sepia(0.12) hue-rotate(${dampened}deg) saturate(${sat.toFixed(2)})`
}
