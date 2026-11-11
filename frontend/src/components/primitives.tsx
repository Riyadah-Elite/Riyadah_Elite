import React, { useState, useEffect } from 'react';

/**
 * Unified React Native + Expo compatible primitives for Riyadah Elite.
 * Provides View, Text, Pressable, Image, ScrollView, FlatList, TextInput, ActivityIndicator,
 * SafeAreaView, TouchTarget, and KeyboardAvoidingView alongside responsive layout hooks:
 * - useWindowDimensions()
 * - useResponsiveLayout()
 * Cleanly maps across Web, iOS, Android, and Desktop platforms with Apple HIG 44x44pt touch compliance.
 */

export interface ViewProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'div' | 'section' | 'article' | 'header' | 'footer' | 'nav' | 'main' | 'aside';
  children?: React.ReactNode;
  testID?: string;
  id?: string;
}

export const View: React.FC<ViewProps> = ({
  as: Component = 'div',
  className = '',
  children,
  testID,
  id,
  ...rest
}) => {
  return (
    <Component id={id} className={className} data-testid={testID} {...rest}>
      {children}
    </Component>
  );
};

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'label' | 'div';
  children?: React.ReactNode;
  testID?: string;
  id?: string;
}

export const Text: React.FC<TextProps> = ({
  as: Component = 'span',
  className = '',
  children,
  testID,
  id,
  ...rest
}) => {
  return (
    <Component id={id} className={className} data-testid={testID} {...rest}>
      {children}
    </Component>
  );
};

export interface PressableProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onPress?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  minTouchTarget?: boolean;
  children?: React.ReactNode;
  testID?: string;
}

export const Pressable: React.FC<PressableProps> = ({
  onPress,
  onClick,
  minTouchTarget = false,
  className = '',
  children,
  type = 'button',
  testID,
  ...rest
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onPress) onPress(e);
    if (onClick) onClick(e);
  };

  const touchClasses = minTouchTarget
    ? 'min-h-[44px] min-w-[44px] inline-flex items-center justify-center'
    : '';

  return (
    <button
      type={type}
      onClick={handleClick}
      data-testid={testID}
      className={`cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-violet transition-all duration-150 ${touchClasses} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  source: { uri: string } | string;
  alt: string;
  fallbackLabel?: string;
  priority?: boolean;
}

export const Image: React.FC<ImageProps> = ({
  source,
  alt,
  fallbackLabel,
  priority = false,
  className = '',
  ...rest
}) => {
  const [hasError, setHasError] = useState(false);
  const resolvedUri = typeof source === 'string' ? source : source.uri;

  if (hasError || !resolvedUri) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-card via-elevated to-surface text-muted-fg p-4 text-center select-none ${className}`}
      >
        <span className="font-mono text-xs tracking-wider text-accent-violet-soft">RIYADAH ELITE ASSET</span>
        <span className="mt-1 text-xs font-medium text-secondary-fg">{fallbackLabel || alt}</span>
      </div>
    );
  }

  return (
    <img
      src={resolvedUri}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
      {...rest}
    />
  );
};

export const ScrollView: React.FC<ViewProps> = ({ className = '', children, ...rest }) => (
  <div className={`overflow-y-auto overflow-x-hidden ${className}`} {...rest}>
    {children}
  </div>
);

export interface FlatListProps<T> {
  data: readonly T[];
  keyExtractor: (item: T, index: number) => string;
  renderItem: (info: { item: T; index: number }) => React.ReactNode;
  ListEmptyComponent?: React.ReactNode;
  className?: string;
  testID?: string;
}

export function FlatList<T>({
  data,
  keyExtractor,
  renderItem,
  ListEmptyComponent,
  className = '',
  testID,
}: FlatListProps<T>) {
  if (!data || data.length === 0) {
    return <>{ListEmptyComponent || null}</>;
  }
  return (
    <div className={className} data-testid={testID}>
      {data.map((item, index) => (
        <React.Fragment key={keyExtractor(item, index)}>
          {renderItem({ item, index })}
        </React.Fragment>
      ))}
    </div>
  );
}

export interface TextInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChangeText?: (text: string) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  testID?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  onChangeText,
  onChange,
  className = '',
  testID,
  secureTextEntry,
  multiline,
  numberOfLines = 3,
  type,
  ...rest
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (onChangeText) onChangeText(e.target.value);
    if (onChange) onChange(e);
  };
  const inputType = secureTextEntry ? 'password' : (type || 'text');

  if (multiline) {
    const { ...textareaRest } = rest as any;
    return (
      <textarea
        rows={numberOfLines}
        onChange={handleChange}
        data-testid={testID}
        className={`focus:outline-none focus:ring-2 focus:ring-accent-violet transition-colors resize-y ${className}`}
        {...textareaRest}
      />
    );
  }

  return (
    <input
      type={inputType}
      onChange={handleChange}
      data-testid={testID}
      className={`focus:outline-none focus:ring-2 focus:ring-accent-violet transition-colors ${className}`}
      {...rest}
    />
  );
};

