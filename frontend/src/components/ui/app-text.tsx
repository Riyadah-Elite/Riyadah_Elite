import { Text, type TextProps } from 'react-native';

import { Palette, Typography } from '@/constants/design';

type Variant = keyof typeof Typography;

interface AppTextProps extends TextProps {
  variant?: Variant;
  color?: string;
}

/** Text with the design system's type ramp. `style` always wins last. */
export function AppText({ variant = 'body', color, style, ...props }: AppTextProps) {
  return (
    <Text
      {...props}
      style={[Typography[variant], color ? { color } : null, style]}
      allowFontScaling={props.allowFontScaling ?? true}
    />
  );
}

export { Palette };
