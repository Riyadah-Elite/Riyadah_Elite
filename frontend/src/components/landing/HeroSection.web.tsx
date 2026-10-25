/* eslint-disable react/no-unknown-property */
import React, { Suspense, useEffect, useRef, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { Canvas } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import { HeroScene3D } from '@/components/3d/HeroScene3D.web';
import Ionicons from '@expo/vector-icons/Ionicons';
import { gsap } from 'gsap';

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
  const controllerX = isMobile ? 0 : 1.35;

  return (
    <section
      id="hero"
      ref={heroContainerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full min-h-[760px] lg:min-h-[850px] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#F8FCFF] via-[#F1F7FD] to-[#F8FCFF] pt-24 pb-16 select-none"
    >
      {/* 1. Atmospheric Ambient Lighting (Continuous light-first gradient, subtle depth) */}
      <div className="absolute top-1/4 right-1/4 w-[650px] h-[550px] bg-gradient-to-br from-cyan-100/25 via-sky-100/15 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -top-12 left-10 w-[450px] h-[350px] bg-sky-100/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#F8FCFF] to-transparent pointer-events-none z-10" />

      {/* 2. Full-Bleed 3D Controller Canvas */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <Suspense
          fallback={
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-cyan-700 pointer-events-auto">
              <ActivityIndicator size="large" color="#0891B2" />
              <span className="text-xs font-semibold text-neutral-400">Loading Riyadah Nexus...</span>
            </div>
          }
        >
          <Canvas
            camera={{ position: [0, 0.04, 3.8], fov: isMobile ? 54 : 45 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
          >
            {/* Studio-Grade Lighting tuned for DualSense materials */}
            <ambientLight intensity={1.25} />
            <directionalLight position={[4, 6, 5]} intensity={1.8} color="#FFFFFF" />
            <directionalLight position={[-4, 1, 3]} intensity={0.7} color="#BAE6FD" />
            <directionalLight position={[0, 4, -4]} intensity={0.85} color="#E0E7FF" />
            <pointLight position={[controllerX, isMobile ? -0.3 : 0.5, 1.5]} intensity={0.5} color="#38BDF8" />

            <HeroScene3D
              scrollProgress={scrollProgress}
              isMobile={isMobile}
              pointerRef={pointerRef}
            />

            {/* Soft, realistic floor shadow directly under controller grips */}
            <ContactShadows
              position={[controllerX, isMobile ? -0.98 : -0.42, 0]}
              opacity={0.32}
              scale={isMobile ? 2.2 : 2.4}
              blur={2.2}
              far={2.2}
              color="#0B192C"
            />
          </Canvas>
        </Suspense>
      </div>

      {/* 3. Protected Content Layer (Left Typography, Center/Right Controller space) */}
      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 relative z-20 pointer-events-none">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Side: Headline, Intro, CTAs, Statistics */}
          <div className="lg:col-span-6 flex flex-col items-start pr-0 lg:pr-6 pointer-events-auto">
            {/* Badge */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div
                ref={badgeRef}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-100/90 border border-cyan-200/80 text-cyan-900 text-xs font-bold uppercase tracking-wider shadow-xs backdrop-blur-sm"
              >
                <span className="w-2 h-2 rounded-full bg-[#0891B2] animate-pulse" />
                THE RIYADAH NEXUS • NEXT-GEN ESPORTS & QA
              </div>
            </div>

            {/* Headline */}
            <div ref={headlineRef}>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-[#172B3A] tracking-tight leading-[1.06] mb-6 drop-shadow-xs">
                Play. Test.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0891B2] via-cyan-500 to-[#8B5CF6]">
                  Compete.
                </span>{' '}
                Create.
              </h1>
            </div>

            {/* Description */}
            <div ref={descRef}>
              <p className="text-lg sm:text-xl text-[#5B7083] font-normal leading-relaxed max-w-xl mb-8 drop-shadow-xs">
                Join Riyadah Elite — the premier regional esports and game-testing ecosystem uniting players, developers, and studios through real-time telemetry feedback and high-stakes tournaments.
              </p>
            </div>

            {/* CTAs */}
            <div ref={ctaRef} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <a
                href="#testing"
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-base bg-[#0891B2] hover:bg-[#0E7490] text-white shadow-lg shadow-cyan-600/25 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <span>Explore Playtests</span>
                <Ionicons name="arrow-forward" size={18} color="white" />
              </a>

              <a
                href="#explore"
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-base bg-white/95 hover:bg-white text-[#172B3A] border border-neutral-200/80 shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <Ionicons name="game-controller-outline" size={20} color="#0891B2" />
                <span>Browse Games</span>
              </a>
            </div>

            {/* Mobile visual space slot to allow the 3D controller to breathe between buttons and stats */}
            <div className="block lg:hidden h-72 w-full my-4 pointer-events-none" />

            {/* Statistics Strip */}
            <div
              ref={statsRef}
              className="grid grid-cols-3 gap-6 pt-8 mt-6 border-t border-neutral-200/80 w-full max-w-md text-left"
            >
              <div>
                <p className="text-2xl font-black text-[#172B3A]">100%</p>
                <p className="text-xs text-[#5B7083] font-medium">Verified Studios</p>
              </div>
              <div>
                <p className="text-2xl font-black text-[#172B3A]">Instant</p>
                <p className="text-xs text-[#5B7083] font-medium">Telemetry QA</p>
              </div>
              <div>
                <p className="text-2xl font-black text-[#172B3A]">Direct</p>
                <p className="text-xs text-[#5B7083] font-medium">Escrow Rewards</p>
              </div>
            </div>
          </div>

          {/* Right Side: Reserved Visual Space for 3D controller */}
          <div className="hidden lg:flex lg:col-span-6 flex-col items-end justify-center pointer-events-none" />
        </div>

        {/* Category Quick-Nav Dock (inspired by gradient-gaming-competition-landing-page) */}
        <div className="mt-14 pt-8 border-t border-cyan-100/80 pointer-events-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href="#explore"
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/80 hover:bg-white border border-neutral-200/80 hover:border-cyan-300 shadow-2xs hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-50 text-[#0891B2] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Ionicons name="game-controller-outline" size={20} color="#0891B2" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-[#172B3A] uppercase tracking-wide group-hover:text-[#0891B2] transition-colors">
                  Games Hub
                </span>
                <span className="text-[11px] text-[#5B7083] font-medium">Curated Alpha Builds</span>
              </div>
            </a>

            <a
              href="#testing"
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/80 hover:bg-white border border-neutral-200/80 hover:border-cyan-300 shadow-2xs hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Ionicons name="shield-checkmark-outline" size={20} color="#10B981" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-[#172B3A] uppercase tracking-wide group-hover:text-emerald-700 transition-colors">
                  QA Bounties
                </span>
                <span className="text-[11px] text-[#5B7083] font-medium">Telemetry Logging</span>
              </div>
            </a>

            <a
              href="#tournaments"
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/80 hover:bg-white border border-neutral-200/80 hover:border-violet-300 shadow-2xs hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-violet-50 text-[#8B5CF6] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Ionicons name="trophy-outline" size={20} color="#8B5CF6" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-[#172B3A] uppercase tracking-wide group-hover:text-[#8B5CF6] transition-colors">
                  Tournaments
                </span>
                <span className="text-[11px] text-[#5B7083] font-medium">Weekly Tiered Cups</span>
              </div>
            </a>

            <a
              href="#rewards"
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/80 hover:bg-white border border-neutral-200/80 hover:border-amber-300 shadow-2xs hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Ionicons name="gift-outline" size={20} color="#D97706" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-[#172B3A] uppercase tracking-wide group-hover:text-amber-700 transition-colors">
                  Rewards
                </span>
                <span className="text-[11px] text-[#5B7083] font-medium">Keys & Contributor XP</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
