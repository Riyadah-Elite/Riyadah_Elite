import { useCallback, useState } from 'react';
import { Platform } from 'react-native';

/**
 * Hover is a web affordance; on touch there is no pointer to enter or leave.
 * Returning empty handlers keeps Pressable props identical on every platform.
 */
export function useHover() {
  const [hovered, setHovered] = useState(false);

  const onHoverIn = useCallback(() => setHovered(true), []);
  const onHoverOut = useCallback(() => setHovered(false), []);

  return {
    hovered,
    hoverProps:
      Platform.OS === 'web'
        ? { onHoverIn, onHoverOut }
        : ({} as { onHoverIn?: () => void; onHoverOut?: () => void }),
  };
}
