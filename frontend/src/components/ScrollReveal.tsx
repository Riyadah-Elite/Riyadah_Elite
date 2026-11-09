import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion, useInView } from 'motion/react';
import { theme, ThemeMode } from '../theme/theme';
import { MotionProfile, resolveMotionProfile } from '../utils/ecosystemRules';
import cinematicStyles from '../styles/CinematicStage.module.css';

/**
 * Riyadah Elite — 20-Variant Reusable Animation Library
 * Centralizes all entrance, spatial, and storytelling animations while respecting:
 * - Desktop (>=1024px), Tablet (768-1023px), and Mobile (<768px) motion profiles
 * - System prefers-reduced-motion accessibility
 * - Single exported theme object tokens (src/theme/theme.ts)
 */

export function useScrollProgress() {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const [progress, setProgress] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [viewportWidth, setViewportWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1440
  );

  useEffect(() => {
    let rafId: number | null = null;

    const update = () => {
      const currentY = window.scrollY || window.pageYOffset || 0;
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      setScrollY(currentY);
      setProgress(Math.min(1, Math.max(0, currentY / maxScroll)));
      setViewportWidth(window.innerWidth);
      rafId = null;
    };

    const onScrollOrResize = () => {
      if (rafId === null) {
        rafId = window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  const motionProfile: MotionProfile = resolveMotionProfile(
    viewportWidth,
    prefersReducedMotion
  );
  const isMobileViewport = motionProfile === 'mobile';
  const isTabletViewport = motionProfile === 'tablet';
  const heroExitRatio =
    motionProfile === 'reduced' || motionProfile === 'mobile'
      ? 0
      : Math.min(1, Math.max(0, scrollY / 620));

  return {
    progress,
    scrollY,
    heroExitRatio,
    viewportWidth,
    isMobileViewport,
    isTabletViewport,
    motionProfile,
  };
}

function useResponsiveProfile(): MotionProfile {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const [width, setWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1440
  );

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return resolveMotionProfile(width, prefersReducedMotion);
}

export function useSequenceProgress(
  mode: 'sticky' | 'traverse' = 'traverse',
  stickyOffset: number = 64
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const profile = useResponsiveProfile();
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    if (profile === 'reduced') {
      setProgress(1);
      return;
    }

    let rafId: number | null = null;
    const update = () => {
      const el = containerRef.current;
      if (!el) {
        rafId = null;
        return;
      }
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 900;

      if (mode === 'sticky') {
        const stickyHeight = Math.max(1, vh - stickyOffset);
        const scrollable = Math.max(1, rect.height - stickyHeight);
        const raw = (stickyOffset - rect.top) / scrollable;
        setProgress(Number(Math.min(1, Math.max(0, raw)).toFixed(3)));
      } else {
        const totalSpan = Math.max(1, rect.height + vh * 0.45);
        const raw = (vh * 0.82 - rect.top) / totalSpan;
        setProgress(Number(Math.min(1, Math.max(0, raw)).toFixed(3)));
      }
      rafId = null;
    };

    const onScrollOrResize = () => {
      if (rafId === null) {
        rafId = window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [mode, profile]);

  return { containerRef, progress, motionProfile: profile };
}


/* ============================================================================
   01. SPLIT TEXT REVEAL (Word-by-word or Line-by-line Clipping Mask)
============================================================================ */
export const SplitTextReveal: React.FC<{
  words: Array<{
    text: string;
    className?: string;
    underlineBarClass?: string;
  }>;
  as?: 'h1' | 'h2' | 'h3' | 'div';
  className?: string;
  style?: React.CSSProperties;
  baseDelay?: number;
  stagger?: number;
  triggerOnMount?: boolean;
}> = ({
  words,
  as: Tag = 'h2',
  className = '',
  style,
  baseDelay = 0.1,
  stagger = 0.1,
  triggerOnMount = false,
}) => {
  const profile = useResponsiveProfile();
  const containerRef = useRef<HTMLElement | null>(null);
  const isInViewObserver = useInView(containerRef, { once: true, amount: 0.05 });
  const [hasEnteredViewport, setHasEnteredViewport] = useState<boolean>(triggerOnMount);

  useEffect(() => {
    if (triggerOnMount || isInViewObserver) {
      setHasEnteredViewport(true);
      return;
    }
    const checkPosition = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.95 && rect.bottom > 0) {
        setHasEnteredViewport(true);
      }
    };
    checkPosition();
    window.addEventListener('scroll', checkPosition, { passive: true });
    return () => window.removeEventListener('scroll', checkPosition);
  }, [triggerOnMount, isInViewObserver]);

  const isVisible = triggerOnMount || isInViewObserver || hasEnteredViewport;
  const fullText = words.map((w) => w.text).join(' ');

  if (profile === 'reduced') {
    return (
      <Tag className={className} style={style}>
        {words.map((w, idx) => (
          <span
            key={idx}
            className={`inline-block mr-3 last:mr-0 ${w.className || ''}`}
          >
            {w.text}
          </span>
        ))}
      </Tag>
    );
  }

  const effectiveStagger = profile === 'mobile' ? stagger * 0.5 : stagger * 0.6;
  const duration = profile === 'mobile' ? 0.36 : 0.44;

  return (
    <Tag
      ref={containerRef as React.RefObject<any>}
      aria-label={fullText}
      className={className}
      style={style}
    >
      {words.map((w, idx) => (
        <span
          key={idx}
          aria-hidden="true"
          className="inline-block overflow-hidden pb-1.5 -mb-1.5 mr-3 last:mr-0 align-bottom"
        >
          <motion.span
            initial={{ y: '100%', opacity: 0 }}
            animate={
              isVisible
                ? { y: '0%', opacity: 1 }
                : { y: '100%', opacity: 0 }
            }
            transition={{
              duration,
              delay: baseDelay + idx * effectiveStagger,
              ease: theme.motion.easeOutExpo,
            }}
            className={`inline-block relative ${w.className || ''}`}
          >
            {w.text}
            {w.underlineBarClass && (
              <motion.span
                initial={{ scaleX: 0 }}
                animate={isVisible ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{
                  duration: 0.48,
                  delay: baseDelay + idx * effectiveStagger + 0.16,
                  ease: theme.motion.easeOutExpo,
                }}
                className={`block h-1.5 w-full origin-left mt-1 rounded-full ${w.underlineBarClass}`}
              />
            )}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
};

/* ============================================================================
   02. MASK REVEAL (Directional Inset Curtain + Inner Scale Settle)
============================================================================ */
export const MaskReveal: React.FC<{
  children: React.ReactNode;
  direction?: 'bottom-up' | 'top-down' | 'left-right' | 'right-left';
  delay?: number;
  duration?: number;
  className?: string;
  triggerOnMount?: boolean;
}> = ({
  children,
  direction = 'bottom-up',
  delay = 0,
  duration = theme.motion.durations.maskWipe,
  className = '',
  triggerOnMount = false,
}) => {
  const profile = useResponsiveProfile();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });
  const isVisible = triggerOnMount || isInView;

  if (profile === 'reduced') {
    return <div className={className}>{children}</div>;
  }

  const offsetMap = {
    'bottom-up': { x: 0, y: 16, curtainOrigin: 'origin-top', axis: 'Y' as const },
    'top-down': { x: 0, y: -16, curtainOrigin: 'origin-bottom', axis: 'Y' as const },
    'left-right': { x: -16, y: 0, curtainOrigin: 'origin-right', axis: 'X' as const },
    'right-left': { x: 16, y: 0, curtainOrigin: 'origin-left', axis: 'X' as const },
  }[direction];

  const effectiveDuration =
    profile === 'mobile' ? Math.min(0.46, duration) : duration;
  const effectiveDelay = profile === 'mobile' ? delay * 0.65 : delay;

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <motion.div
        initial={{
          opacity: 0,
          x: offsetMap.x,
          y: offsetMap.y,
          scale: profile === 'mobile' ? 0.99 : 0.96,
        }}
        animate={
          isVisible
            ? { opacity: 1, x: 0, y: 0, scale: 1 }
            : {
                opacity: 0,
                x: offsetMap.x,
                y: offsetMap.y,
                scale: profile === 'mobile' ? 0.99 : 0.96,
              }
        }
        transition={{
          duration: effectiveDuration,
          delay: effectiveDelay,
          ease: theme.motion.easeOutCubic,
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
      <motion.div
        aria-hidden="true"
        initial={
          offsetMap.axis === 'Y'
            ? { scaleY: 1, opacity: 0.85 }
            : { scaleX: 1, opacity: 0.85 }
        }
        animate={
          isVisible
            ? offsetMap.axis === 'Y'
              ? { scaleY: 0, opacity: 0 }
              : { scaleX: 0, opacity: 0 }
            : offsetMap.axis === 'Y'
            ? { scaleY: 1, opacity: 0.85 }
            : { scaleX: 1, opacity: 0.85 }
        }
        transition={{
          duration: effectiveDuration,
          delay: effectiveDelay,
          ease: theme.motion.easeOutExpo,
        }}
        className={`pointer-events-none absolute inset-0 z-20 ${cinematicStyles.shutterCurtainOverlay} ${offsetMap.curtainOrigin}`}
      />
    </div>
  );
};

/* ============================================================================
   03. CLIP-PATH WIPE (Diagonal or Horizontal Polygon Wipe)
============================================================================ */
export const ClipPathWipe: React.FC<{
  children: React.ReactNode;
  direction?: 'diagonal' | 'horizontal-left' | 'horizontal-right';
  delay?: number;
  className?: string;
}> = ({ children, direction = 'diagonal', delay = 0, className = '' }) => {
  const profile = useResponsiveProfile();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });

  if (profile === 'reduced') {
    return <div className={className}>{children}</div>;
  }

  const initialX =
    direction === 'horizontal-right' ? 20 : direction === 'horizontal-left' ? -20 : -14;
  const initialY = direction === 'diagonal' ? 12 : 0;
  const curtainOrigin =
    direction === 'horizontal-right' ? 'origin-left' : 'origin-right';

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <motion.div
        initial={{ opacity: 0, x: initialX, y: initialY, scale: 0.985 }}
        animate={
          isInView
            ? { opacity: 1, x: 0, y: 0, scale: 1 }
            : { opacity: 0, x: initialX, y: initialY, scale: 0.985 }
        }
        transition={{
          duration: profile === 'mobile' ? 0.44 : 0.62,
          delay: profile === 'mobile' ? delay * 0.6 : delay,
          ease: theme.motion.easeOutExpo,
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
      {profile !== 'mobile' && (
        <motion.div
          aria-hidden="true"
          initial={{ scaleX: 1, opacity: 0.85 }}
          animate={
            isInView ? { scaleX: 0, opacity: 0 } : { scaleX: 1, opacity: 0.85 }
          }
          transition={{
            duration: 0.58,
            delay,
            ease: theme.motion.easeOutExpo,
          }}
          className={`pointer-events-none absolute inset-0 z-20 ${cinematicStyles.shutterCurtainOverlay} ${curtainOrigin}`}
        />
      )}
    </div>
  );
};

/* ============================================================================
   04. BLUR-TO-SHARP (Restrained Focal Focus Reveal)
============================================================================ */
export const BlurToSharp: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
  triggerOnMount?: boolean;
}> = ({ children, delay = 0, className = '', triggerOnMount = false }) => {
  const profile = useResponsiveProfile();

  if (profile === 'reduced') {
    return <div className={className}>{children}</div>;
  }

  const initialFilter = profile === 'desktop' ? 'blur(5px)' : 'blur(0px)';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, filter: initialFilter, y: -6 }}
      animate={
        triggerOnMount
          ? { opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }
          : undefined
      }
      whileInView={
        !triggerOnMount
          ? { opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }
          : undefined
      }
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.48,
        delay,
        ease: theme.motion.easeOutExpo,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ============================================================================
   05. SCALE DEPTH (Controlled Z-Depth Transition)
============================================================================ */
export const ScaleDepth: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
}> = ({ children, delay = 0, className = '' }) => {
  const profile = useResponsiveProfile();

  if (profile === 'reduced') {
    return <div className={className}>{children}</div>;
  }

  const startScale = profile === 'desktop' ? 0.89 : profile === 'tablet' ? 0.93 : 0.96;

  return (
    <motion.div
      initial={{ opacity: 0, scale: startScale }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{
        duration: 0.56,
        delay: profile === 'mobile' ? delay * 0.65 : delay,
        ease: theme.motion.easeOutExpo,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ============================================================================
   06. DIRECTIONAL SLIDE (6-Vector Intentional Entrance)
============================================================================ */
export type DirectionalVector =
  | 'left'
  | 'right'
  | 'top'
  | 'bottom'
  | 'diagonal-tl'
  | 'diagonal-tr';

export const DirectionalSlide: React.FC<{
  children: React.ReactNode;
  direction?: DirectionalVector;
  delay?: number;
  distance?: number;
  className?: string;
  triggerOnMount?: boolean;
}> = ({
  children,
  direction = 'bottom',
  delay = 0,
  distance = 32,
  className = '',
  triggerOnMount = false,
}) => {
  const profile = useResponsiveProfile();

  if (profile === 'reduced') {
    return <div className={className}>{children}</div>;
  }

  const d =
    profile === 'mobile'
      ? Math.min(14, distance * 0.45)
      : profile === 'tablet'
      ? distance * 0.7
      : distance;

  const vectorMap: Record<DirectionalVector, { x: number; y: number }> = {
    left: { x: -d, y: 0 },
    right: { x: d, y: 0 },
    top: { x: 0, y: -d },
    bottom: { x: 0, y: d },
    'diagonal-tl': { x: -d, y: -d * 0.65 },
    'diagonal-tr': { x: d, y: -d * 0.65 },
  };

  const offset = vectorMap[direction];

  return (
    <motion.div
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      animate={triggerOnMount ? { opacity: 1, x: 0, y: 0 } : undefined}
      whileInView={!triggerOnMount ? { opacity: 1, x: 0, y: 0 } : undefined}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: profile === 'mobile' ? 0.42 : 0.54,
        delay: profile === 'mobile' ? delay * 0.65 : delay,
        ease: theme.motion.easeOutExpo,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ============================================================================
   08. FLOATING ELEMENT (Independent Continuous Telemetry Card Loops)
============================================================================ */
export type FloatingSignature =
  | 'vertical-bob'
  | 'horizontal-drift'
  | 'scale-breathe'
  | 'tilt-float';

export const FloatingElement: React.FC<{
  children: React.ReactNode;
  signature: FloatingSignature;
  className?: string;
}> = ({ children, signature, className = '' }) => {
  const profile = useResponsiveProfile();

  // Disable continuous floating on mobile (<768px) or reduced motion
  if (profile === 'reduced' || profile === 'mobile') {
    return <div className={className}>{children}</div>;
  }

  const amp = profile === 'tablet' ? 0.55 : 1;

  const signatureProps = {
    'vertical-bob': {
      animate: { y: [0, -6 * amp, 0] },
      transition: { duration: 5.2, repeat: Infinity, ease: 'easeInOut' as const, delay: 0.85 },
    },
    'horizontal-drift': {
      animate: { x: [0, 5 * amp, 0], y: [0, -2.5 * amp, 0] },
      transition: { duration: 6.0, repeat: Infinity, ease: 'easeInOut' as const, delay: 0.95 },
    },
    'scale-breathe': {
      animate: { scale: [1, 1 + 0.016 * amp, 1], y: [0, -4 * amp, 0] },
      transition: { duration: 5.6, repeat: Infinity, ease: 'easeInOut' as const, delay: 1.05 },
    },
    'tilt-float': {
      animate: { rotate: [0, -1.1 * amp, 0, 0.9 * amp, 0], y: [0, 4.5 * amp, 0] },
      transition: { duration: 6.4, repeat: Infinity, ease: 'easeInOut' as const, delay: 1.15 },
    },
  }[signature];

  return (
    <motion.div
      animate={signatureProps.animate}
      transition={signatureProps.transition}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ============================================================================
   09. RADIAL EXPANSION (Concentric Bauhaus Hub & Climax Expansion)
============================================================================ */
export const RadialExpansion: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
  triggerOnMount?: boolean;
}> = ({ children, delay = 0, className = '', triggerOnMount = false }) => {
  const profile = useResponsiveProfile();

  if (profile === 'reduced') {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: profile === 'mobile' ? 0.72 : 0.35,
      }}
      animate={triggerOnMount ? { opacity: 1, scale: 1 } : undefined}
      whileInView={!triggerOnMount ? { opacity: 1, scale: 1 } : undefined}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: profile === 'mobile' ? 0.48 : theme.motion.durations.radial,
        delay,
        ease: theme.motion.easeOutExpo,
      }}
      className={`origin-center ${className}`}
    >
      {children}
    </motion.div>
  );
};

/* ============================================================================
   10. SHAPE MORPH (Geometric Fragmentation -> Unified Convergence Lock)
============================================================================ */
export const ShapeMorph: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
}> = ({ children, delay = 0, className = '' }) => {
  const profile = useResponsiveProfile();

  if (profile === 'reduced') {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.88,
        rotate: profile === 'mobile' ? 0 : -4,
      }}
      whileInView={{
        opacity: 1,
        scale: 1,
        rotate: 0,
      }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: 0.65,
        delay,
        ease: theme.motion.easeOutCubic,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ============================================================================
   11. MOSAIC REVEAL (4-Quadrant Tile Assembly for Community & Bento Visuals)
============================================================================ */
export const MosaicReveal: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
}> = ({ children, delay = 0, className = '' }) => {
  const profile = useResponsiveProfile();

  if (profile === 'reduced') {
    return <div className={`relative overflow-hidden ${className}`}>{children}</div>;
  }

  // 4 Bauhaus geometric shutter tiles that retract outward in staggered sequence to assemble the visual
  const tiles = [
    { id: 'tl', pos: 'top-0 left-0 w-1/2 h-1/2', target: { x: '-102%', y: '-102%' }, delay: delay },
    { id: 'tr', pos: 'top-0 right-0 w-1/2 h-1/2', target: { x: '102%', y: '-102%' }, delay: delay + 0.08 },
    { id: 'bl', pos: 'bottom-0 left-0 w-1/2 h-1/2', target: { x: '-102%', y: '102%' }, delay: delay + 0.16 },
    { id: 'br', pos: 'bottom-0 right-0 w-1/2 h-1/2', target: { x: '102%', y: '102%' }, delay: delay + 0.24 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0.2, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.56, delay, ease: theme.motion.easeOutExpo }}
      className={`relative overflow-hidden ${className}`}
    >
      {children}
      {profile !== 'mobile' &&
        tiles.map((tile) => (
          <motion.div
            key={tile.id}
            aria-hidden="true"
            initial={{ x: '0%', y: '0%', opacity: 0.92 }}
            whileInView={{ ...tile.target, opacity: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.58,
              delay: tile.delay,
              ease: theme.motion.easeOutCubic,
            }}
            className={`pointer-events-none absolute z-20 ${cinematicStyles.mosaicShutterTile} ${tile.pos}`}
          />
        ))}
    </motion.div>
  );
};

/* ============================================================================
   12. PERSPECTIVE TILT CARD (Restrained Desktop 3D Hover Tilt)
============================================================================ */
export const PerspectiveTiltCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  maxTiltDeg?: number;
}> = ({ children, className = '', maxTiltDeg = 3.8 }) => {
  const profile = useResponsiveProfile();
  const [tilt, setTilt] = useState<{ rx: number; ry: number }>({ rx: 0, ry: 0 });

  if (profile !== 'desktop') {
    return <div className={className}>{children}</div>;
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / Math.max(1, rect.width) - 0.5;
    const ny = (e.clientY - rect.top) / Math.max(1, rect.height) - 0.5;
    setTilt({
      rx: Number((-ny * maxTiltDeg * 2).toFixed(2)),
      ry: Number((nx * maxTiltDeg * 2).toFixed(2)),
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(960px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transition: 'transform 180ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className={className}
    >
      {children}
    </div>
  );
};

/* ============================================================================
   13. SVG DRAW-ON TIMELINE HOOK (Section 06 Progressive Line + Step Illumination)
============================================================================ */
export function useStepProgressInView(stepCount: number) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeStep, setActiveStep] = useState<number>(stepCount);
  const [lineProgress, setLineProgress] = useState<number>(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let rafId: number | null = null;
    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight || 800;
        const ratio = (vh * 0.82 - rect.top) / Math.max(rect.height, 260);
        const clamped = Math.min(1, Math.max(0.25, ratio));
        setLineProgress(clamped);
        setActiveStep(Math.min(stepCount, Math.max(1, Math.ceil(clamped * stepCount))));
        rafId = null;
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, [stepCount]);

  return { containerRef, activeStep, lineProgress };
}

/* ============================================================================
   14. HORIZONTAL CASCADE (Alternating Left/Right Feature Cascade)
============================================================================ */
export const HorizontalCascade: React.FC<{
  children: React.ReactNode;
  index: number;
  className?: string;
}> = ({ children, index, className = '' }) => {
  const profile = useResponsiveProfile();

  if (profile === 'reduced') {
    return <div className={className}>{children}</div>;
  }

  const isEven = index % 2 === 0;
  const offset =
    profile === 'mobile'
      ? isEven
        ? -14
        : 14
      : profile === 'tablet'
      ? isEven
        ? -24
        : 24
      : isEven
      ? -36
      : 36;

  return (
    <motion.div
      initial={{ opacity: 0, x: offset, y: 10 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.14 }}
      transition={{
        duration: profile === 'mobile' ? 0.42 : 0.52,
        delay: (index % 4) * 0.07,
        ease: theme.motion.easeOutExpo,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ============================================================================
   15. PODIUM RISE (Independent #1 -> #2 -> #3 Competitive Podium Rise)
============================================================================ */
export const PodiumRise: React.FC<{
  children: React.ReactNode;
  rank: number;
  className?: string;
}> = ({ children, rank, className = '' }) => {
  const profile = useResponsiveProfile();

  if (profile === 'reduced') {
    return <div className={className}>{children}</div>;
  }

  // #1 rises first (0.06s), #2 rises second (0.18s), #3 rises third (0.30s)
  const rankDelay = rank === 1 ? 0.06 : rank === 2 ? 0.18 : 0.30;
  const startY = profile === 'mobile' ? 20 : rank === 1 ? 46 : rank === 2 ? 36 : 28;

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: startY,
        scaleY: profile === 'mobile' ? 0.96 : 0.86,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        scaleY: 1,
      }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{
        duration: 0.58,
        delay: rankDelay,
        ease: theme.motion.easeOutExpo,
      }}
      className={`origin-bottom ${className}`}
    >
      {children}
    </motion.div>
  );
};

/* ============================================================================
   16. ACCORDION EXPAND (Smooth Accessible Height & Opacity Expansion)
============================================================================ */
export const AccordionExpand: React.FC<{
  isOpen: boolean;
  id: string;
  labelledBy: string;
  children: React.ReactNode;
  className?: string;
}> = ({ isOpen, id, labelledBy, children, className = '' }) => {
  const profile = useResponsiveProfile();

  if (profile === 'reduced') {
    return isOpen ? (
      <div id={id} role="region" aria-labelledby={labelledBy} className={className}>
        {children}
      </div>
    ) : null;
  }

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          id={id}
          role="region"
          aria-labelledby={labelledBy}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.24, ease: theme.motion.easeOutExpo }}
          className="overflow-hidden"
        >
          <div className={className}>{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ============================================================================
   17. STRUCTURAL LINE DRAW (Bauhaus Axis & Divider Line Draw)
============================================================================ */
export const StructuralLineDraw: React.FC<{
  orientation?: 'horizontal' | 'vertical';
  delay?: number;
  className?: string;
  triggerOnMount?: boolean;
}> = ({
  orientation = 'horizontal',
  delay = 0,
  className = '',
  triggerOnMount = false,
}) => {
  const profile = useResponsiveProfile();

  if (profile === 'reduced') {
    return <div aria-hidden="true" className={className} />;
  }

  const initial = orientation === 'horizontal' ? { scaleX: 0 } : { scaleY: 0 };
  const target = orientation === 'horizontal' ? { scaleX: 1 } : { scaleY: 1 };
  const originClass = orientation === 'horizontal' ? 'origin-left' : 'origin-top';

  return (
    <motion.div
      aria-hidden="true"
      initial={initial}
      animate={triggerOnMount ? target : undefined}
      whileInView={!triggerOnMount ? target : undefined}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.62,
        delay,
        ease: theme.motion.easeOutExpo,
      }}
      className={`${originClass} ${className}`}
    />
  );
};

/* ============================================================================
   18. IMAGE ZOOM FRAME (Contained Artwork Settle + Hover Zoom)
============================================================================ */
export const ImageZoomFrame: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  const profile = useResponsiveProfile();

  if (profile === 'reduced') {
    return <div className={`overflow-hidden ${className}`}>{children}</div>;
  }

  return (
    <div className={`overflow-hidden group/zoom ${className}`}>
      <motion.div
        initial={{ scale: 1.07 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.68, ease: theme.motion.easeOutCubic }}
        className="w-full h-full transition-transform duration-500 group-hover/zoom:scale-105"
      >
        {children}
      </motion.div>
    </div>
  );
};

/* ============================================================================
   19. NUMBER TRANSITION (Verified Real Data Counter with Tabular-Nums)
============================================================================ */
export const AnimatedMetricValue: React.FC<{
  value: number;
  prefix?: string;
  suffix?: string;
  formatLocale?: boolean;
  className?: string;
}> = ({
  value,
  prefix = '',
  suffix = '',
  formatLocale = true,
  className = '',
}) => {
  const profile = useResponsiveProfile();
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.25 });
  const [displayValue, setDisplayValue] = useState<number>(value);

  useEffect(() => {
    if (profile === 'reduced' || !isInView) {
      setDisplayValue(value);
      return;
    }

    let rafId: number | null = null;
    const durationMs = 780;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / durationMs);
      // easeOutQuart
      const eased = 1 - Math.pow(1 - t, 4);
      setDisplayValue(Math.round(value * eased));
      if (t < 1) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        setDisplayValue(value);
      }
    };

    rafId = window.requestAnimationFrame(tick);
    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, [value, isInView, profile]);

  const formatted = formatLocale ? displayValue.toLocaleString() : String(displayValue);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};

