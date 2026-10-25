/* eslint-disable react/no-unknown-property */
import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface PointerState {
  x: number;
  y: number;
  active: boolean;
}

interface HeroScene3DProps {
  scrollProgress?: number;
  isMobile?: boolean;
  pointerRef?: React.RefObject<PointerState>;
  prefersReducedMotion?: boolean;
}

/**
 * Riyadah Elite — 3D Game Controller Hero Scene
 *
 * Minimalist, premium composition featuring the PlayStation 5 controller
 * as the primary visual centerpiece, normalized to 35-45% desktop hero width.
 *
 * Features whole-controller pointer parallax and subtle pitch/yaw rotation,
 * smooth damping, gentle idle float, and steady scroll-driven camera framing.
 */
export function HeroScene3D({
  scrollProgress = 0,
  isMobile = false,
  pointerRef,
  prefersReducedMotion = false,
}: HeroScene3DProps) {
  const { camera } = useThree();

  const mainGroupRef = useRef<THREE.Group>(null);
  const controllerPosGroupRef = useRef<THREE.Group>(null);
  const controllerRotGroupRef = useRef<THREE.Group>(null);

  // Load the optimized PlayStation 5 controller model (6.58 MB)
  const controllerGLTF = useGLTF('/models/ps5_controller.optimized.glb');

  // Clone scene once to ensure isolated instance
  const controllerScene = useMemo(() => controllerGLTF.scene.clone(true), [controllerGLTF.scene]);

  // Target vectors for camera interpolation
  const currentCamPos = useMemo(() => new THREE.Vector3(0, 0.04, 3.8), []);
  const currentLookAt = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  const baseCamPos = useMemo(() => new THREE.Vector3(0, 0.04, 3.8), []);
  const baseLookAt = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  const targetCamPos = useMemo(() => new THREE.Vector3(0, 0.04, 3.8), []);
  const targetLookAt = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  const initializedRef = useRef(false);

  // Smoothed normalized pointer (-1 to 1)
  const smoothPointer = useRef({ x: 0, y: 0 });

  // Flattering 3/4 resting Euler rotation
  // Tilted backward and slightly turned so face buttons, both analog sticks,
  // touchpad, and ergonomic curves are clearly visible.
  const restingRotation = useMemo(() => ({
    x: -0.26, // Tilt backward to angle sticks and face buttons up
    y: -0.38, // 3/4 yaw towards center-left
    z: 0.05,  // Subtle dynamic roll
  }), []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const sp = Math.min(Math.max(scrollProgress, 0), 1);

    // ==========================================
    // 1. SMOOTH POINTER INTERPOLATION
    // ==========================================
    const rawX = (!prefersReducedMotion && pointerRef?.current?.active) ? (pointerRef.current.x ?? 0) : 0;
    const rawY = (!prefersReducedMotion && pointerRef?.current?.active) ? (pointerRef.current.y ?? 0) : 0;

    smoothPointer.current.x = THREE.MathUtils.damp(smoothPointer.current.x, rawX, 4.0, delta);
    smoothPointer.current.y = THREE.MathUtils.damp(smoothPointer.current.y, rawY, 4.0, delta);

    const px = smoothPointer.current.x;
    const py = smoothPointer.current.y;

    // ==========================================
    // 2. STEADY CAMERA SCROLL INTERPOLATION
    // ==========================================
    if (sp <= 0.25) {
      // Stage 1: Arrival & Hero View (0.00 - 0.25)
      const subT = sp / 0.25;
      baseCamPos.set(
        (isMobile ? 0 : subT * 0.03),
        (isMobile ? -0.55 : 0.04) + subT * 0.02,
        (isMobile ? 4.0 : 3.8) - subT * 0.12
      );
      baseLookAt.set(0, (isMobile ? -0.65 : 0.0), 0);
    } else if (sp <= 0.6) {
      // Stage 2: Discovery & Focus (0.25 - 0.60)
      const subT = (sp - 0.25) / 0.35;
      baseCamPos.set(
        (isMobile ? 0 : 0.03 - subT * 0.02),
        (isMobile ? -0.53 : 0.06) + subT * 0.03,
        (isMobile ? 3.9 : 3.68) + subT * 0.08
      );
      baseLookAt.set(0, (isMobile ? -0.65 : 0.0) + subT * 0.02, 0);
    } else if (sp <= 0.85) {
      // Stage 3: Steady Overview (0.60 - 0.85)
      const subT = (sp - 0.6) / 0.25;
      baseCamPos.set(
        (isMobile ? 0 : 0.01 - subT * 0.02),
        (isMobile ? -0.50 : 0.09) + subT * 0.06,
        (isMobile ? 4.0 : 3.76) + subT * 0.12
      );
      baseLookAt.set(0, (isMobile ? -0.63 : 0.02) - subT * 0.02, 0);
    } else {
      // Stage 4: Seamless Transition (0.85 - 1.00)
      const subT = (sp - 0.85) / 0.15;
      baseCamPos.set(
        (isMobile ? 0 : -0.01 - subT * 0.02),
        (isMobile ? -0.42 : 0.15) + subT * 0.14,
        (isMobile ? 4.15 : 3.88) + subT * 0.15
      );
      baseLookAt.set(0, (isMobile ? -0.7 : -0.0) - subT * 0.12, 0);
    }

    // Complementary subtle camera parallax from pointer
    const camParallaxX = px * 0.05;
    const camParallaxY = py * 0.03;
    targetCamPos.set(baseCamPos.x + camParallaxX, baseCamPos.y + camParallaxY, baseCamPos.z);
    targetLookAt.set(baseLookAt.x + camParallaxX * 0.15, baseLookAt.y + camParallaxY * 0.15, baseLookAt.z);

    if (!initializedRef.current) {
      currentCamPos.copy(targetCamPos);
      currentLookAt.copy(targetLookAt);
      camera.position.copy(currentCamPos);
      camera.lookAt(currentLookAt);
      initializedRef.current = true;
    } else {
      currentCamPos.lerp(targetCamPos, delta * 3.8);
      camera.position.copy(currentCamPos);

      currentLookAt.lerp(targetLookAt, delta * 3.8);
      camera.lookAt(currentLookAt);
    }

    // ==========================================
    // 3. WHOLE-CONTROLLER POINTER INTERACTION & IDLE
    // ==========================================
    // Gentle idle floating animation
    const idleFloat = Math.sin(t * 1.4) * 0.02;
    const idleSway = Math.sin(t * 0.9) * 0.014;

    // Responsive Controller Rotation (Yaw, Pitch, Roll)
    if (controllerRotGroupRef.current) {
      const targetPitch = restingRotation.x + (-py * 0.10) + Math.cos(t * 0.7) * 0.01;
      const targetYaw = restingRotation.y + (px * 0.16) + idleSway;
      const targetRoll = restingRotation.z + (px * 0.035);

      controllerRotGroupRef.current.rotation.x = THREE.MathUtils.damp(
        controllerRotGroupRef.current.rotation.x,
        targetPitch,
        4.0,
        delta
      );
      controllerRotGroupRef.current.rotation.y = THREE.MathUtils.damp(
        controllerRotGroupRef.current.rotation.y,
        targetYaw,
        4.0,
        delta
      );
      controllerRotGroupRef.current.rotation.z = THREE.MathUtils.damp(
        controllerRotGroupRef.current.rotation.z,
        targetRoll,
        4.0,
        delta
      );
    }

    // Responsive Controller Position Parallax
    if (controllerPosGroupRef.current) {
      const targetPosX = px * 0.05;
      const targetPosY = idleFloat + (py * 0.03);

      controllerPosGroupRef.current.position.x = THREE.MathUtils.damp(
        controllerPosGroupRef.current.position.x,
        targetPosX,
        3.5,
        delta
      );
      controllerPosGroupRef.current.position.y = THREE.MathUtils.damp(
        controllerPosGroupRef.current.position.y,
        targetPosY,
        3.5,
        delta
      );
    }
  });

  // Normalized Staging Group Position & Scale
  // Desktop: scale 0.54 yields 1.08m width (approx. 38% desktop hero width), positioned at x: 1.35
  // Mobile: scale 0.45 yields 0.90m width, centered at x: 0, y: -0.68 inside the dedicated mobile slot
  const groupX = isMobile ? 0 : 1.35;
  const groupY = isMobile ? -0.68 : 0.0;
  const mainScale = isMobile ? 0.45 : 0.54;

  return (
    <group ref={mainGroupRef} position={[groupX, groupY, 0]} scale={mainScale}>
      {/* Controller Actor with Position & Rotation Groups */}
      <group ref={controllerPosGroupRef} position={[0, 0, 0]}>
        <group ref={controllerRotGroupRef}>
          <primitive object={controllerScene} position={[0, 0, 0]} />
        </group>
      </group>
    </group>
  );
}

// Preload the verified optimized controller model
useGLTF.preload('/models/ps5_controller.optimized.glb');
