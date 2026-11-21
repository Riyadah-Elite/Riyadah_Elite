import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { Fonts, Palette, Radius, Typography } from '@/constants/design';

interface TextFieldProps
  extends Pick<
    TextInputProps,
    | 'autoCapitalize'
    | 'autoComplete'
    | 'keyboardType'
    | 'returnKeyType'
    | 'textContentType'
    | 'maxLength'
    | 'onSubmitEditing'
    | 'inputMode'
    | 'autoCorrect'
    | 'multiline'
    | 'numberOfLines'
  > {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  secure?: boolean;
  error?: string;
  hint?: string;
  editable?: boolean;
}

export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  secure = false,
  error,
  hint,
  editable = true,
  ...inputProps
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);
  const borderColor = error ? Palette.danger : focused ? Palette.primary : 'transparent';

  const fieldShadow: ViewStyle =
    Platform.OS === 'web'
      ? ({
          boxShadow: error
            ? 'inset 2px 2px 5px rgba(11,36,71,0.08), inset -2px -2px 5px rgba(255,255,255,0.90), 0 0 0 3px rgba(220,38,38,0.14)'
            : focused
              ? 'inset 2px 2px 5px rgba(11,36,71,0.08), inset -2px -2px 5px rgba(255,255,255,0.90), 0 0 0 3px rgba(23,105,255,0.16)'
              : 'inset 2px 2px 5px rgba(11,36,71,0.08), inset -2px -2px 5px rgba(255,255,255,0.90)',
        } as ViewStyle)
      : {};

  return (
    <View style={styles.group}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      </View>

      <View
        style={[
          styles.field,
          {
            borderColor,
            backgroundColor: focused ? Palette.elevated : Palette.surfaceDim,
            opacity: editable ? 1 : 0.6,
          },
          fieldShadow,
        ]}>
        {icon ? (
          <Ionicons
            name={icon}
            size={16}
            color={focused ? Palette.primary : Palette.textDim}
          />
        ) : null}

        <TextInput
          {...inputProps}
          accessibilityLabel={label}
          editable={editable}
          onBlur={() => setFocused(false)}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          placeholder={placeholder}
          placeholderTextColor={Palette.textFaint}
          secureTextEntry={secure && hidden}
          selectionColor={Palette.primary}
          style={styles.input}
          value={value}
        />

        {secure ? (
          <Pressable
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
            accessibilityRole="button"
            hitSlop={8}
            onPress={() => setHidden((current) => !current)}
            style={({ pressed }) => pressed && { opacity: 0.6 }}>
            <Ionicons
              name={hidden ? 'eye-outline' : 'eye-off-outline'}
              size={17}
              color={Palette.textDim}
            />
          </Pressable>
        ) : null}
      </View>

      {error ? (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle" size={12} color={Palette.danger} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    ...Typography.labelTight,
    color: Palette.textMuted,
  },
  hint: {
    ...Typography.labelTight,
    color: Palette.textFaint,
    fontSize: 9,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 50,
    paddingHorizontal: 13,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingVertical: 0,
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Palette.text,
    ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : {}),
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  errorText: {
    fontFamily: Fonts.body,
    fontSize: 11,
    lineHeight: 16,
    color: Palette.danger,
  },
});
