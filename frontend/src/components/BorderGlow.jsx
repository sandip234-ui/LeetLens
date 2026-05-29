import React, { useRef, useEffect } from 'react'

/**
 * BorderGlow
 *
 * Mouse-tracking glow that appears only on the border strip of the element.
 * Uses the CSS mask-composite "exclude" trick:
 *   - A full radial gradient overlay is drawn with padding=borderWidth
 *   - Two mask layers (content-box and padding-box) are XOR'd together
 *   - The result: only the border strip (the padding area) shows the gradient
 *
 * This is 100% GPU-accelerated — no React state is updated on mouse move.
 * Only CSS custom properties are mutated via the CSSOM.
 *
 * Props:
 *   glowColor      — RGB triple as space-separated string, e.g. "99 102 241"
 *   borderRadius   — px number
 *   glowRadius     — spotlight radius in px
 *   glowIntensity  — alpha 0–1
 *   borderWidth    — visible border strip width in px (default 1)
 *   className      — applied to the outer wrapper
 *   style          — applied to the outer wrapper
 *   children
 */
export default function BorderGlow({
  children,
  glowColor = '99 102 241',
  borderRadius = 16,
  glowRadius = 100,
  glowIntensity = 0.75,
  borderWidth = 1,
  className = '',
  style = {},
  animated = false,
  edgeSensitivity = 0,
  coneSpread = 0,
}) {
  const wrapRef  = useRef(null)
  const glowRef  = useRef(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const glow = glowRef.current
    if (!wrap || !glow) return

    let raf = null
    let animationId = null

    // Continuous animation mode
    if (animated) {
      const animate = (timestamp) => {
        const rect = wrap.getBoundingClientRect()
        const centerX = rect.width / 2
        const centerY = rect.height / 2

        // Create circular motion with edge variation
        const angle = (timestamp / 3000) * Math.PI * 2 // One rotation every 3 seconds
        const edgeVariation = Math.sin(angle * 2) * edgeSensitivity

        const x = centerX + Math.cos(angle) * (centerX - edgeVariation)
        const y = centerY + Math.sin(angle) * (centerY - edgeVariation)

        if (raf) cancelAnimationFrame(raf)
        raf = requestAnimationFrame(() => {
          glow.style.setProperty('--bgx', `${x}px`)
          glow.style.setProperty('--bgy', `${y}px`)
          glow.style.opacity = '1'
        })

        animationId = requestAnimationFrame(animate)
      }

      animationId = requestAnimationFrame(animate)

      return () => {
        if (raf) cancelAnimationFrame(raf)
        if (animationId) cancelAnimationFrame(animationId)
      }
    }

    // Mouse tracking mode (default)
    const onMove = (e) => {
      const rect = wrap.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        glow.style.setProperty('--bgx', `${x}px`)
        glow.style.setProperty('--bgy', `${y}px`)
        glow.style.opacity = '1'
      })
    }

    const onLeave = () => {
      if (raf) cancelAnimationFrame(raf)
      if (!animated) {
        glow.style.opacity = '0'
      }
    }

    if (!animated) {
      wrap.addEventListener('mousemove', onMove, { passive: true })
      wrap.addEventListener('mouseleave', onLeave, { passive: true })
    }

    return () => {
      if (raf) cancelAnimationFrame(raf)
      if (animationId) cancelAnimationFrame(animationId)
      if (!animated) {
        wrap.removeEventListener('mousemove', onMove)
        wrap.removeEventListener('mouseleave', onLeave)
      }
    }
  }, [animated, edgeSensitivity])

  return (
    <div
      ref={wrapRef}
      className={`border-glow-root ${className}`}
      style={{ position: 'relative', borderRadius, ...style }}
    >
      {/* ── Glow layer (only visible on the border strip) ── */}
      <div
        ref={glowRef}
        aria-hidden="true"
        style={{
          // Positioned just outside the content box to cover the border
          position: 'absolute',
          inset: -borderWidth,
          borderRadius: borderRadius + borderWidth,
          // The padding creates the "border strip" that the mask will reveal
          padding: borderWidth,
          // Start invisible; onMove fades it in
          opacity: 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
          zIndex: 2,
          // Radial spotlight that follows the cursor (or animates)
          background: `radial-gradient(${glowRadius}px circle at var(--bgx, 50%) var(--bgy, 50%), rgba(${glowColor}, ${glowIntensity}), transparent ${coneSpread > 0 ? coneSpread : 70}%)`,
          // ── CSS mask trick: show gradient ONLY on the padding strip (border area) ──
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />
      {/* ── Content ── */}
      <div style={{ position: 'relative', zIndex: 1, borderRadius }}>
        {children}
      </div>
    </div>
  )
}
