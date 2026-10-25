import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export function RobotModel(props: any) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/ai_robot.glb');

  useFrame((state) => {
    if (group.current) {
      const t = state.clock.getElapsedTime();
      group.current.position.y = Math.sin(t * 1.5) * 0.12 - 0.2;
      group.current.rotation.y = Math.sin(t * 0.5) * 0.25;
    }
  });

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={scene} scale={1.8} position={[0, -0.4, 0]} />
    </group>
  );
}

useGLTF.preload('/models/ai_robot.glb');
