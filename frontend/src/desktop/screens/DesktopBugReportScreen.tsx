import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { gameService } from '../../shared/services/gameService';
import { bugService } from '../../shared/services/bugService';
import { GameListing } from '../../shared/types';
import { theme } from '../../shared/theme';
import { PrimaryButton } from '../../shared/components/PrimaryButton';
import { useAuth } from '../../shared/context/AuthContext';

const SEVERITIES = [
  { key: 'critical', label: 'CRITICAL', desc: 'Game crash, memory corruption, loss of progress', color: '#EF4444' },
  { key: 'major', label: 'MAJOR', desc: 'Broken quest, clipping out of bounds, network desync', color: '#F97316' },
  { key: 'moderate', label: 'MODERATE', desc: 'Physics anomaly, unintended collision, wrong audio cues', color: '#F59E0B' },
  { key: 'minor', label: 'MINOR', desc: 'UI alignment, missing icon, typo in dialogue', color: '#3B82F6' },
];

export const DesktopBugReportScreen: React.FC = () => {
  const router = useRouter();
  const searchParams = useLocalSearchParams<{ gameId?: string }>();
  const { user, openAuthModal } = useAuth();

  const [games, setGames] = useState<GameListing[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('major');
  const [steps, setSteps] = useState<string[]>(['Launch build and load into map', 'Perform sprint slide into terrain boundary', 'Observe clipping under mesh']);
  const [newStep, setNewStep] = useState('');
  const [specs, setSpecs] = useState('Windows 11 64-bit | RTX 4070 Ti | Ryzen 7 7800X3D | 32GB RAM');
  const [submitting, setSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  useEffect(() => {
    gameService.listGames().then((list) => {
      setGames(list);
      if (searchParams.gameId) {
        setSelectedGameId(searchParams.gameId);
      } else if (list.length > 0) {
        setSelectedGameId(list[0].id);
      }
    });
  }, [searchParams.gameId]);

  const addStep = () => {
    if (!newStep.trim()) return;
    setSteps([...steps, newStep.trim()]);
    setNewStep('');
  };

  const removeStep = (idx: number) => {
    setSteps(steps.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    if (!user) {
      openAuthModal();
      return;
    }
    if (!description.trim() || !selectedGameId) {
      alert('Please select a game and enter a detailed bug description.');
      return;
    }

    setSubmitting(true);
    try {
      const fullDesc = title.trim() ? `[${title.trim()}] ${description.trim()}` : description.trim();
      const report = await bugService.createReport({
        gameListingId: selectedGameId,
        bugDescription: fullDesc,
        severity,
        reproSteps: steps,
      });
      setSubmittedTicket(report.id || `TICK-${Math.floor(1000 + Math.random() * 9000)}`);
    } catch {
      alert('Failed to submit report. Please check connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setTitle('');
    setDescription('');
    setSubmittedTicket(null);
  };

  return (
    <View style={styles.container}>
      {/* Top Banner (Wireframe 3) */}
      <View style={styles.banner}>
        <View style={styles.badge}>
          <Ionicons name="bug" size={14} color={theme.colors.brand.accent} />
          <Text style={styles.badgeText}>TELEMETRY DEFECT SUBMISSION CONSOLE</Text>
        </View>
        <Text style={styles.title}>Submit QA Defect Report</Text>
        <Text style={styles.desc}>
          Standardized bug reports assist studio engineers with rapid triage. High quality reports with verified
          reproduction steps award up to +250 QA Testing Points and bounty tier qualification.
        </Text>
      </View>

      {/* Submission Success Modal / State */}
      {submittedTicket ? (
        <View style={styles.successCard}>
          <View style={styles.successIconBox}>
            <Ionicons name="shield-checkmark" size={48} color={theme.colors.brand.accent} />
          </View>
          <Text style={styles.successTitle}>Defect Report Filed Successfully</Text>
          <Text style={styles.successTicket}>TICKET ID: {submittedTicket}</Text>
          <Text style={styles.successDesc}>
            Telemetry received and routed to the development studio QA queue. You have been awarded +150 Testing Points.
          </Text>

          <View style={styles.successActions}>
            <TouchableOpacity style={styles.viewGamesBtn} onPress={() => router.push('/games')}>
              <Text style={styles.viewGamesBtnText}>Return to Playtest Nexus</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.anotherBtn} onPress={handleReset}>
              <Text style={styles.anotherBtnText}>File Another Defect</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        /* 2-Column Form Layout (Wireframe 3) */
        <View style={styles.formLayout}>
          {/* Main Form (65%) */}
          <View style={styles.mainCol}>
            {/* Field Group 1: Game Selection */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>1. Target Test Build</Text>
              <Text style={styles.fieldLabel}>Select Associated Game Build</Text>
              <View style={styles.gamesPills}>
                {games.map((g) => (
                  <TouchableOpacity
                    key={g.id}
                    style={[styles.gamePill, selectedGameId === g.id && styles.gamePillActive]}
                    onPress={() => setSelectedGameId(g.id)}
                  >
                    <Ionicons
                      name="game-controller-outline"
                      size={14}
                      color={selectedGameId === g.id ? '#fff' : theme.colors.text.secondary}
                    />
                    <Text style={[styles.gamePillText, selectedGameId === g.id && styles.gamePillTextActive]}>
                      {g.gameName}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Field Group 2: Bug Severity */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>2. Defect Severity Level</Text>
              <View style={styles.severityGrid}>
                {SEVERITIES.map((sev) => (
                  <TouchableOpacity
                    key={sev.key}
                    style={[
                      styles.severityCard,
                      severity === sev.key && { borderColor: sev.color, backgroundColor: 'rgba(255,255,255,0.04)' },
                    ]}
                    onPress={() => setSeverity(sev.key)}
                  >
                    <View style={styles.severityHeader}>
                      <View style={[styles.severityDot, { backgroundColor: sev.color }]} />
                      <Text style={[styles.severityLabel, { color: sev.color }]}>{sev.label}</Text>
                    </View>
                    <Text style={styles.severityDesc}>{sev.desc}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Field Group 3: Description */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>3. Defect Description & Observed Behavior</Text>
              <Text style={styles.fieldLabel}>Summary Title</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Collision mesh clipping on Sector 4 bridge"
                placeholderTextColor="#666"
                value={title}
                onChangeText={setTitle}
              />

              <Text style={[styles.fieldLabel, { marginTop: 14 }]}>Detailed Bug Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe exactly what occurred, expected outcome versus actual outcome..."
                placeholderTextColor="#666"
                multiline
                numberOfLines={5}
                value={description}
                onChangeText={setDescription}
              />
            </View>

            {/* Field Group 4: Reproduction Steps */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>4. Step-by-Step Reproduction Procedure</Text>
              <View style={styles.stepsList}>
                {steps.map((s, idx) => (
                  <View key={idx} style={styles.stepItem}>
                    <View style={styles.stepNumberBadge}>
                      <Text style={styles.stepNumberText}>{idx + 1}</Text>
                    </View>
                    <Text style={styles.stepText}>{s}</Text>
                    <TouchableOpacity onPress={() => removeStep(idx)}>
                      <Ionicons name="trash-outline" size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              <View style={styles.addStepRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Type next reproduction step..."
                  placeholderTextColor="#666"
                  value={newStep}
                  onChangeText={setNewStep}
                  onSubmitEditing={addStep}
                />
                <TouchableOpacity style={styles.addStepBtn} onPress={addStep}>
                  <Ionicons name="add" size={18} color="#000" />
                  <Text style={styles.addStepBtnText}>Add Step</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Side Column (35%) — Hardware Specs & Submit Actions (Wireframe 3) */}
          <View style={styles.sideCol}>
            {/* Hardware Telemetry Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Hardware Diagnostics</Text>
              <Text style={styles.fieldLabel}>Detected System Profile</Text>
              <TextInput
                style={[styles.input, { fontSize: 12, fontFamily: theme.typography.fontFamily.mono }]}
                value={specs}
                onChangeText={setSpecs}
              />
              <Text style={styles.hintText}>
                Autofilled from your client environment. Modify if reporting on behalf of secondary test rig.
              </Text>
            </View>

            {/* QA Bounty Tier Notice */}
            <View style={styles.bountyCard}>
              <View style={styles.bountyHeader}>
                <Ionicons name="sparkles" size={18} color={theme.colors.brand.accent} />
                <Text style={styles.bountyTitle}>QA Bounty Eligible</Text>
              </View>
              <Text style={styles.bountyDesc}>
                This submission will be evaluated by studio engineers within 48 hours. Validated bugs earn between
                $25 - $250 bounties.
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionCard}>
              <PrimaryButton
                label={submitting ? 'Transmitting Defect...' : 'Submit Defect Report'}
                onPress={handleSubmit}
                icon="send-outline"
                disabled={submitting}
                fullWidth
              />

              <TouchableOpacity style={styles.clearBtn} onPress={handleReset}>
                <Text style={styles.clearBtnText}>Clear Form</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  banner: {
    backgroundColor: theme.colors.background.elevated,
    borderRadius: theme.borders.radius.lg,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    marginBottom: theme.spacing.xl,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(57, 230, 0, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.borders.radius.full,
    marginBottom: theme.spacing.md,
  },
  badgeText: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.mono,
    color: theme.colors.brand.accent,
    fontWeight: '700',
  },
  title: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: '800',
    color: theme.colors.text.primary,
    marginBottom: 8,
    fontFamily: theme.typography.fontFamily.heading,
  },
  desc: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    maxWidth: 800,
    lineHeight: 22,
  },
  formLayout: {
    flexDirection: 'row',
    gap: 24,
  },
  mainCol: {
    flex: 1,
    gap: 20,
  },
  sideCol: {
    width: 360,
    gap: 20,
  },
  card: {
    backgroundColor: theme.colors.background.elevated,
    borderRadius: theme.borders.radius.lg,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 14,
    fontFamily: theme.typography.fontFamily.heading,
  },
  fieldLabel: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    fontWeight: '600',
    marginBottom: 8,
  },
  gamesPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gamePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.borders.radius.md,
    backgroundColor: theme.colors.background.surface,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  gamePillActive: {
    backgroundColor: theme.colors.brand.primary,
    borderColor: theme.colors.brand.secondary,
  },
  gamePillText: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    fontWeight: '600',
  },
  gamePillTextActive: {
    color: '#fff',
  },
  severityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  severityCard: {
    width: '48%',
    backgroundColor: theme.colors.background.surface,
    borderRadius: theme.borders.radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  severityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  severityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  severityLabel: {
    fontSize: 12,
    fontWeight: '800',
    fontFamily: theme.typography.fontFamily.mono,
  },
  severityDesc: {
    fontSize: 11,
    color: theme.colors.text.muted,
    lineHeight: 16,
  },
  input: {
    backgroundColor: theme.colors.background.surface,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.borders.radius.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: theme.colors.text.primary,
    fontSize: 14,
  },
  textArea: {
    height: 110,
    textAlignVertical: 'top',
  },
  stepsList: {
    gap: 10,
    marginBottom: 14,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.surface,
    borderRadius: theme.borders.radius.md,
    padding: 10,
    gap: 10,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  stepNumberBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: theme.colors.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  stepText: {
    flex: 1,
    color: theme.colors.text.primary,
    fontSize: 13,
  },
  addStepRow: {
    flexDirection: 'row',
    gap: 10,
  },
  addStepBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.brand.accent,
    paddingHorizontal: 16,
    borderRadius: theme.borders.radius.md,
    justifyContent: 'center',
  },
  addStepBtnText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 13,
  },
  hintText: {
    fontSize: 11,
    color: theme.colors.text.muted,
    marginTop: 6,
    lineHeight: 16,
  },
  bountyCard: {
    backgroundColor: 'rgba(57, 230, 0, 0.08)',
    borderRadius: theme.borders.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(57, 230, 0, 0.3)',
    gap: 8,
  },
  bountyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bountyTitle: {
    color: theme.colors.brand.accent,
    fontWeight: '700',
    fontSize: 14,
  },
  bountyDesc: {
    color: theme.colors.text.secondary,
    fontSize: 12,
    lineHeight: 18,
  },
  actionCard: {
    backgroundColor: theme.colors.background.elevated,
    borderRadius: theme.borders.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    gap: 12,
  },
  clearBtn: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  clearBtnText: {
    color: theme.colors.text.muted,
    fontSize: 13,
  },
  successCard: {
    backgroundColor: theme.colors.background.elevated,
    borderRadius: theme.borders.radius.lg,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.brand.accent,
    maxWidth: 640,
    alignSelf: 'center',
  },
  successIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(57, 230, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  successTicket: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: theme.typography.fontFamily.mono,
    color: theme.colors.brand.accent,
    marginBottom: 12,
  },
  successDesc: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  successActions: {
    flexDirection: 'row',
    gap: 16,
  },
  viewGamesBtn: {
    backgroundColor: theme.colors.brand.accent,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: theme.borders.radius.md,
  },
  viewGamesBtnText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 14,
  },
  anotherBtn: {
    backgroundColor: theme.colors.background.surface,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: theme.borders.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  anotherBtnText: {
    color: theme.colors.text.primary,
    fontWeight: '600',
    fontSize: 14,
  },
});

