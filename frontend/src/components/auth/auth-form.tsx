import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { Fonts, Palette, Radius, Space, Typography } from '@/constants/design';
import { getApiErrorMessage } from '@/lib/api';
import { pickAvatar, type PickedAvatar } from '@/lib/media';
import {
  loginSchema,
  registerSchema,
  toFieldErrors,
  type FieldErrors,
} from '@/lib/schemas';
import { useAuth } from '@/providers/auth-provider';
import { useAuthModal, type AuthMode } from '@/providers/auth-modal-provider';
import { useToast } from '@/providers/toast-provider';

import { Button } from '../ui/button';
import { TextField } from '../ui/text-field';

interface FormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const EMPTY: FormValues = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
};

interface AuthFormProps {
  mode: AuthMode;
  onSwitch: (mode: AuthMode) => void;
  compact?: boolean;
}

/**
 * The single authentication form used by both surfaces: the web dialog and the
 * native route. Validation mirrors the server's Joi schema, but the API remains
 * the authority - server messages are surfaced in the banner and as a toast.
 */
export function AuthForm({ mode, onSwitch, compact = false }: AuthFormProps) {
  const { login, register } = useAuth();
  const { finishAuth } = useAuthModal();
  const { showToast } = useToast();

  const [values, setValues] = useState<FormValues>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors<keyof FormValues>>({});
  const [avatar, setAvatar] = useState<PickedAvatar | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [picking, setPicking] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function update(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));

    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  }

  async function chooseAvatar() {
    setAvatarError(null);
    setPicking(true);

    try {
      const picked = await pickAvatar();
      if (picked) setAvatar(picked);
    } catch (error) {
      setAvatarError(getApiErrorMessage(error));
    } finally {
      setPicking(false);
    }
  }

  async function handleSubmit() {
    if (submitting) return;

    setFormError(null);

    const schema = mode === 'login' ? loginSchema : registerSchema;
    const result = schema.safeParse(
      mode === 'login'
        ? { email: values.email, password: values.password }
        : values,
    );

    if (!result.success) {
      setErrors(toFieldErrors<keyof FormValues>(result.error.issues));
      return;
    }

    const chosenAvatar = avatar;

    setSubmitting(true);

    try {
      if (mode === 'login') {
        await login(values.email, values.password);
      } else {
        if (!chosenAvatar) {
          setAvatarError('A profile image is required to enlist.');
          setSubmitting(false);
          return;
        }

        await register({
          username: values.username,
          email: values.email,
          password: values.password,
          avatar: chosenAvatar,
        });
      }

      showToast({
        title: mode === 'login' ? 'Session restored' : 'Operative enlisted',
        message:
          mode === 'login'
            ? 'Welcome back to the arena. Your ladder is live.'
            : 'Your account is ready. The ladder is now open to you.',
        variant: 'success',
      });

      const destination = finishAuth();

      if (destination) {
        router.replace(destination);
      } else if (Platform.OS !== 'web') {
        router.replace('/');
      }
    } catch (error) {
      const message = getApiErrorMessage(error);
      setFormError(message);
      showToast({
        title: mode === 'login' ? 'Sign in failed' : 'Enlistment failed',
        message,
        variant: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={[styles.root, compact && styles.rootCompact]}>
      <View style={styles.heading}>
        <View style={styles.eyebrowRow}>
          <View style={styles.marker} />
          <Text style={styles.eyebrow}>
            {mode === 'login' ? 'Session access' : 'New operative'}
          </Text>
        </View>

        <Text style={styles.title}>
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </Text>

        <Text style={styles.subtitle}>
          {mode === 'login'
            ? 'Sign in to restore your rank, notifications and tournament access.'
            : 'Create one account for testing points, rank history and tournament brackets.'}
        </Text>
      </View>

      {formError ? (
        <View accessibilityRole="alert" style={styles.banner}>
          <Ionicons name="alert-circle" size={15} color={Palette.danger} />
          <Text style={styles.bannerText}>{formError}</Text>
        </View>
      ) : null}

      <View style={styles.fields}>
        {mode === 'register' ? (
          <View style={styles.avatarBlock}>
            <View style={styles.avatarPreview}>
              {avatar ? (
                <Image
                  accessibilityLabel="Selected avatar preview"
                  contentFit="cover"
                  source={{ uri: avatar.uri }}
                  style={styles.avatarImage}
                  transition={160}
                />
              ) : (
                <Ionicons name="person-outline" size={24} color={Palette.textDim} />
              )}
            </View>

            <View style={styles.avatarCopy}>
              <Text style={styles.avatarTitle}>Profile image</Text>
              <Text style={styles.avatarHint}>JPG or PNG · max 5 MB · required</Text>

              <Pressable
                accessibilityRole="button"
                disabled={picking}
                onPress={() => void chooseAvatar()}
                style={({ pressed }) => [
                  styles.avatarButton,
                  pressed && { opacity: 0.75 },
                  picking && { opacity: 0.6 },
                ]}>
                {picking ? (
                  <ActivityIndicator color={Palette.primaryBright} size="small" />
                ) : (
                  <Ionicons name="image-outline" size={14} color={Palette.primaryBright} />
                )}
                <Text style={styles.avatarButtonText}>
                  {avatar ? 'Replace image' : 'Choose image'}
                </Text>
              </Pressable>
            </View>

            {avatarError ? (
              <View style={styles.avatarError}>
                <Ionicons name="alert-circle" size={11} color={Palette.danger} />
                <Text style={styles.avatarErrorText}>{avatarError}</Text>
              </View>
            ) : null}
          </View>
        ) : null}

        {mode === 'register' ? (
          <TextField
            autoCapitalize="none"
            autoComplete="username"
            error={errors.username}
            icon="person-outline"
            label="Username"
            onChangeText={(value) => update('username', value)}
            placeholder="nightfall"
            returnKeyType="next"
            textContentType="username"
            value={values.username}
          />
        ) : null}

        <TextField
          autoCapitalize="none"
          autoComplete="email"
          error={errors.email}
          icon="mail-outline"
          inputMode="email"
          keyboardType="email-address"
          label="Email"
          onChangeText={(value) => update('email', value)}
          placeholder="operative@riyadah.gg"
          returnKeyType="next"
          textContentType="emailAddress"
          value={values.email}
        />

        <TextField
          autoCapitalize="none"
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          error={errors.password}
          hint={mode === 'register' ? '8+ characters' : undefined}
          icon="lock-closed-outline"
          label="Password"
          onChangeText={(value) => update('password', value)}
          onSubmitEditing={mode === 'login' ? () => void handleSubmit() : undefined}
          placeholder={mode === 'login' ? 'Your password' : 'Create a password'}
          returnKeyType={mode === 'login' ? 'go' : 'next'}
          secure
          textContentType={mode === 'login' ? 'password' : 'newPassword'}
          value={values.password}
        />

        {mode === 'register' ? (
          <TextField
            autoCapitalize="none"
            autoComplete="new-password"
            error={errors.confirmPassword}
            icon="shield-checkmark-outline"
            label="Confirm password"
            onChangeText={(value) => update('confirmPassword', value)}
            onSubmitEditing={() => void handleSubmit()}
            placeholder="Repeat your password"
            returnKeyType="go"
            secure
            textContentType="newPassword"
            value={values.confirmPassword}
          />
        ) : null}
      </View>

      <Button
        fullWidth
        icon={mode === 'login' ? 'log-in-outline' : 'arrow-forward'}
        label={mode === 'login' ? 'Sign in' : 'Create account'}
        loading={submitting}
        onPress={() => void handleSubmit()}
        size="lg"
      />

      {mode === 'register' ? (
        <Text style={styles.legal}>
          By enlisting you accept the arena rulebook and fair-play policy. Your session is secured
          with an HttpOnly token.
        </Text>
      ) : null}

      <View style={styles.switchRow}>
        <Text style={styles.switchCopy}>
          {mode === 'login' ? 'No account yet?' : 'Already enlisted?'}
        </Text>

        <Pressable
          accessibilityRole="link"
          hitSlop={6}
          onPress={() => onSwitch(mode === 'login' ? 'register' : 'login')}>
          {({ pressed }) => (
            <Text style={[styles.switchLink, pressed && { opacity: 0.7 }]}>
              {mode === 'login' ? 'Create one' : 'Sign in'}
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: Space.md,
  },
  rootCompact: {
    gap: 14,
  },
  heading: {
    gap: 7,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  marker: {
    width: 6,
    height: 6,
    borderRadius: 2,
    backgroundColor: Palette.primary,
  },
  eyebrow: {
    ...Typography.labelTight,
    fontSize: 9,
    color: Palette.textMuted,
    letterSpacing: 1.5,
  },
  title: {
    fontFamily: Fonts.display,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '700',
    letterSpacing: -0.7,
    color: Palette.text,
  },
  subtitle: {
    ...Typography.body,
    color: Palette.textDim,
    lineHeight: 20,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingHorizontal: 11,
    paddingVertical: 9,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(178, 58, 58, 0.24)',
    backgroundColor: Palette.dangerWash,
  },
  bannerText: {
    flex: 1,
    fontFamily: Fonts.body,
    fontSize: 11,
    lineHeight: 17,
    color: Palette.danger,
  },
  fields: {
    gap: 13,
  },
  avatarBlock: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: Radius.lg,
    backgroundColor: Palette.surfaceDim,
  },
  avatarPreview: {
    width: 54,
    height: 54,
    borderRadius: Radius.md,
    backgroundColor: Palette.card,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 54,
    height: 54,
  },
  avatarCopy: {
    flex: 1,
    minWidth: 150,
    gap: 2,
  },
  avatarTitle: {
    fontFamily: Fonts.display,
    fontSize: 12,
    fontWeight: '600',
    color: Palette.text,
  },
  avatarHint: {
    fontFamily: Fonts.body,
    fontSize: 9,
    color: Palette.textFaint,
  },
  avatarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    marginTop: 5,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: Radius.sm,
    backgroundColor: Palette.primaryWash,
  },
  avatarButtonText: {
    fontFamily: Fonts.body,
    fontSize: 10,
    fontWeight: '600',
    color: Palette.primaryBright,
  },
  avatarError: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    width: '100%',
  },
  avatarErrorText: {
    fontFamily: Fonts.body,
    fontSize: 10,
    color: Palette.danger,
  },
  legal: {
    fontFamily: Fonts.body,
    fontSize: 9,
    lineHeight: 14,
    color: Palette.textFaint,
    textAlign: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  switchCopy: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Palette.textDim,
  },
  switchLink: {
    fontFamily: Fonts.body,
    fontSize: 11,
    fontWeight: '700',
    color: Palette.primary,
  },
});
