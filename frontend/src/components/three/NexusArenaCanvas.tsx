'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export interface NexusArenaCanvasProps {
  readonly activePhase?: 'PLAY' | 'TEST' | 'WIN';
  readonly progress?: number;
  readonly className?: string;
}

// Module-scope reusable objects to guarantee zero GC allocations inside the render loop
const _dummy = new THREE.Object3D();
const _instanceColor = new THREE.Color();

function detectSoftwareWebGL(): boolean {
  if (typeof document === 'undefined') return true;
  try {
    const probeCanvas = document.createElement('canvas');
    const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

export const NexusArenaCanvas: React.FC<NexusArenaCanvasProps> = ({
  activePhase = 'PLAY',
  progress = 0,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const phaseRef = useRef<'PLAY' | 'TEST' | 'WIN'>(activePhase);
  const progressRef = useRef<number>(progress);
  const [webglReady, setWebglReady] = useState<boolean>(true);

  useEffect(() => {
    phaseRef.current = activePhase;
    progressRef.current = progress;
  }, [activePhase, progress]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container || typeof window === 'undefined') return;

    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      const isSoftwareGl = detectSoftwareWebGL();
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.12;
      renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
      renderer.shadowMap.enabled = !isSoftwareGl;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      const width = Math.max(320, container.clientWidth || 960);
      const height = Math.max(240, container.clientHeight || 540);
      renderer.setSize(width, height, false);
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      renderer.domElement.style.display = 'block';
      renderer.domElement.setAttribute('data-testid', 'three-nexus-arena-webgl');

      container.innerHTML = '';
      container.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x0b0d12, 0.042);

      // Studio PBR Environment Map via RoomEnvironment + PMREMGenerator
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = envTexture;
      pmremGenerator.dispose();

      const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 120);
      camera.position.set(0, 2.2, 8.8);
      camera.lookAt(0, 0.2, 0);

      // 3-Point Studio Lighting Rig (Warm/Violet Key + Cool Cyan Hemisphere + Electric Blue Rim)
      const hemiLight = new THREE.HemisphereLight(0x22d3ee, 0x0b0d12, 0.85);
      hemiLight.position.set(0, 12, 0);
      scene.add(hemiLight);

      const keyLight = new THREE.DirectionalLight(0xf8fafc, 1.8);
      keyLight.position.set(6, 9, 7);
      scene.add(keyLight);

      const rimLight = new THREE.PointLight(0x8b5cf6, 4.5, 24, 1.8);
      rimLight.position.set(-5, 3, -4);
      scene.add(rimLight);

      // Composite 6-Part Procedural 3D Cyber-Esports Arena Citadel Group
      const citadelGroup = new THREE.Group();
      scene.add(citadelGroup);

      // Part 1: Octagonal Arena Platform Base
      const baseGeo = new THREE.CylinderGeometry(3.4, 3.8, 0.28, 8, 1);
      const baseMat = new THREE.MeshStandardMaterial({
        color: 0x11141c,
        metalness: 0.88,
        roughness: 0.22,
      });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      baseMesh.position.y = -1.65;
      citadelGroup.add(baseMesh);

      // Part 2: Central Citadel Spire Core
      const spireGeo = new THREE.OctahedronGeometry(1.15, 0);
      const spireMat = new THREE.MeshStandardMaterial({
        color: 0x8b5cf6,
        emissive: 0x8b5cf6,
        emissiveIntensity: 0.35,
        metalness: 0.92,
        roughness: 0.18,
      });
      const spireMesh = new THREE.Mesh(spireGeo, spireMat);
      spireMesh.position.y = 0.15;
      citadelGroup.add(spireMesh);

      // Part 3: Outer Geodesic Wireframe Arena Dome
      const cageGeo = new THREE.IcosahedronGeometry(2.45, 1);
      const cageMat = new THREE.MeshStandardMaterial({
        color: 0x22d3ee,
        emissive: 0x22d3ee,
        emissiveIntensity: 0.45,
        wireframe: true,
        transparent: true,
        opacity: 0.38,
      });
      const cageMesh = new THREE.Mesh(cageGeo, cageMat);
      cageMesh.position.y = 0.15;
      citadelGroup.add(cageMesh);

      // Part 4: Inner Telemetry Gyro Ring (Bright Cyan #22D3EE)
      const innerRingGeo = new THREE.TorusGeometry(1.85, 0.035, 12, 64);
      const innerRingMat = new THREE.MeshStandardMaterial({
        color: 0x22d3ee,
        emissive: 0x22d3ee,
        emissiveIntensity: 0.65,
        metalness: 0.75,
        roughness: 0.25,
      });
      const innerRingMesh = new THREE.Mesh(innerRingGeo, innerRingMat);
      innerRingMesh.position.y = 0.15;
      innerRingMesh.rotation.x = Math.PI / 2.8;
      citadelGroup.add(innerRingMesh);

      // Part 5: Outer Competitive Orbital Ring (Electric Blue #3B82F6)
      const outerRingGeo = new THREE.TorusGeometry(2.95, 0.04, 12, 72);
      const outerRingMat = new THREE.MeshStandardMaterial({
        color: 0x3b82f6,
        emissive: 0x3b82f6,
        emissiveIntensity: 0.55,
        metalness: 0.85,
        roughness: 0.2,
      });
      const outerRingMesh = new THREE.Mesh(outerRingGeo, outerRingMat);
      outerRingMesh.position.y = 0.15;
      outerRingMesh.rotation.x = -Math.PI / 3.2;
      citadelGroup.add(outerRingMesh);

      // Part 6: Volumetric Cyber Particle Field via THREE.InstancedMesh (72 instances)
      const particleCount = 72;
      const particleGeo = new THREE.OctahedronGeometry(0.065, 0);
      const particleMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
      });
      const instancedParticles = new THREE.InstancedMesh(particleGeo, particleMat, particleCount);
      const paletteHexes = [0x8b5cf6, 0x22d3ee, 0x3b82f6];
      const particleSeeds: Array<{ radius: number; angle: number; y: number; speed: number }> = [];

      for (let i = 0; i < particleCount; i++) {
        const radius = 2.2 + (i % 9) * 0.45;
        const angle = (i / particleCount) * Math.PI * 2;
        const y = -1.4 + ((i * 17) % 36) * 0.1;
        const speed = 0.18 + (i % 5) * 0.06;
        particleSeeds.push({ radius, angle, y, speed });

        _dummy.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
        const scale = 0.75 + (i % 4) * 0.2;
        _dummy.scale.set(scale, scale, scale);
        _dummy.updateMatrix();
        instancedParticles.setMatrixAt(i, _dummy.matrix);
        _instanceColor.setHex(paletteHexes[i % paletteHexes.length]);
        instancedParticles.setColorAt(i, _instanceColor);
      }
      instancedParticles.instanceMatrix.needsUpdate = true;
      if (instancedParticles.instanceColor) instancedParticles.instanceColor.needsUpdate = true;
      instancedParticles.computeBoundingSphere();
      scene.add(instancedParticles);

      if (!isSoftwareGl) {
        renderer.compile(scene, camera);
      }

      let frameId = 0;
      let isDisposed = false;
      const timer = new THREE.Timer();

      const afterDraw = (cb: () => void) => {
        if (!renderer || isDisposed) return;
        const gl = renderer.getContext() as WebGL2RenderingContext;
        if (!gl || typeof gl.fenceSync !== 'function') {
          frameId = window.setTimeout(cb, 80);
          return;
        }
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (isDisposed) return;
          const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (state === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      };

      const renderFrame = () => {
        if (!renderer || isDisposed) return;
        timer.update();
        const delta = Math.min(timer.getDelta(), 0.1);
        const elapsed = timer.getElapsed();

        const targetCameraZ = 8.8 - progressRef.current * 1.4;
        camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCameraZ, 4, delta);

        // Phase-reactive emissive tinting (PLAY -> Violet, TEST -> Cyan, WIN -> Electric Blue)
        const targetSpireHex =
          phaseRef.current === 'PLAY'
            ? 0x8b5cf6
            : phaseRef.current === 'TEST'
              ? 0x22d3ee
              : 0x3b82f6;
        spireMat.color.setHex(targetSpireHex);
        spireMat.emissive.setHex(targetSpireHex);

        if (!prefersReducedMotion) {
          citadelGroup.rotation.y += delta * 0.24;
          spireMesh.rotation.y -= delta * 0.45;
          innerRingMesh.rotation.z += delta * 0.55;
          outerRingMesh.rotation.y -= delta * 0.32;

          for (let i = 0; i < particleCount; i++) {
            const p = particleSeeds[i];
            const a = p.angle + elapsed * p.speed;
            _dummy.position.set(
              Math.cos(a) * p.radius,
              p.y + Math.sin(elapsed * 1.2 + i) * 0.12,
              Math.sin(a) * p.radius
            );
            _dummy.rotation.y = a;
            _dummy.updateMatrix();
            instancedParticles.setMatrixAt(i, _dummy.matrix);
          }
          instancedParticles.instanceMatrix.needsUpdate = true;
        }

        renderer.render(scene, camera);

        if (prefersReducedMotion) return;
        if (isSoftwareGl) {
          afterDraw(renderFrame);
        } else {
          frameId = window.requestAnimationFrame(renderFrame);
        }
      };

      // Initial render pass
      renderFrame();

      const handleResize = () => {
        if (!container || !renderer || isDisposed) return;
        const nextW = Math.max(320, container.clientWidth || 960);
        const nextH = Math.max(240, container.clientHeight || 540);
        camera.aspect = nextW / nextH;
        camera.updateProjectionMatrix();
        renderer.setSize(nextW, nextH, false);
      };

      const handleContextLost = (e: Event) => {
        e.preventDefault();
        setWebglReady(false);
      };
      const handleContextRestored = () => {
        setWebglReady(true);
      };

      window.addEventListener('resize', handleResize);
      renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored);

      return () => {
        isDisposed = true;
        window.cancelAnimationFrame(frameId);
        window.clearTimeout(frameId);
        window.removeEventListener('resize', handleResize);
        if (renderer) {
          renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
          renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);
        }
        baseGeo.dispose();
        baseMat.dispose();
        spireGeo.dispose();
        spireMat.dispose();
        cageGeo.dispose();
        cageMat.dispose();
        innerRingGeo.dispose();
        innerRingMat.dispose();
        outerRingGeo.dispose();
        outerRingMat.dispose();
        particleGeo.dispose();
        particleMat.dispose();
        envTexture.dispose();
        renderer?.dispose();
        timer.dispose?.();
      };
    } catch {
      setWebglReady(false);
      return undefined;
    }
  }, []);

  return (
    <div
      ref={mountRef}
      data-testid="nexus-3d-canvas-container"
      data-webgl-ready={webglReady ? 'true' : 'false'}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden opacity-75 ${className}`}
    />
  );
};
