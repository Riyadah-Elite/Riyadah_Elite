import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type ViewStyle,
} from 'react-native';

import { AppShell } from '@/components/layout/app-shell';
import { AuthGate } from '@/components/layout/auth-gate';
import { SectionHeading } from '@/components/landing/section-heading';
import { Button } from '@/components/ui/button';
import { ClayCard } from '@/components/ui/card';
import { TextField } from '@/components/ui/text-field';
import { Fonts, Palette, Radius, Space, Typography } from '@/constants/design';
import { useHover } from '@/hooks/use-hover';
import { useResponsive } from '@/hooks/use-responsive';
import { useToast } from '@/providers/toast-provider';

const AREAS = ['Gameplay', 'Interface', 'Performance', 'Network', 'Other'];
const SEVERITIES = [
  { key: 'low', label: 'Low', accent: Palette.tertiary },
  { key: 'medium', label: 'Medium', accent: Palette.warning },
  { key: 'high', label: 'High', accent: Palette.danger },
  { key: 'critical', label: 'Critical', accent: Palette.danger },
];

const GUIDANCE = [
  'State what you expected and what happened instead.',
  'List the exact steps that reproduce the anomaly.',
  'Include build, device and network conditions.',
  'Attach one screenshot per distinct issue.',
];

export default function BugReportScreen() {
  const { isMobile } = useResponsive();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [area, setArea] = useState(AREAS[0]);
  const [severity, setSeverity] = useState(SEVERITIES[1].key);
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState('');
  const [titleError, setTitleError] = useState<string | undefined>();
  const [descriptionError, setDescriptionError] = useState<string | undefined>();

  function handleSubmit() {
    let valid = true;

    if (title.trim().length < 5) {
      setTitleError('Give the report a clear title of at least 5 characters.');
      valid = false;
    }

    if (description.trim().length < 20) {
      setDescriptionError('Describe the anomaly in at least 20 characters.');
      valid = false;
    }

    if (!valid) return;

    showToast({
      title: 'Intake channel pending',
      message:
        'The bug intake endpoint is not connected yet. Your draft stays on this device - nothing was submitted.',
      variant: 'warning',
    });
  }

  return (
    <AppShell eyebrow="Anomaly intake" title="Bug Report">
      <AuthGate
        copy="Bug intake is reserved for enlisted operatives. Sign in to file a report against an assigned build."
        icon="bug"
        title="Intake is session-gated">
        <View style={styles.page}>
          <SectionHeading
            action={
              <View style={styles.secureTag}>
                <Ionicons name="shield-checkmark-outline" size={12} color={Palette.tertiary} />
                <Text style={styles.secureText}>Verified intake</Text>
              </View>
            }
            description="File a precise anomaly report. Title, affected area and exact reproduction steps are what move a bug through triage."
            eyebrow="Quality control"
            title="Report an anomaly"
          />

          <View style={[styles.layout, isMobile && styles.layoutMobile]}>
            <ClayCard style={styles.formCard} padded={false}>
              <View style={styles.form}>
                <View style={styles.formHead}>
                  <View style={styles.formHeadIcon}>
                    <Ionicons name="bug-outline" size={17} color={Palette.secondary} />
                  </View>
                  <View>
                    <Text style={styles.formTitle}>Anomaly report</Text>
                    <Text style={styles.formSubtitle}>All fields are reviewed by a testing steward</Text>
                  </View>
                </View>

                <TextField
                  autoCapitalize="sentences"
                  error={titleError}
                  icon="create-outline"
                  label="Report title"
                  maxLength={90}
                  onChangeText={(value) => {
                    setTitle(value);
                    if (titleError) setTitleError(undefined);
                  }}
                  placeholder="Short, specific summary of the anomaly"
                  value={title}
                />

                <View style={styles.group}>
                  <Text style={styles.groupLabel}>Affected area</Text>
                  <View style={styles.chips}>
                    {AREAS.map((option) => (
                      <ChoiceChip
                        active={area === option}
                        key={option}
                        label={option}
                        onPress={() => setArea(option)}
                      />
                    ))}
                  </View>
                </View>

                <View style={styles.group}>
                  <Text style={styles.groupLabel}>Severity</Text>
                  <View style={styles.chips}>
                    {SEVERITIES.map((option) => (
                      <ChoiceChip
                        accent={option.accent}
                        active={severity === option.key}
                        key={option.key}
                        label={option.label}
                        onPress={() => setSeverity(option.key)}
                      />
                    ))}
                  </View>
                </View>

                <TextArea
                  error={descriptionError}
                  label="What happened?"
                  onChangeText={(value) => {
                    setDescription(value);
                    if (descriptionError) setDescriptionError(undefined);
                  }}
                  placeholder="Expected behaviour, actual behaviour and how often it occurs."
                  value={description}
                />

                <TextArea
                  label="Reproduction steps"
                  onChangeText={setSteps}
                  placeholder={'1. Start a testing session\n2. Open the assigned build\n3. …'}
                  value={steps}
                />

                <View style={styles.actions}>
                  <Button
                    icon="send"
                    label="Submit report"
                    onPress={handleSubmit}
                    size="lg"
                  />
                  <Text style={styles.actionsNote}>
                    Reports are stored against your operative profile only after the intake
                    endpoint is connected.
                  </Text>
                </View>
              </View>
            </ClayCard>

            <View style={[styles.sidebar, isMobile && styles.sidebarMobile]}>
              <ClayCard glass padded={false}>
                <View style={styles.sidebarBody}>
                  <View style={styles.sidebarHead}>
                    <Ionicons name="list-outline" size={15} color={Palette.primaryBright} />
                    <Text style={styles.sidebarTitle}>Triage checklist</Text>
                  </View>

                  <View style={styles.guidance}>
                    {GUIDANCE.map((item, index) => (
                      <View key={item} style={styles.guidanceRow}>
                        <Text style={styles.guidanceIndex}>{String(index + 1).padStart(2, '0')}</Text>
                        <Text style={styles.guidanceText}>{item}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.sidebarRule} />

                  <View style={styles.sidebarMeta}>
                    <Ionicons name="time-outline" size={12} color={Palette.tertiary} />
                    <Text style={styles.sidebarMetaText}>First review inside 24 hours</Text>
                  </View>
                  <View style={styles.sidebarMeta}>
                    <Ionicons name="git-commit-outline" size={12} color={Palette.primaryBright} />
                    <Text style={styles.sidebarMetaText}>Linked to your assigned build</Text>
                  </View>
                </View>
              </ClayCard>

              <ClayCard padded={false}>
                <View style={styles.sidebarBody}>
                  <Text style={styles.cardEyebrow}>Report state</Text>
                  <Text style={styles.stateTitle}>Draft only</Text>
                  <Text style={styles.stateCopy}>
                    This screen builds the report locally. Submitting is disabled until the backend
                    intake route exists, so no fake tickets are created.
                  </Text>
                </View>
              </ClayCard>
            </View>
          </View>
        </View>
      </AuthGate>
    </AppShell>
  );
}

function ChoiceChip({
  label,
  active,
  onPress,
  accent = Palette.primaryBright,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  accent?: string;
}) {
  const { hovered, hoverProps } = useHover();

  return (
    <Pressable
      {...hoverProps}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        active && {
          borderColor: `${accent}66`,
          backgroundColor: `${accent}16`,
        },
        hovered && !active && styles.chipHover,
        pressed && { opacity: 0.8 },
      ]}>
      {active ? <View style={[styles.chipDot, { backgroundColor: accent }]} /> : null}
      <Text style={[styles.chipText, active && { color: accent }]}>{label}</Text>
    </Pressable>
  );
}

