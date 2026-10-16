import { Text, Pressable } from "react-native";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-blue-600 active:bg-blue-700",
  secondary: "bg-neutral-200 active:bg-neutral-300 dark:bg-neutral-800 dark:active:bg-neutral-700",
  ghost: "bg-transparent active:bg-neutral-200 dark:active:bg-neutral-800",
};

const LABEL_VARIANTS: Record<ButtonVariant, string> = {
  primary: "text-white",
  secondary: "text-neutral-900 dark:text-neutral-100",
  ghost: "text-blue-600 dark:text-blue-400",
};

interface ButtonProps {
  children: ReactNode;
  onPress?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  className?: string;
}

export function Button({
  children,
  onPress,
  variant = "primary",
  disabled = false,
  className = "",
}: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      className={`items-center justify-center rounded-xl px-4 py-3 ${VARIANTS[variant]} ${disabled ? "opacity-50" : ""} ${className}`}
    >
      <Text className={`text-base font-semibold ${LABEL_VARIANTS[variant]}`}>
        {children}
      </Text>
    </Pressable>
  );
}