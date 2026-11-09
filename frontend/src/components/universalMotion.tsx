import React from 'react';

/**
 * Universal Motion Fallback Bridge for Riyadah Elite
 * Provides cross-platform compatibility for motion/react primitives across Web, iOS, and Android
 */

const createMotionComponent = (tag: string) => {
  const Component = React.forwardRef<any, any>((props, ref) => {
    const {
      initial,
      animate,
      exit,
      transition,
      variants,
      whileHover,
      whileTap,
      whileInView,
      viewport,
      layout,
      layoutId,
      children,
      className,
      style,
      ...rest
    } = props || {};

    return React.createElement(
      tag,
      {
        ref,
        className,
        style,
        ...rest,
      },
      children
    );
  });
  Component.displayName = `motion.${tag}`;
  return Component;
};

const tags = [
  'div',
  'span',
  'section',
  'article',
  'header',
  'footer',
  'nav',
  'main',
  'aside',
  'p',
  'h1',
  'h2',
  'h3',
  'h4',
  'button',
  'ul',
  'li',
  'a',
  'img',
];

const motionTarget: Record<string, any> = {};
for (const tag of tags) {
  motionTarget[tag] = createMotionComponent(tag);
}

export const motion = new Proxy(motionTarget, {
  get(target, prop: string) {
    if (!target[prop]) {
      target[prop] = createMotionComponent(prop);
    }
    return target[prop];
  },
});

export const AnimatePresence: React.FC<{ children?: React.ReactNode }> = ({ children }) => <>{children}</>;
export const useReducedMotion = () => false;
export const useInView = () => true;
export const useScroll = () => ({ scrollYProgress: { get: () => 0 } });
export const useTransform = (_value: any, _input: any, output: any) => (Array.isArray(output) ? output[0] : 0);
export const useSpring = (value: any) => value;

export default {
  motion,
  AnimatePresence,
  useReducedMotion,
  useInView,
  useScroll,
  useTransform,
  useSpring,
};

