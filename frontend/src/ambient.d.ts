// Ambient type declarations for Riyadah Elite cross-platform hybrid build

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.css' {
  const content: string;
  export default content;
}

declare module 'lucide-react';
declare module 'motion/react';

declare module 'three' {
  export type WebGLRenderer = any;
  export type Scene = any;
  export type PerspectiveCamera = any;
  export type PMREMGenerator = any;
  export type Mesh = any;
  export type Group = any;
  export type InstancedMesh = any;
  export type Matrix4 = any;
  export type Object3D = any;

  export const WebGLRenderer: any;
  export const SRGBColorSpace: any;
  export const ACESFilmicToneMapping: any;
  export const PCFSoftShadowMap: any;
  export const FogExp2: any;
  export const AmbientLight: any;
  export const DirectionalLight: any;
  export const PointLight: any;
  export const HemisphereLight: any;
  export const BoxGeometry: any;
  export const IcosahedronGeometry: any;
  export const OctahedronGeometry: any;
  export const TorusGeometry: any;
  export const CylinderGeometry: any;
  export const RingGeometry: any;
  export const MeshStandardMaterial: any;
  export const MeshPhysicalMaterial: any;
  export const MeshBasicMaterial: any;
  export const Color: any;
  export const Scene: any;
  export const PerspectiveCamera: any;
  export const PMREMGenerator: any;
  export const Group: any;
  export const Mesh: any;
  export const InstancedMesh: any;
  export const Matrix4: any;
  export const Object3D: any;
  export const Clock: any;
  export const Timer: any;
  export const MathUtils: any;
}

declare module 'three/addons/environments/RoomEnvironment.js' {
  export class RoomEnvironment {
    constructor(...args: any[]);
  }
}
