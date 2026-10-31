import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { tournamentService } from '../../shared/services/tournamentService';
import { TournamentListing } from '../../shared/types';
import { theme } from '../../shared/theme';
import { PrimaryButton } from '../../shared/components/PrimaryButton';
import { StatusBadge } from '../../shared/components/StatusBadge';
import { useAuth } from '../../shared/context/AuthContext';

interface Props {
  id: string;
}

export const DesktopTournamentDetailScreen: React.FC<Props> = ({ id }) => {
  const router = useRouter();
  const { openAuthModal } = useAuth();
  const [tournament, setTournament] = useState<TournamentListing | null>(null);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    tournamentService.getTournament(id).then(setTournament);
  }, [id]);

  if (!tournament) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading tournament details...</Text>
      </View>
    );
  }

  const handleRegister = async () => {
    const success = await tournamentService.enrollTournament(tournament.id);
    if (success) setRegistered(true);
  };

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.push('/tournaments')}>
        <Ionicons name="arrow-back" size={16} color={theme.colors.text.secondary} />
        <Text style={styles.backBtnText}>Back to Tournaments</Text>
      </TouchableOpacity>

      {/* Hero Visual Card */}
      <View style={styles.heroCard}>
        {tournament.imageUrl && (
          <Image source={{ uri: tournament.imageUrl }} style={styles.heroImage} />
        )}
        <View style={styles.heroOverlay}>
          <View style={styles.heroTop}>
            <StatusBadge label="Registration Open" variant="green" />
            <Text style={styles.stageTag}>ALPHA CUP • 128HZ TICKRATE</Text>
          </View>
          <Text style={styles.heroTitle}>{tournament.tournamentName}</Text>
          <Text style={styles.heroSub}>{tournament.gameName} • Official Studio Scrim</Text>
        </View>
      </View>

      {/* Main Two-Column Layout */}
      <View style={styles.twoCol}>
        {/* Left Column: Details & Bracket Preview */}
        <View style={styles.leftCol}>
          {/* Overview */}
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Tournament Overview</Text>
            <Text style={styles.descText}>{tournament.description}</Text>

            <View style={styles.ruleList}>
              <View style={styles.ruleItem}>
                <Ionicons name="checkmark-circle" size={18} color={theme.colors.brand.accent} />
                <Text style={styles.ruleText}>Anti-Cheat: EAC & Kernel Telemetry Verified</Text>
              </View>
              <View style={styles.ruleItem}>
                <Ionicons name="checkmark-circle" size={18} color={theme.colors.brand.accent} />
                <Text style={styles.ruleText}>Match Format: Double Elimination Best of 3</Text>
              </View>
              <View style={styles.ruleItem}>
                <Ionicons name="checkmark-circle" size={18} color={theme.colors.brand.accent} />
                <Text style={styles.ruleText}>Server Tickrate: 128Hz Dedicated Middle East & EU Nodes</Text>
              </View>
            </View>
          </View>

          {/* Interactive Bracket Viewer */}
          <View style={styles.panel}>
            <View style={styles.bracketHeader}>
              <Text style={styles.panelTitle}>Tournament Bracket Tree</Text>
              <Text style={styles.bracketStatus}>DOUBLE ELIMINATION • 32 SQUADS</Text>
            </View>

            <View style={styles.bracketTree}>
              {/* Quarterfinals */}
              <View style={styles.roundCol}>
                <Text style={styles.roundTitle}>QUARTERFINALS</Text>
                <View style={styles.matchCard}>
                  <Text style={styles.teamText}>Team Nexus (2)</Text>
                  <Text style={styles.teamTextLost}>Vanguard Squad (1)</Text>
                </View>
                <View style={styles.matchCard}>
                  <Text style={styles.teamText}>Cyber Phantom (2)</Text>
                  <Text style={styles.teamTextLost}>Apex Wolves (0)</Text>
                </View>
              </View>

              <View style={styles.bracketConnector} />

              {/* Semifinals */}
              <View style={styles.roundCol}>
                <Text style={styles.roundTitle}>SEMIFINALS</Text>
                <View style={styles.matchCard}>
                  <Text style={styles.teamText}>Team Nexus</Text>
                  <Text style={styles.teamText}>Cyber Phantom</Text>
                </View>
              </View>

              <View style={styles.bracketConnector} />

              {/* Grand Finals */}
              <View style={styles.roundCol}>
                <Text style={styles.roundTitle}>GRAND FINALS</Text>
                <View style={[styles.matchCard, { borderColor: theme.colors.brand.accent }]}>
                  <Text style={[styles.teamText, { color: theme.colors.brand.accent }]}>TBD vs TBD</Text>
                  <Text style={styles.finalsBadge}>$10,000 USD MATCH</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Right Column: Key Stats & Action Box */}
        <View style={styles.rightCol}>
          <View style={styles.actionPanel}>
            <Text style={styles.actionHeader}>REGISTRATION STATUS</Text>

            <View style={styles.bountyHero}>
              <Text style={styles.bountyTag}>TOTAL PRIZE POOL</Text>
              <Text style={styles.bountyAmount}>
                ${tournament.amount?.amount.toLocaleString() ?? '15,000'} {tournament.amount?.currency ?? 'USD'}
              </Text>
            </View>

            <View style={styles.statList}>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Team Size</Text>
                <Text style={styles.statVal}>{tournament.teamSize} Players (Squad)</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Slots Filled</Text>
                <Text style={styles.statVal}>
                  {tournament.enrolledCount ?? 48} / {tournament.maxEntry} Registered
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Start Date</Text>
                <Text style={styles.statVal}>
                  {tournament.tournamentDate ? new Date(tournament.tournamentDate).toLocaleDateString() : 'Nov 14, 2026'}
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Check-in Closes</Text>
                <Text style={styles.statVal}>
                  {tournament.registrationEndDate ? new Date(tournament.registrationEndDate).toLocaleDateString() : 'Nov 12, 2026'}
                </Text>
              </View>
            </View>

            {registered ? (
              <View style={styles.enrolledBox}>
                <Ionicons name="checkmark-circle" size={20} color={theme.colors.brand.accent} />
                <Text style={styles.enrolledText}>Bracket Slot Confirmed!</Text>
              </View>
            ) : (
              <PrimaryButton
                title="Claim Tournament Slot"
                variant="neon"
                onPress={handleRegister}
                icon={<Ionicons name="trophy" size={18} color="#09090D" />}
              />
            )}

            {/* Linked Game Card */}
            <View style={styles.gameLinkBox}>
              <Text style={styles.gameLinkLbl}>ASSOCIATED PLAYTEST</Text>
              <Text style={styles.gameLinkTitle}>{tournament.gameName}</Text>
              <TouchableOpacity
                style={styles.gameLinkBtn}
                onPress={() => router.push(`/games/${tournament.gameListingId}` as any)}
              >
                <Text style={styles.gameLinkBtnText}>View Game QA Specs</Text>
                <Ionicons name="arrow-forward" size={14} color={theme.colors.brand.accent} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  loadingContainer: {
    padding: 60,
    alignItems: 'center',
  },
  loadingText: {
    color: theme.colors.text.secondary,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  backBtnText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600',
  },
  heroCard: {
    height: 280,
    borderRadius: theme.borders.radius['2xl'],
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(9, 9, 13, 0.7)',
    padding: 32,
    justifyContent: 'flex-end',
    gap: 8,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stageTag: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.brand.secondary,
    letterSpacing: 0.8,
  },
  heroTitle: {
    fontSize: theme.typography.fontSize['4xl'],
    fontWeight: '900',
    color: theme.colors.text.primary,
    textTransform: 'uppercase',
    letterSpacing: -0.5,
  },
  heroSub: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    fontWeight: '600',
  },
  twoCol: {
    flexDirection: 'row',
    gap: 32,
    alignItems: 'flex-start',
  },
  leftCol: {
    flex: 1.4,
    gap: 28,
  },
  panel: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borders.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    padding: 28,
    gap: 16,
  },
  panelTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: '800',
    color: theme.colors.text.primary,
    textTransform: 'uppercase',
  },
  descText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    lineHeight: 24,
  },
  ruleList: {
    gap: 10,
    marginTop: 8,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  ruleText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
  bracketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bracketStatus: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.brand.accent,
  },
  bracketTree: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 12,
  },
  roundCol: {
    flex: 1,
    gap: 12,
  },
  roundTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.text.muted,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  matchCard: {
    backgroundColor: theme.colors.background.elevated,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.borders.radius.md,
    padding: 10,
    gap: 4,
  },
  teamText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  teamTextLost: {
    fontSize: 11,
    fontWeight: '500',
    color: theme.colors.text.muted,
  },
  finalsBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: theme.colors.brand.accent,
    marginTop: 2,
  },
  bracketConnector: {
    width: 14,
    height: 2,
    backgroundColor: theme.colors.border.medium,
  },
  rightCol: {
    flex: 0.9,
  },
  actionPanel: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borders.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
    padding: 28,
    gap: 20,
    ...theme.shadows.lg,
  },
  actionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.brand.accent,
    letterSpacing: 0.8,
  },
  bountyHero: {
    backgroundColor: theme.colors.background.elevated,
    padding: 16,
    borderRadius: theme.borders.radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(57, 230, 0, 0.2)',
  },
  bountyTag: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.text.muted,
  },
  bountyAmount: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: '900',
    color: theme.colors.brand.accent,
    marginTop: 4,
  },
  statList: {
    gap: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.muted,
    fontWeight: '600',
  },
  statVal: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.primary,
    fontWeight: '700',
  },
  enrolledBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(57, 230, 0, 0.15)',
    paddingVertical: 14,
    borderRadius: theme.borders.radius.md,
  },
  enrolledText: {
    color: theme.colors.brand.accent,
    fontWeight: '800',
    fontSize: theme.typography.fontSize.sm,
    textTransform: 'uppercase',
  },
  gameLinkBox: {
    backgroundColor: theme.colors.background.elevated,
    padding: 14,
    borderRadius: theme.borders.radius.md,
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.subtle,
  },
  gameLinkLbl: {
    fontSize: 9,
    fontWeight: '800',
    color: theme.colors.brand.secondary,
  },
  gameLinkTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  gameLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  gameLinkBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.brand.accent,
  },
});

