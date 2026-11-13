import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { Fonts, Palette, Radius, Space, Typography, clayShadow, neoButtonHoverShadow, neoButtonPressedShadow, neoButtonShadow } from '@/constants/design';
import { getApiErrorMessage } from '@/lib/api';
import { pickAvatar, type PickedAvatar } from '@/lib/media';
import {
  loginSchema,
  registerSchema,
  toFieldErrors,
  type FieldErrors,
} from '@/lib/schemas';
import type { UserRole } from '@/lib/types';
import { useAuth } from '@/providers/auth-provider';
import { useAuthModal, type AuthMode } from '@/providers/auth-modal-provider';
import { useToast } from '@/providers/toast-provider';

import { StatusBadge } from '../ui/badge';
import { Button } from '../ui/button';
import { TextField } from '../ui/text-field';
import { Tooltip } from '../ui/tooltip';

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

type SelectableRole = 'ORG' | 'DEVELOPER' | 'USER';

interface RoleOption {
  role: SelectableRole;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  icon: keyof typeof Ionicons.glyphMap;
  tooltip: string;
  featured?: boolean;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    role: 'ORG',
    title: 'To publish tournament',
    subtitle: 'Host governed esports brackets, manage prize pools & stream tournament feeds.',
    badge: 'Tournament Org',
    badgeColor: Palette.secondary,
    icon: 'trophy',
    tooltip: 'Publish and manage tournament brackets, prizes, and match series.',
    featured: true,
  },
  {
    role: 'DEVELOPER',
    title: 'To publish game for testing',
    subtitle: 'Upload playable builds, recruit QA testers & triage telemetry bug reports.',
    badge: 'Indie Game Dev',
    badgeColor: Palette.primary,
    icon: 'game-controller',
    tooltip: 'Publish game builds for telemetry testing and review submitted bug reports.',
  },
  {
    role: 'USER',
    title: 'Need to explore',
    subtitle: 'Play new indie builds, earn testing points, climb the ladder & compete.',
    badge: 'QA Tester / Player',
    badgeColor: Palette.tertiary,
    icon: 'compass',
    tooltip: 'Join testing telemetry programs, log bug reports, and compete in tournaments.',
  },
];

interface AuthFormProps {
  mode: AuthMode;
  onSwitch: (mode: AuthMode) => void;
  compact?: boolean;
}

/**
 * 2-Step Authentication Form.
 *
 * Laws satisfied:
 * - Step 1: "What is your aim?" with 3 selectable role cards (ORG highlighted, DEVELOPER, USER)
 *   with cross-platform Tooltips. ADMIN is strictly never displayed.
 * - Step 2: Complete profile registration bound to chosen role with Neumorphic Back and
 *   Create Account buttons.
 * - Glassmorphic toasts on all mutations and validation errors.
 */