export const ActivityIndicator: React.FC<{ size?: 'sm' | 'md' | 'lg'; label?: string }> = ({
  size = 'md',
  label = 'Loading data...',
}) => {
  const dims = size === 'sm' ? 'w-4 h-4 border-2' : size === 'lg' ? 'w-8 h-8 border-3' : 'w-6 h-6 border-2';
  return (
    <div role="status" aria-label={label} className="inline-flex items-center gap-2.5">
      <span
        className={`${dims} rounded-full border-accent-violet border-t-transparent animate-spin inline-block`}
      />
      <span className="text-xs font-mono text-muted-fg">{label}</span>
    </div>
  );
};

export const SafeAreaView: React.FC<ViewProps> = ({ className = '', children, ...rest }) => (
  <div
    className={`w-full max-w-full overflow-x-clip pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)] pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)] ${className}`}
    {...rest}
  >
    {children}
  </div>
);

/**
 * TouchTarget — Enforces Apple Human Interface Guidelines and Material Design 44x44pt touch area.
 */
export interface TouchTargetProps extends React.HTMLAttributes<HTMLDivElement> {
  minSize?: number;
  children: React.ReactNode;
  testID?: string;
}

export const TouchTarget: React.FC<TouchTargetProps> = ({
  minSize = 44,
  className = '',
  children,
  testID,
  ...rest
}) => {
  return (
    <div
      data-testid={testID}
      style={{ minWidth: `${minSize}px`, minHeight: `${minSize}px` }}
      className={`inline-flex items-center justify-center ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};

/**
 * KeyboardAvoidingView — Universal cross-platform wrapper for mobile virtual keyboard handling.
 */
export interface KeyboardAvoidingViewProps extends ViewProps {
  behavior?: 'padding' | 'height' | 'position';
  keyboardVerticalOffset?: number;
}

export const KeyboardAvoidingView: React.FC<KeyboardAvoidingViewProps> = ({
  behavior = 'padding',
  keyboardVerticalOffset = 0,
  className = '',
  children,
  ...rest
}) => {
  return (
    <View
      className={`w-full transition-all duration-200 ${className}`}
      style={{ paddingBottom: keyboardVerticalOffset ? `${keyboardVerticalOffset}px` : undefined }}
      {...rest}
    >
      {children}
    </View>
  );
};

/**
 * React Native standard useWindowDimensions hook (Web & Cross-Platform compatible).
 */
export interface ScaledSize {
  width: number;
  height: number;
  scale: number;
  fontScale: number;
}

export function useWindowDimensions(): ScaledSize {
  const [dimensions, setDimensions] = useState<ScaledSize>(() => {
    if (typeof window !== 'undefined') {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
        scale: window.devicePixelRatio || 1,
        fontScale: 1,
      };
    }
    return { width: 1440, height: 900, scale: 1, fontScale: 1 };
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
        scale: window.devicePixelRatio || 1,
        fontScale: 1,
      });
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return dimensions;
}

/**
 * useResponsiveLayout — Multi-Screen Responsive Layout Engine
 * - Mobile Phones: < 768px (Single column, collapsible touch drawers, bottom nav tabs)
 * - Tablets: 768px - 1279px (Two-column adaptive grids, split panes, expanded headers)
 * - Large Desktop Monitors: >= 1280px (Multi-column Bento grids, wide telemetry, docked drawers)
 */
export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

export interface ResponsiveLayoutInfo extends ScaledSize {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  breakpoint: Breakpoint;
  orientation: 'portrait' | 'landscape';
  isTouch: boolean;
}

export function useResponsiveLayout(): ResponsiveLayoutInfo {
  const dims = useWindowDimensions();
  const isMobile = dims.width < 768;
  const isTablet = dims.width >= 768 && dims.width < 1280;
  const isDesktop = dims.width >= 1280;
  const breakpoint: Breakpoint = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';
  const orientation = dims.height >= dims.width ? 'portrait' : 'landscape';
  const isTouch =
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || (typeof navigator !== 'undefined' && (navigator.maxTouchPoints || 0) > 0));

  return {
    ...dims,
    isMobile,
    isTablet,
    isDesktop,
    breakpoint,
    orientation,
    isTouch,
  };
}

/**
 * Universal Vector Icon Wrapper
 * Provides clean cross-platform icon rendering bridging web SVGs and native icons
 */
export interface IconProps {
  name?: string;
  size?: number | string;
  color?: string;
  className?: string;
  style?: any;
  children?: React.ReactNode;
}

export const Icon: React.FC<IconProps> = ({
  size = 20,
  color = 'currentColor',
  className = '',
  style,
  children,
  ...rest
}) => {
  return (
    <span
      className={`inline-flex items-center justify-center ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: typeof size === 'number' ? `${size}px` : size,
        height: typeof size === 'number' ? `${size}px` : size,
        color,
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
};

