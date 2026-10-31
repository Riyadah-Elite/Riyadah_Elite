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

const SEVERITY_OPTS = ['critical', 'major', 'moderate', 'minor'];

export const MobileBugReportScreen: React.FC = () => {
  const router = useRouter();
  const searchParams = useLocalSearchParams<{ gameId?: string }>();
  const { user, openAuthModal } = useAuth();

  const [games, setGames] = useState<GameListing[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('major');
  const [steps, setSteps] = useState<string[]>(['Launch build', 'Sprint to edge', 'Clipping occurs']);
  const [newStep, setNewStep] = useState('');
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
      alert('Please fill in bug details and select a game.');
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

  if (submittedTicket) {
    return (
      <View style={styles.successBox}>
        <Ionicons name="checkmark-circle" size={48} color={theme.colors.brand.accent} />
        <Text style={styles.successTitle}>Bug Report Submitted</Text>
        <Text style={styles.ticketId}>TICKET: {submittedTicket}</Text>
        <Text style={styles.successDesc}>
          Thanks for helping optimize the game build! You earned +150 Testing Points.
        </Text>
        <PrimaryButton
          label="Back to Playtest Hub"
          onPress={() => router.push('/games')}
          fullWidth
        />
        <TouchableOpacity style={styles.anotherBtn} onPress={() => setSubmittedTicket(null)}>
          <Text style={styles.anotherTxt}>Submit Another Bug</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.badge}>
          <Ionicons name="bug" size={12} color={theme.colors.brand.accent} />
          <Text style={styles.badgeTxt}>DEFECT SUBMISSION</Text>
        </View>
        <Text style={styles.title}>Report QA Issue</Text>
        <Text style={styles.sub}>
          Submit defects to studio devs and earn QA points and bounties.
        </Text>
      </View>

      {/* Select Game */}
      <Text style={styles.sectionLabel}>Select Game Build</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gameScroll}>
        {games.map((g) => (
          <TouchableOpacity
            key={g.id}
            style={[styles.gameChip, selectedGameId === g.id && styles.gameChipActive]}
            onPress={() => setSelectedGameId(g.id)}
          >
            <Text style={[styles.gameChipTxt, selectedGameId === g.id && styles.gameChipTxtActive]}>
              {g.gameName}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Severity Selector */}
      <Text style={styles.sectionLabel}>Severity Level</Text>
      <View style={styles.sevRow}>
        {SEVERITY_OPTS.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[styles.sevChip, severity === opt && styles.sevChipActive]}
            onPress={() => setSeverity(opt)}
          >
            <Text style={[styles.sevTxt, severity === opt && styles.sevTxtActive]}>
              {opt.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Title */}
      <Text style={styles.sectionLabel}>Bug Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Brief summary of issue..."
        placeholderTextColor="#666"
        value={title}
        onChangeText={setTitle}
      />

      {/* Description */}
      <Text style={styles.sectionLabel}>Description & Observations</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="What happened? What was expected to happen?"
        placeholderTextColor="#666"
        multiline
        numberOfLines={4}
        value={description}
        onChangeText={setDescription}
      />

      {/* Repro Steps */}
      <Text style={styles.sectionLabel}>Reproduction Steps</Text>
      <View style={styles.stepsStack}>
        {steps.map((st, i) => (
          <View key={i} style={styles.stepRow}>
            <Text style={styles.stepNum}>{i + 1}.</Text>
            <Text style={styles.stepTxt}>{st}</Text>
            <TouchableOpacity onPress={() => removeStep(i)}>
              <Ionicons name="close-circle-outline" size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.addStepRow}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Add step..."
          placeholderTextColor="#666"
          value={newStep}
          onChangeText={setNewStep}
          onSubmitEditing={addStep}
        />
        <TouchableOpacity style={styles.addStepBtn} onPress={addStep}>
          <Ionicons name="add" size={18} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Submit Button */}
      <View style={styles.submitRow}>
        <PrimaryButton
          label={submitting ? 'Transmitting...' : 'Submit Bug Report'}
          onPress={handleSubmit}
          disabled={submitting}
          fullWidth
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 32,
  },
  header: {
    marginBottom: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(57, 230, 0, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 6,
  },
  badgeTxt: {
    fontSize: 10,
    fontFamily: theme.typography.fontFamily.mono,
    color: theme.colors.brand.accent,
    fontWeight: '700',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.heading,
  },
  sub: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    marginTop: 4,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.text.secondary,
    marginTop: 14,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  gameScroll: {
    marginBottom: 4,
  },
  gameChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borders.radius.sm,
    backgroundColor: theme.colors.background.surface,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    marginRight: 8,
  },
  gameChipActive: {
    backgroundColor: theme.colors.brand.primary,
    borderColor: theme.colors.brand.secondary,
  },
  gameChipTxt: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  gameChipTxtActive: {
    color: '#fff',
    fontWeight: '700',
  },
  sevRow: {
    flexDirection: 'row',
    gap: 8,
  },
  sevChip: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: theme.borders.radius.sm,
    backgroundColor: theme.colors.background.surface,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  sevChipActive: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderColor: '#EF4444',
  },
  sevTxt: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.text.muted,
    fontFamily: theme.typography.fontFamily.mono,
  },
  sevTxtActive: {
    color: '#EF4444',
  },
  input: {
    backgroundColor: theme.colors.background.surface,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.borders.radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: theme.colors.text.primary,
    fontSize: 13,
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  stepsStack: {
    gap: 6,
    marginBottom: 8,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.surface,
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    gap: 8,
  },
  stepNum: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.brand.secondary,
  },
  stepTxt: {
    flex: 1,
    fontSize: 12,
    color: theme.colors.text.primary,
  },
  addStepRow: {
    flexDirection: 'row',
    gap: 8,
  },
  addStepBtn: {
    backgroundColor: theme.colors.brand.accent,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borders.radius.sm,
  },
  submitRow: {
    marginTop: 20,
  },
  successBox: {
    backgroundColor: theme.colors.background.surface,
    borderRadius: theme.borders.radius.md,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.brand.accent,
    gap: 12,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.text.primary,
  },
  ticketId: {
    fontSize: 13,
    color: theme.colors.brand.accent,
    fontFamily: theme.typography.fontFamily.mono,
    fontWeight: '700',
  },
  successDesc: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 8,
  },
  anotherBtn: {
    marginTop: 10,
    padding: 8,
  },
  anotherTxt: {
    color: theme.colors.text.muted,
    fontSize: 13,
  },
});