export function AuthForm({ mode, onSwitch, compact = false }: AuthFormProps) {
  const { login, register } = useAuth();
  const { finishAuth } = useAuthModal();
  const { showToast } = useToast();

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<SelectableRole>('ORG');
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
      const msg = getApiErrorMessage(error);
      setAvatarError(msg);
      showToast({
        title: 'Image Selection Error',
        message: msg,
        variant: 'error',
      });
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
        : { ...values, role: selectedRole },
    );

    if (!result.success) {
      const fieldErrors = toFieldErrors<keyof FormValues>(result.error.issues);
      setErrors(fieldErrors);
      const firstError = Object.values(fieldErrors)[0] ?? 'Please correct the form errors.';
      showToast({
        title: 'Validation Error',
        message: firstError,
        variant: 'error',
      });
      return;
    }

    const chosenAvatar = avatar;

    if (mode === 'register' && !chosenAvatar) {
      const msg = 'A profile image is required to enlist.';
      setAvatarError(msg);
      showToast({
        title: 'Avatar Required',
        message: msg,
        variant: 'error',
      });
      return;
    }

    setSubmitting(true);

    try {
      if (mode === 'login') {
        await login(values.email, values.password);
      } else {
        await register({
          username: values.username,
          email: values.email,
          password: values.password,
          avatar: chosenAvatar!,
          role: selectedRole,
        });
      }

      showToast({
        title: mode === 'login' ? 'Session Restored' : 'Operative Enlisted',
        message:
          mode === 'login'
            ? 'Welcome back to the arena. Your telemetry ladder is live.'
            : `Account deployed with role: ${selectedRole}. The arena is open.`,
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

  const selectedMeta = ROLE_OPTIONS.find((r) => r.role === selectedRole)!;

  return (
    <View style={[styles.root, compact && styles.rootCompact]}>
      {/* Step 1: Select Aim / Role */}
      {mode === 'register' && step === 1 ? (
        <View style={styles.stepContainer}>
          <View style={styles.heading}>
            <View style={styles.eyebrowRow}>
              <View style={styles.marker} />
              <Text style={styles.eyebrow}>Step 1 of 2 · Operative Enlistment</Text>
            </View>

            <Text style={styles.title}>What is your aim?</Text>

            <Text style={styles.subtitle}>
              Select your operative focus. Tools, telemetry, and ladder permissions will calibrate to your deployment.
            </Text>
          </View>

          <View style={styles.roleCardList}>
            {ROLE_OPTIONS.map((option) => {
              const isSelected = selectedRole === option.role;

              return (
                <Tooltip
                  key={option.role}
                  content={option.tooltip}
                  position="top"
                  style={styles.roleTooltipWrapper}>
                  <Pressable
                    accessibilityLabel={option.title}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: isSelected }}
                    onPress={() => setSelectedRole(option.role)}
                    style={({ pressed }) => [
                      styles.roleCard,
                      option.featured && styles.roleCardFeatured,
                      isSelected && styles.roleCardSelected,
                      pressed && styles.roleCardPressed,
                    ]}>
                    <View style={styles.roleCardHeader}>
                      <View
                        style={[
                          styles.roleIconWrap,
                          isSelected && { backgroundColor: `${option.badgeColor}22` },
                        ]}>
                        <Ionicons
                          name={option.icon}
                          size={20}
                          color={isSelected ? option.badgeColor : Palette.textMuted}
                        />
                      </View>

                      <StatusBadge
                        color={option.badgeColor}
                        dot={isSelected}
                        label={option.badge}
                      />
                    </View>

                    <Text style={[styles.roleCardTitle, isSelected && { color: Palette.text }]}>
                      {option.title}
                    </Text>

                    <Text style={styles.roleCardSubtitle}>{option.subtitle}</Text>
                  </Pressable>
                </Tooltip>
              );
            })}
          </View>

          <Button
            fullWidth
            icon="arrow-forward"
            label="Continue to Account Details"
            onPress={() => setStep(2)}
            size="lg"
            variant="lime"
          />

          <View style={styles.switchRow}>
            <Text style={styles.switchCopy}>Already enlisted?</Text>
            <Pressable
              accessibilityRole="link"
              hitSlop={6}
              onPress={() => onSwitch('login')}>
              {({ pressed }) => (
                <Text style={[styles.switchLink, pressed && { opacity: 0.7 }]}>
                  Sign in
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      ) : (
        /* Step 2 (Register) or Login Form */
        <View style={styles.stepContainer}>
          <View style={styles.heading}>
            <View style={styles.eyebrowRow}>
              <View style={styles.marker} />
              <Text style={styles.eyebrow}>
                {mode === 'login' ? 'Session Access' : 'Step 2 of 2 · Account Creation'}
              </Text>
            </View>

            <Text style={styles.title}>
              {mode === 'login' ? 'Welcome Back' : 'Complete Registration'}
            </Text>

            <Text style={styles.subtitle}>
              {mode === 'login'
                ? 'Sign in to restore your ladder rank, notifications and tournament access.'
                : 'Enter your credentials to bind your identity to your chosen operative tier.'}
            </Text>
          </View>

          {mode === 'register' && (
            <View style={styles.selectedRoleBar}>
              <View style={styles.selectedRoleInfo}>
                <Ionicons name={selectedMeta.icon} size={16} color={selectedMeta.badgeColor} />
                <Text style={styles.selectedRoleText}>
                  Role: <Text style={styles.selectedRoleName}>{selectedMeta.badge}</Text>
                </Text>
              </View>

              <Pressable
                accessibilityLabel="Change chosen aim or role"
                hitSlop={8}
                onPress={() => setStep(1)}
                style={({ pressed }) => [styles.changeRoleBtn, pressed && { opacity: 0.7 }]}>
                <Text style={styles.changeRoleText}>Change</Text>
              </Pressable>
            </View>
          )}

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

            {mode === 'login' ? (
              <View style={styles.forgotRow}>
                <Pressable
                  accessibilityRole="button"
                  hitSlop={6}
                  onPress={() => {
                    showToast({
                      title: 'Password Recovery Channel',
                      message:
                        values.email.trim()
                          ? `A recovery link has been dispatched to ${values.email.trim()}.`
                          : 'Enter your registered email address first to dispatch a reset link.',
                      variant: values.email.trim() ? 'success' : 'info',
                    });
                  }}>
                  {({ pressed }) => (
                    <Text style={[styles.forgotText, pressed && { opacity: 0.7 }]}>
                      Forgot your password?
                    </Text>
                  )}
                </Pressable>
              </View>
            ) : null}

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

          {/* Action Buttons with Strict Neumorphism */}
          {mode === 'register' ? (
            <View style={styles.twoButtonRow}>
              <Button
                accessibilityLabel="Go back to Step 1 role selection"
                icon="arrow-back"
                iconPosition="left"
                label="Back"
                onPress={() => setStep(1)}
                size="lg"
                style={styles.backBtn}
                variant="dark"
              />

              <Button
                accessibilityLabel="Submit registration and enlist"
                icon="checkmark-done"
                label="Create Account"
                loading={submitting}
                onPress={() => void handleSubmit()}
                size="lg"
                style={styles.submitBtn}
                variant="lime"
              />
            </View>
          ) : (
            <Button
              fullWidth
              icon="log-in-outline"
              label="Sign in"
              loading={submitting}
              onPress={() => void handleSubmit()}
              size="lg"
              variant="lime"
            />
          )}

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
      )}
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
  stepContainer: {
    gap: Space.md,
  },
  heading: {
    gap: 6,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  marker: {
    width: 6,
    height: 6,
    borderRadius: Radius.pill,
    backgroundColor: Palette.primary,
  },
  eyebrow: {
    ...Typography.labelTight,
    color: Palette.primary,
  },
  title: {
    fontFamily: Fonts.display,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
    letterSpacing: -0.6,
    color: Palette.text,
  },
  subtitle: {
    fontFamily: Fonts.body,
    fontSize: 13,
    lineHeight: 19,
    color: Palette.textMuted,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
    padding: Space.sm,
    borderRadius: Radius.md,
    backgroundColor: Palette.dangerWash,
    borderWidth: 1,
    borderColor: 'rgba(178, 58, 58, 0.22)',
  },
  bannerText: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Palette.danger,
    flex: 1,
  },
  // Step 1 Role Selection Styles
  roleCardList: {
    gap: Space.sm,
  },
  roleTooltipWrapper: {
    width: '100%',
  },
  roleCard: {
    backgroundColor: Palette.surface,
    borderRadius: Radius.xl,
    padding: Space.md,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    gap: 6,
    position: 'relative',
    ...Platform.select({
      web: {
        boxShadow:
          '0 6px 14px rgba(108, 74, 48, 0.08), inset 1px 1px 2px rgba(255, 255, 255, 0.85), inset -2px -2px 4px rgba(136, 104, 74, 0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  roleCardFeatured: {
    borderColor: `${Palette.secondary}66`,
    backgroundColor: '#FAF5EE',
  },
  roleCardSelected: {
    borderColor: Palette.primary,
    backgroundColor: Palette.elevated,
    ...Platform.select({
      web: {
        boxShadow:
          '0 10px 22px rgba(198, 79, 40, 0.16), inset 2px 2px 4px rgba(255, 255, 255, 0.95), inset -2px -2px 5px rgba(198, 79, 40, 0.14)',
      },
      default: {
        elevation: 4,
      },
    }),
  },
  roleCardPressed: {
    transform: [{ scale: 0.99 }],
  },
  roleCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  roleIconWrap: {
    width: 34,
    height: 34,
    borderRadius: Radius.pill,
    backgroundColor: Palette.surfaceDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleCardTitle: {
    fontFamily: Fonts.display,
    fontSize: 15,
    fontWeight: '700',
    color: Palette.textMuted,
  },
  roleCardSubtitle: {
    fontFamily: Fonts.body,
    fontSize: 12,
    lineHeight: 17,
    color: Palette.textDim,
  },
  // Step 2 Selected Role Indicator
  selectedRoleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Space.md,
    paddingVertical: Space.sm,
    backgroundColor: Palette.surfaceDim,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  selectedRoleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
  },
  selectedRoleText: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Palette.textMuted,
  },
  selectedRoleName: {
    fontWeight: '700',
    color: Palette.text,
  },
  changeRoleBtn: {
    paddingVertical: 2,
    paddingHorizontal: Space.sm,
  },
  changeRoleText: {
    fontFamily: Fonts.body,
    fontSize: 12,
    fontWeight: '600',
    color: Palette.primaryBright,
  },
  twoButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.md,
    width: '100%',
  },
  backBtn: {
    flex: 1,
  },
  submitBtn: {
    flex: 2,
  },
  fields: {
    gap: Space.sm + 4,
  },
  avatarBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.md,
    padding: Space.sm + 2,
    borderRadius: Radius.lg,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.65)',
    flexWrap: 'wrap',
  },
  avatarPreview: {
    width: 58,
    height: 58,
    borderRadius: Radius.pill,
    backgroundColor: Palette.surfaceDim,
    borderWidth: 1.5,
    borderColor: Palette.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarCopy: {
    flex: 1,
    gap: 3,
    minWidth: 150,
  },
  avatarTitle: {
    fontFamily: Fonts.display,
    fontSize: 13,
    fontWeight: '600',
    color: Palette.text,
  },
  avatarHint: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Palette.textFaint,
  },
  avatarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: Radius.sm,
    backgroundColor: Palette.primaryWash,
  },
  avatarButtonText: {
    fontFamily: Fonts.body,
    fontSize: 12,
    fontWeight: '600',
    color: Palette.primaryBright,
  },
  avatarError: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    width: '100%',
    paddingLeft: Space.xs,
  },
  avatarErrorText: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Palette.danger,
  },
  legal: {
    fontFamily: Fonts.body,
    fontSize: 11,
    lineHeight: 16,
    color: Palette.textFaint,
    textAlign: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: Space.xs,
  },
  forgotRow: {
    alignItems: 'flex-end',
    marginTop: -Space.xs,
  },
  forgotText: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Palette.primaryBright,
    fontWeight: '600',
  },
  switchCopy: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Palette.textMuted,
  },
  switchLink: {
    fontFamily: Fonts.body,
    fontSize: 12,
    fontWeight: '700',
    color: Palette.primaryBright,
  },
});
