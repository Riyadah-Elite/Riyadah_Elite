/* eslint-disable react/no-unknown-property */
import React, { Suspense, useEffect, useRef, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { Canvas } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import { HeroScene3D } from '@/components/3d/HeroScene3D.web';
import Ionicons from '@expo/vector-icons/Ionicons';
import { gsap } from 'gsap';

interface SceneErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
}

interface SceneErrorBoundaryState {
  hasError: boolean;
}

class SceneErrorBoundary extends React.Component<SceneErrorBoundaryProps, SceneErrorBoundaryState> {
  constructor(props: SceneErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.warn('[HeroSection] WebGL/3D scene error handled gracefully:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export function HeroSection() {
  const headlineRef = useRef<HTMLDivElement | null>(null);
  const badgeRef = useRef<HTMLDivElement | null>(null);
  const descRef = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const statsRef = useRef<HTMLDivElement | null>(null);
  const heroContainerRef = useRef<HTMLElement | null>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Mutable pointer ref for 60fps tracking without triggering React re-renders
  const pointerRef = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < 1024);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
      const ctx = gsap.context(() => {
        if (badgeRef.current) {
          gsap.from(badgeRef.current, { y: -12, opacity: 0, duration: 0.6, ease: 'power2.out' });
        }
        if (headlineRef.current) {
          gsap.from(headlineRef.current, { y: 20, opacity: 0, duration: 0.8, delay: 0.1, ease: 'power2.out' });
        }
        if (descRef.current) {
          gsap.from(descRef.current, { y: 15, opacity: 0, duration: 0.7, delay: 0.2, ease: 'power2.out' });
        }
        if (ctaRef.current) {
          gsap.from(ctaRef.current, { y: 15, opacity: 0, duration: 0.7, delay: 0.3, ease: 'power2.out' });
        }
        if (statsRef.current) {
          gsap.from(statsRef.current, { y: 15, opacity: 0, duration: 0.7, delay: 0.4, ease: 'power2.out' });
        }
      });

      // Smooth normalized scroll progress tracking (0.00 to 1.00)
      const handleScroll = () => {
        if (!heroContainerRef.current) return;
        const rect = heroContainerRef.current.getBoundingClientRect();
        const heroHeight = rect.height || 720;
        const p = Math.min(Math.max(-rect.top / heroHeight, 0), 1);
        setScrollProgress(p);
      };

      window.addEventListener('scroll', handleScroll, { passive: true });

      return () => {
        ctx.revert();
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);
      };
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handle pointer tracking relative to the hero container
  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!heroContainerRef.current) return;
    const rect = heroContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    pointerRef.current.x = Math.max(-1, Math.min(1, x));
    pointerRef.current.y = Math.max(-1, Math.min(1, y));
    pointerRef.current.active = true;
  };

  const handlePointerLeave = () => {
    pointerRef.current.active = false;
  };

  // Normalized controller world position
  const controllerX = isMobile ? 0 : 1.30;

  return (
    <section
      id="hero"
      ref={heroContainerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full min-h-[780px] lg:min-h-[860px] flex items-center justify-center overflow-hidden bg-[#F4FAFE] pt-24 pb-16 select-none"
    >
      {/* 1. Atmospheric Esports Arena Environment (Light-first ambient lighting + technical grid) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(8, 168, 200, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(8, 168, 200, 0.05) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at 50% 40%, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 40%, black 40%, transparent 80%)',
        }}
      />

      {/* Arena Cyan & Violet Spotlight Spill */}
      <div className="absolute top-1/4 right-[15%] w-[680px] h-[580px] bg-gradient-to-br from-cyan-300/20 via-sky-200/15 to-violet-300/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-16 left-8 w-[480px] h-[380px] bg-cyan-100/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#F4FAFE] to-transparent pointer-events-none z-10" />

      {/* 2. Full-Bleed 3D Controller Canvas with Graceful Error Boundary */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <SceneErrorBoundary
          fallback={
            <div
              className="w-full h-full flex items-center justify-center pointer-events-none"
              style={{ transform: `translateX(${isMobile ? 0 : 25}%)` }}
            >
              <div className="relative w-72 h-72 sm:w-88 sm:h-88 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/25 via-sky-300/15 to-violet-400/15 rounded-full blur-2xl" />
                <img
                  src="/assets/hardware/handheld_console.png"
                  alt="Riyadah Gaming Arena Controller"
                  className="w-56 sm:w-68 object-contain drop-shadow-2xl opacity-90"
                />
              </div>
            </div>
          }
        >
          <Suspense
            fallback={
              <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-cyan-700 pointer-events-auto">
                <ActivityIndicator size="large" color="#08A8C8" />
                <span className="text-xs font-semibold text-neutral-400">Initializing Arena Stage...</span>
              </div>
            }
          >
            <Canvas
              camera={{ position: [0, 0.04, 3.8], fov: isMobile ? 54 : 45 }}
              dpr={[1, 1.5]}
              gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
              style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
            >
              {/* Studio-Grade Arena Lighting tuned for DualSense materials */}
              <ambientLight intensity={1.15} color="#EBF5FF" />
              {/* Key Front-Right Spotlight */}
              <directionalLight position={[4.5, 6.0, 5.0]} intensity={2.2} color="#FFFFFF" />
              {/* Electric Cyan Rim Highlight on left grip/triggers */}
              <directionalLight position={[-4.2, 1.8, 3.2]} intensity={1.35} color="#36D9EE" />
              {/* Restrained Violet Back-Accent for subtle warm-cool contrast */}
              <directionalLight position={[3.2, -1.5, -3.2]} intensity={1.1} color="#8057F5" />
              {/* Localized subtle controller glow */}
              <pointLight position={[controllerX, isMobile ? -0.3 : 0.5, 1.5]} intensity={0.6} color="#08A8C8" />

              <HeroScene3D
                scrollProgress={scrollProgress}
                isMobile={isMobile}
                pointerRef={pointerRef}
              />

              {/* Soft, realistic floor shadow directly under controller grips */}
              <ContactShadows
                position={[controllerX, isMobile ? -0.96 : -0.42, 0]}
                opacity={0.34}
                scale={isMobile ? 2.2 : 2.5}
                blur={2.4}
                far={2.4}
                color="#0B1A2C"
              />
            </Canvas>
          </Suspense>
        </SceneErrorBoundary>
      </div>

      {/* 3. Protected Content Layer (Left Typography, Center/Right Controller space) */}
      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 relative z-20 pointer-events-none">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Side: Headline, Intro, CTAs, Statistics */}
          <div className="lg:col-span-6 flex flex-col items-start pr-0 lg:pr-6 pointer-events-auto">
            {/* Eyebrow Arena Badge */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div
                ref={badgeRef}
                className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-950 text-xs font-mono font-bold uppercase tracking-wider shadow-xs backdrop-blur-md"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#08A8C8]" />
                </span>
                RIYADAH ARENA • ESPORTS & QA ECOSYSTEM
              </div>
            </div>

            {/* Headline */}
            <div ref={headlineRef}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[66px] font-black text-[#14283A] tracking-tight leading-[1.05] mb-6">
                Play. Test. Compete.{' '}
                <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-[#08A8C8] via-[#0284C7] to-[#8057F5]">
                  Built for What’s Next.
                </span>
              </h1>
            </div>

            {/* Description */}
            <div ref={descRef}>
              <p className="text-base sm:text-lg text-[#647B91] font-normal leading-relaxed max-w-xl mb-8">
                The premier competitive gaming and quality assurance ecosystem uniting verified game studios, elite squads, and dedicated playtesters across the Middle East. Stress-test pre-release builds with real-time frame telemetry and compete in official tournament ladders.
              </p>
            </div>

            {/* CTAs */}
            <div ref={ctaRef} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <a
                href="#testing"
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm tracking-wide bg-[#08A8C8] hover:bg-[#068EA9] text-white shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Explore Playtest Waves</span>
                <Ionicons name="arrow-forward" size={17} color="white" />
              </a>

              <a
                href="#tournaments"
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm tracking-wide bg-white/95 hover:bg-white text-[#14283A] border border-[#DCE8F0] hover:border-cyan-300 shadow-xs backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Ionicons name="trophy-outline" size={18} color="#8057F5" />
                <span>Championship Brackets</span>
              </a>
            </div>

            {/* Mobile visual space slot to allow the 3D controller to breathe between buttons and stats */}
            <div className="block lg:hidden h-72 w-full my-4 pointer-events-none" />

            {/* Capability Row (Verified Technical Facts) */}
            <div
              ref={statsRef}
              className="grid grid-cols-3 gap-6 pt-8 mt-6 border-t border-[#DCE8F0] w-full max-w-lg text-left"
            >
              <div>
                <p className="text-lg sm:text-xl font-black text-[#14283A] tracking-tight">Telemetry QA</p>
                <p className="text-[11px] font-mono text-[#647B91] font-medium mt-0.5">Frame Diagnostics</p>
              </div>
              <div>
                <p className="text-lg sm:text-xl font-black text-[#14283A] tracking-tight">Studio Builds</p>
                <p className="text-[11px] font-mono text-[#647B91] font-medium mt-0.5">Verified Alphas</p>
              </div>
              <div>
                <p className="text-lg sm:text-xl font-black text-[#14283A] tracking-tight">Escrow Vault</p>
                <p className="text-[11px] font-mono text-[#647B91] font-medium mt-0.5">Verified Rewards</p>
              </div>
            </div>
          </div>

          {/* Right Side: Reserved Visual Space for 3D controller */}
          <div className="hidden lg:flex lg:col-span-6 flex-col items-end justify-center pointer-events-none" />
        </div>

        {/* Category Quick-Nav Dock (Interactive Arena Portal Navigation) */}
        <div className="mt-14 pt-8 border-t border-[#DCE8F0]/80 pointer-events-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href="#explore"
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/80 hover:bg-white border border-[#DCE8F0] hover:border-cyan-300 shadow-2xs hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-50 text-[#08A8C8] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Ionicons name="game-controller-outline" size={20} color="#08A8C8" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-[#14283A] uppercase tracking-wide group-hover:text-[#08A8C8] transition-colors">
                  Games Hub
                </span>
                <span className="text-[11px] text-[#647B91] font-medium">Curated Alpha Builds</span>
              </div>
            </a>

            <a
              href="#testing"
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/80 hover:bg-white border border-[#DCE8F0] hover:border-cyan-300 shadow-2xs hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Ionicons name="shield-checkmark-outline" size={20} color="#10B981" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-[#14283A] uppercase tracking-wide group-hover:text-emerald-700 transition-colors">
                  QA Bounties
                </span>
                <span className="text-[11px] text-[#647B91] font-medium">Telemetry Logging</span>
              </div>
            </a>

            <a
              href="#tournaments"
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/80 hover:bg-white border border-[#DCE8F0] hover:border-violet-300 shadow-2xs hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-violet-50 text-[#8057F5] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Ionicons name="trophy-outline" size={20} color="#8057F5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-[#14283A] uppercase tracking-wide group-hover:text-[#8057F5] transition-colors">
                  Tournaments
                </span>
                <span className="text-[11px] text-[#647B91] font-medium">Weekly Tiered Cups</span>
              </div>
            </a>

            <a
              href="#rewards"
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/80 hover:bg-white border border-[#DCE8F0] hover:border-amber-300 shadow-2xs hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Ionicons name="gift-outline" size={20} color="#D97706" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-[#14283A] uppercase tracking-wide group-hover:text-amber-700 transition-colors">
                  Rewards
                </span>
                <span className="text-[11px] text-[#647B91] font-medium">Keys & Contributor XP</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