/* ============================================================================
   20. MAGNETIC MICROINTERACTION (Restrained Desktop Pointer Response on CTAs)
============================================================================ */
export const MagneticButton: React.FC<{
  children: React.ReactNode;
  className?: string;
  maxOffset?: number;
}> = ({ children, className = '', maxOffset = 4 }) => {
  const profile = useResponsiveProfile();
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  if (profile !== 'desktop') {
    return <div className={`inline-block ${className}`}>{children}</div>;
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / Math.max(1, rect.width) - 0.5;
    const ny = (e.clientY - rect.top) / Math.max(1, rect.height) - 0.5;
    setOffset({
      x: Number((nx * maxOffset * 2).toFixed(2)),
      y: Number((ny * maxOffset * 2).toFixed(2)),
    });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition: 'transform 150ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className={`inline-block ${className}`}
    >
      {children}
    </div>
  );
};

/* ============================================================================
   UNIFIED NAMED SCROLL REVEAL WRAPPER (Supports All Directional & Scale Presets)
============================================================================ */
export type RevealVariant =
  | 'fade-up'
  | 'fade-down'
  | 'slide-left'
  | 'slide-right'
  | 'scale-up'
  | 'bauhaus-skew'
  | 'quiet-settle';

interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = theme.motion.durations.entrance,
  className = '',
  once = true,
}) => {
  const profile = useResponsiveProfile();

  if (profile === 'reduced') {
    return <div className={className}>{children}</div>;
  }

  const isMobile = profile === 'mobile';
  const distance = isMobile ? 12 : profile === 'tablet' ? 20 : 28;

  const getInitial = () => {
    switch (variant) {
      case 'fade-down':
        return { opacity: 0, y: -distance };
      case 'slide-left':
        return { opacity: 0, x: -distance };
      case 'slide-right':
        return { opacity: 0, x: distance };
      case 'scale-up':
        return { opacity: 0, scale: isMobile ? 0.98 : 0.94, y: distance * 0.4 };
      case 'bauhaus-skew':
        return { opacity: 0, y: distance, scale: 0.96 };
      case 'quiet-settle':
        return { opacity: 0, y: 8 };
      case 'fade-up':
      default:
        return { opacity: 0, y: distance };
    }
  };

  return (
    <motion.div
      initial={getInitial()}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once, amount: 0.14 }}
      transition={{
        duration: isMobile ? Math.min(0.42, duration) : duration,
        delay: isMobile ? delay * 0.65 : delay,
        ease: theme.motion.easeOutExpo,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ============================================================================
   BAUHAUS GEOMETRIC SECTION HEADER & CONNECTOR BADGE
============================================================================ */
export const BauhausSectionBadge: React.FC<{
  index: string;
  label: string;
  accent: 'violet' | 'cyan' | 'blue' | 'crimson';
  mode: ThemeMode;
}> = ({ index, label, accent }) => {
  const colorMap = {
    violet: {
      block: 'bg-accent-violet text-white',
      text: 'text-accent-violet-soft',
      line: 'bg-accent-violet/40',
    },
    cyan: {
      block: 'bg-accent-cyan text-inverse-fg',
      text: 'text-accent-cyan',
      line: 'bg-accent-cyan/40',
    },
    blue: {
      block: 'bg-accent-blue text-white',
      text: 'text-accent-blue',
      line: 'bg-accent-blue/40',
    },
    crimson: {
      block: 'bg-status-danger text-white',
      text: 'text-status-danger',
      line: 'bg-status-danger/45',
    },
  }[accent];

  return (
    <div className="inline-flex items-center gap-3">
      <span
        className={`w-7 h-7 font-mono text-xs font-extrabold inline-flex items-center justify-center shrink-0 ${colorMap.block}`}
      >
        {index}
      </span>
      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${colorMap.block}`} aria-hidden="true" />
      <span className={`font-mono text-xs font-semibold tracking-wider uppercase ${colorMap.text}`}>
        {label}
      </span>
      <StructuralLineDraw
        orientation="horizontal"
        className={`hidden sm:inline-block w-12 h-[2px] ${colorMap.line}`}
      />
    </div>
  );
};