function TextArea({
  label,
  value,
  onChangeText,
  placeholder,
  error,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  error?: string;
}) {
  const [focused, setFocused] = useState(false);

  const fieldShadow: ViewStyle =
    Platform.OS === 'web'
      ? ({
          boxShadow: error
            ? 'inset 2px 2px 5px rgba(136,104,74,0.16), inset -2px -2px 5px rgba(255,255,255,0.85), 0 0 0 3px rgba(178,58,58,0.12)'
            : focused
              ? 'inset 2px 2px 5px rgba(136,104,74,0.16), inset -2px -2px 5px rgba(255,255,255,0.85), 0 0 0 3px rgba(198,79,40,0.12)'
              : 'inset 2px 2px 5px rgba(136,104,74,0.18), inset -2px -2px 5px rgba(255,255,255,0.85)',
        } as ViewStyle)
      : {};

  return (
    <View style={styles.group}>
      <Text style={styles.groupLabel}>{label}</Text>

      <View
        style={[
          styles.textArea,
          {
            borderColor: error ? Palette.danger : focused ? Palette.primary : 'transparent',
            backgroundColor: focused ? Palette.elevated : Palette.surfaceDim,
          },
          fieldShadow,
        ]}>
        <TextInput
          accessibilityLabel={label}
          multiline
          onBlur={() => setFocused(false)}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          placeholder={placeholder}
          placeholderTextColor={Palette.textFaint}
          selectionColor={Palette.primary}
          style={styles.textAreaInput}
          textAlignVertical="top"
          value={value}
        />
      </View>

      {error ? (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle" size={11} color={Palette.danger} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    gap: Space.xl,
  },
  secureTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: Radius.sm,
    backgroundColor: 'rgba(46, 125, 98, 0.10)',
  },
  secureText: {
    ...Typography.labelTight,
    fontSize: 8,
    color: Palette.tertiary,
    letterSpacing: 0.9,
  },
  layout: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Space.md,
  },
  layoutMobile: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  formCard: {
    flex: 1,
    minWidth: 0,
  },
  form: {
    padding: Space.lg,
    gap: 14,
  },
  formHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingBottom: Space.md,
    marginBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
  },
  formHeadIcon: {
    width: 38,
    height: 38,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(217, 154, 43, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formTitle: {
    fontFamily: Fonts.display,
    fontSize: 16,
    fontWeight: '700',
    color: Palette.text,
  },
  formSubtitle: {
    fontFamily: Fonts.body,
    fontSize: 10,
    color: Palette.textFaint,
    marginTop: 1,
  },
  group: {
    gap: 6,
  },
  groupLabel: {
    ...Typography.labelTight,
    fontSize: 9,
    color: Palette.textMuted,
    letterSpacing: 1.1,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: Palette.surfaceDim,
  },
  chipHover: {
    borderColor: Palette.border,
    backgroundColor: Palette.raised,
  },
  chipDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  chipText: {
    fontFamily: Fonts.body,
    fontSize: 11,
    fontWeight: '500',
    color: Palette.textMuted,
  },
  textArea: {
    minHeight: 104,
    paddingHorizontal: 13,
    paddingVertical: 11,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  textAreaInput: {
    minHeight: 82,
    padding: 0,
    fontFamily: Fonts.body,
    fontSize: 13,
    lineHeight: 20,
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
    fontSize: 10,
    color: Palette.danger,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 2,
  },
  actionsNote: {
    ...Typography.bodySm,
    fontSize: 10,
    color: Palette.textFaint,
    flex: 1,
    minWidth: 200,
    lineHeight: 15,
  },
  sidebar: {
    width: 300,
    gap: Space.md,
  },
  sidebarMobile: {
    width: '100%',
  },
  sidebarBody: {
    padding: Space.lg,
    gap: 10,
  },
  sidebarHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sidebarTitle: {
    fontFamily: Fonts.display,
    fontSize: 14,
    fontWeight: '600',
    color: Palette.text,
  },
  guidance: {
    gap: 9,
  },
  guidanceRow: {
    flexDirection: 'row',
    gap: 8,
  },
  guidanceIndex: {
    ...Typography.labelTight,
    fontSize: 8,
    color: Palette.primary,
    letterSpacing: 0.8,
    lineHeight: 17,
  },
  guidanceText: {
    fontFamily: Fonts.body,
    fontSize: 11,
    lineHeight: 17,
    color: Palette.textMuted,
    flex: 1,
  },
  sidebarRule: {
    height: 1,
    backgroundColor: Palette.border,
    marginVertical: 2,
  },
  sidebarMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sidebarMetaText: {
    fontFamily: Fonts.body,
    fontSize: 9,
    color: Palette.textFaint,
  },
  cardEyebrow: {
    ...Typography.labelTight,
    fontSize: 9,
    color: Palette.textMuted,
    letterSpacing: 1.2,
  },
  stateTitle: {
    fontFamily: Fonts.display,
    fontSize: 18,
    fontWeight: '700',
    color: Palette.text,
  },
  stateCopy: {
    ...Typography.bodySm,
    color: Palette.textDim,
    lineHeight: 18,
  },
});
