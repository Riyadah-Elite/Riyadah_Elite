import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { gameService } from '../../shared/services/gameService';
import { bugService } from '../../shared/services/bugService';
import { GameListing, BugReport } from '../../shared/types';
import { theme } from '../../shared/theme';
import { PrimaryButton } from '../../shared/components/PrimaryButton';
import { StatusBadge } from '../../shared/components/StatusBadge';
import { useAuth } from '../../shared/context/AuthContext';

interface Props {
  id: string;
}

export const DesktopGameDetailScreen: React.FC<Props> = ({ id }) => {
  const router = useRouter();
  const { user, openAuthModal } = useAuth();
  const [game, setGame] = useState<GameListing | null>(null);
  const [bugs, setBugs] = useState<BugReport[]>([]);
  const [enrolled, setEnrolled] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'bugs'>('overview');

  useEffect(() => {
    gameService.getGame(id).then(setGame);
    bugService.listReports({ gameListingId: id }).then(setBugs);
  }, [id]);

  if (!game) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading game playtest telemetry...</Text>
      </View>
    );
  }

  const handleEnroll = async () => {
    if (!user) {
      openAuthModal();
      return;
    }
    const success = await gameService.enrollGame(game.id);
    if (success) setEnrolled(true);
  };

  return (
    <View style={styles.container}>
      {/* Top back navigation */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.push('/games')}>
        <Ionicons name="arrow-back" size={16} color={theme.colors.text.secondary} />
        <Text style={styles.backBtnText}>Back to Game Testing Nexus</Text>
      </TouchableOpacity>

      {/* Hero Visual Card (Wireframe 3) */}
      <View style={styles.heroCard}>
        {game.imageUrl && <Image source={{ uri: game.imageUrl }} style={styles.heroImg} />}
        <View style={styles.heroOverlay}>
          <View style={styles.badgesRow}>
            <StatusBadge label="Closed Alpha Playtest" variant="green" />
            <View style={styles.platformBadge}>
              <Ionicons name="desktop-outline" size={13} color="#fff" />
              <Text style={styles.platformBadgeText}>{game.platform?.toUpperCase() || 'PC WINDOWS'}</Text>
            </View>
            <View style={styles.versionBadge}>
              <Text style={styles.versionBadgeText}>BUILD v0.9.4-RC2</Text>
            </View>
          </View>

          <Text style={styles.gameTitle}>{game.gameName}</Text>
          <Text style={styles.gameSub}>
            Studio: Apex Arc Studios • Genre: {game.categoryName || 'Tactical Sci-Fi'} • Engine: Unreal Engine 5.4
          </Text>
        </View>
      </View>

      {/* Navigation Tabs */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'overview' && styles.tabActive]}
          onPress={() => setActiveTab('overview')}
        >
          <Ionicons
            name="document-text-outline"
            size={16}
            color={activeTab === 'overview' ? theme.colors.brand.accent : theme.colors.text.secondary}
          />
          <Text style={[styles.tabText, activeTab === 'overview' && styles.tabTextActive]}>
            Playtest Overview & Scope
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'specs' && styles.tabActive]}
          onPress={() => setActiveTab('specs')}
        >
          <Ionicons
            name="hardware-chip-outline"
            size={16}
            color={activeTab === 'specs' ? theme.colors.brand.accent : theme.colors.text.secondary}
          />
          <Text style={[styles.tabText, activeTab === 'specs' && styles.tabTextActive]}>
            System Requirements
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'bugs' && styles.tabActive]}
          onPress={() => setActiveTab('bugs')}
        >
          <Ionicons
            name="bug-outline"
            size={16}
            color={activeTab === 'bugs' ? theme.colors.brand.accent : theme.colors.text.secondary}
          />
          <Text style={[styles.tabText, activeTab === 'bugs' && styles.tabTextActive]}>
            QA Bug Reports ({bugs.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main 2-Column Content Layout (Wireframe 3) */}
      <View style={styles.mainLayout}>
        {/* Left Column (65%) */}
        <View style={styles.leftCol}>
          {activeTab === 'overview' && (
            <View style={styles.sectionCard}>
              <Text style={styles.sectionHeader}>Game Description</Text>
              <Text style={styles.bodyText}>
                {game.description ||
                  'Engage in next-generation high-fidelity combat featuring dynamic weather patterns, destructive environments, and ray-traced lighting pipelines.'}
              </Text>

              <View style={styles.divider} />

              <Text style={styles.sectionHeader}>Playtest Objectives & Testing Priorities</Text>
              <Text style={styles.bodyText}>
                Testers are requested to systematically investigate the following gameplay loops:
              </Text>
              <View style={styles.objectiveList}>
                <View style={styles.objectiveItem}>
                  <Ionicons name="checkmark-circle" size={16} color={theme.colors.brand.accent} />
                  <Text style={styles.objectiveText}>
                    <Text style={{ fontWeight: '700', color: '#fff' }}>Weapon Hitbox Sync: </Text>
                    Stress test high latency (100ms+) bullet registration on sprinting targets.
                  </Text>
                </View>
                <View style={styles.objectiveItem}>
                  <Ionicons name="checkmark-circle" size={16} color={theme.colors.brand.accent} />
                  <Text style={styles.objectiveText}>
                    <Text style={{ fontWeight: '700', color: '#fff' }}>Memory Leak & VRAM: </Text>
                    Monitor VRAM usage during extended 45-minute continuous matches.
                  </Text>
                </View>
                <View style={styles.objectiveItem}>
                  <Ionicons name="checkmark-circle" size={16} color={theme.colors.brand.accent} />
                  <Text style={styles.objectiveText}>
                    <Text style={{ fontWeight: '700', color: '#fff' }}>Menu Navigation & Ultrawide: </Text>
                    Verify 21:9 and 32:9 HUD element scaling in settings and inventory.
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <Text style={styles.sectionHeader}>Testing Guidelines & Confidentiality</Text>
              <Text style={styles.bodyText}>
                This build is covered under the Riyadah Elite Verified Tester NDA. Streaming, public capture,
                or redistribution of game binaries will result in immediate disqualification and testing tier revocation.
              </Text>
            </View>
          )}

          {activeTab === 'specs' && (
            <View style={styles.sectionCard}>
              <Text style={styles.sectionHeader}>Target System Requirements</Text>
              <View style={styles.specsGrid}>
                {/* Min Specs */}
                <View style={styles.specBox}>
                  <Text style={styles.specBoxTitle}>MINIMUM SPECIFICATIONS</Text>
                  <View style={styles.specRow}>
                    <Text style={styles.specKey}>OS</Text>
                    <Text style={styles.specVal}>Windows 10 64-bit (21H2)</Text>
                  </View>
                  <View style={styles.specRow}>
                    <Text style={styles.specKey}>CPU</Text>
                    <Text style={styles.specVal}>Intel Core i5-8400 / AMD Ryzen 5 2600</Text>
                  </View>
                  <View style={styles.specRow}>
                    <Text style={styles.specKey}>GPU</Text>
                    <Text style={styles.specVal}>NVIDIA GTX 1060 6GB / RX 580</Text>
                  </View>
                  <View style={styles.specRow}>
                    <Text style={styles.specKey}>RAM</Text>
                    <Text style={styles.specVal}>16 GB DDR4</Text>
                  </View>
                  <View style={styles.specRow}>
                    <Text style={styles.specKey}>Storage</Text>
                    <Text style={styles.specVal}>65 GB SSD Required</Text>
                  </View>
                </View>

                {/* Rec Specs */}
                <View style={[styles.specBox, { borderColor: theme.colors.brand.secondary }]}>
                  <Text style={[styles.specBoxTitle, { color: theme.colors.brand.secondary }]}>
                    RECOMMENDED (60 FPS @ 1440P)
                  </Text>
                  <View style={styles.specRow}>
                    <Text style={styles.specKey}>OS</Text>
                    <Text style={styles.specVal}>Windows 11 64-bit (23H2)</Text>
                  </View>
                  <View style={styles.specRow}>
                    <Text style={styles.specKey}>CPU</Text>
                    <Text style={styles.specVal}>Intel Core i7-12700K / Ryzen 7 7800X3D</Text>
                  </View>
                  <View style={styles.specRow}>
                    <Text style={styles.specKey}>GPU</Text>
                    <Text style={styles.specVal}>RTX 4070 Ti 12GB / RX 7900 XT</Text>
                  </View>
                  <View style={styles.specRow}>
                    <Text style={styles.specKey}>RAM</Text>
                    <Text style={styles.specVal}>32 GB DDR5 6000MHz</Text>
                  </View>
                  <View style={styles.specRow}>
                    <Text style={styles.specKey}>Storage</Text>
                    <Text style={styles.specVal}>NVMe M.2 Gen4 SSD</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {activeTab === 'bugs' && (
            <View style={styles.sectionCard}>
              <View style={styles.bugsHeaderRow}>
                <Text style={styles.sectionHeader}>Known QA Issues & Bug Tracker</Text>
                <TouchableOpacity
                  style={styles.newBugBtn}
                  onPress={() => router.push(`/bug-report?gameId=${game.id}` as any)}
                >
                  <Ionicons name="add" size={14} color="#000" />
                  <Text style={styles.newBugBtnText}>File Bug Report</Text>
                </TouchableOpacity>
              </View>

              {bugs.length === 0 ? (
                <View style={styles.noBugsBox}>
                  <Ionicons name="shield-checkmark-outline" size={36} color={theme.colors.brand.accent} />
                  <Text style={styles.noBugsText}>No open issues logged for this build.</Text>
                </View>
              ) : (
                <View style={styles.bugsList}>
                  {bugs.map((bug) => (
                    <View key={bug.id} style={styles.bugCard}>
                      <View style={styles.bugTopRow}>
                        <View style={styles.bugSeverityBadge}>
                          <Text style={styles.bugSeverityText}>{bug.severity.toUpperCase()}</Text>
                        </View>
                        <Text style={styles.bugStatusText}>Status: {bug.status.toUpperCase()}</Text>
                        <Text style={styles.bugDateText}>
                          {bug.createdAt ? new Date(bug.createdAt).toLocaleDateString() : 'Recent'}
                        </Text>
                      </View>
                      <Text style={styles.bugDescText}>{bug.bugDescription}</Text>
                      {bug.reproSteps && bug.reproSteps.length > 0 && (
                        <View style={styles.reproBox}>
                          <Text style={styles.reproTitle}>Reproduction Steps:</Text>
                          {bug.reproSteps.map((step, idx) => (
                            <Text key={idx} style={styles.reproStep}>
                              {idx + 1}. {step}
                            </Text>
                          ))}
                        </View>
                      )}
                      <Text style={styles.bugReporter}>Reported by: {bug.userName || 'Verified Tester'}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>

        {/* Right Column (35%) — Action & Telemetry Panel (Wireframe 3) */}
        <View style={styles.rightCol}>
          {/* Action Card */}
          <View style={styles.actionCard}>
            <Text style={styles.actionTitle}>Tester Deployment</Text>
            <Text style={styles.actionDesc}>
              Enrolling grants immediate download access to the encrypted testing launcher and debug tools.
            </Text>

            {enrolled ? (
              <View style={styles.enrolledSuccessBox}>
                <Ionicons name="checkmark-circle" size={24} color={theme.colors.brand.accent} />
                <View>
                  <Text style={styles.enrolledTitle}>Enrolled in Playtest</Text>
                  <Text style={styles.enrolledDesc}>Launcher Key: RE-QA-9842-8819</Text>
                </View>
              </View>
            ) : (
              <PrimaryButton
                label="Apply for Playtest Build"
                onPress={handleEnroll}
                icon="download-outline"
                fullWidth
              />
            )}

            <TouchableOpacity
              style={styles.reportBugActionBtn}
              onPress={() => router.push(`/bug-report?gameId=${game.id}` as any)}
            >
              <Ionicons name="bug-outline" size={16} color={theme.colors.brand.accent} />
              <Text style={styles.reportBugActionText}>Submit QA Bug Report</Text>
            </TouchableOpacity>
          </View>

          {/* Telemetry Matrix Box */}
          <View style={styles.metaCard}>
            <Text style={styles.metaTitle}>Playtest Telemetry</Text>

            <View style={styles.metaItem}>
              <View style={styles.metaIcon}>
                <Ionicons name="people" size={16} color={theme.colors.brand.secondary} />
              </View>
              <View style={styles.metaInfo}>
                <Text style={styles.metaKey}>Active Enrolled Testers</Text>
                <Text style={styles.metaValue}>
                  {game.enrolledCount ?? 0} / {game.maxEntry || 500} Slots
                </Text>
              </View>
            </View>

            <View style={styles.metaItem}>
              <View style={styles.metaIcon}>
                <Ionicons name="calendar-outline" size={16} color={theme.colors.brand.secondary} />
              </View>
              <View style={styles.metaInfo}>
                <Text style={styles.metaKey}>Testing Deadline</Text>
                <Text style={styles.metaValue}>
                  {game.testingDeadline ? new Date(game.testingDeadline).toLocaleDateString() : 'In 14 Days'}
                </Text>
              </View>
            </View>

            <View style={styles.metaItem}>
              <View style={styles.metaIcon}>
                <Ionicons name="shield-checkmark" size={16} color={theme.colors.brand.accent} />
              </View>
              <View style={styles.metaInfo}>
                <Text style={styles.metaKey}>Bounty Reward Pool</Text>
                <Text style={[styles.metaValue, { color: theme.colors.brand.accent }]}>
                  {game.amount ? `$${game.amount.amount.toLocaleString()}` : '$5,000 Verified Pool'}
                </Text>
              </View>
            </View>

            <View style={styles.metaItem}>
              <View style={styles.metaIcon}>
                <Ionicons name="lock-closed-outline" size={16} color={theme.colors.text.muted} />
              </View>
              <View style={styles.metaInfo}>
                <Text style={styles.metaKey}>Build Integrity SHA-256</Text>
                <Text style={[styles.metaValue, { fontSize: 11, fontFamily: theme.typography.fontFamily.mono }]}>
                  e8a2f4c919d8...77a1
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  loadingContainer: {
    padding: 60,
    alignItems: 'center',
  },
  loadingText: {
    color: theme.colors.text.secondary,
    fontSize: 16,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  backBtnText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600',
  },
  heroCard: {
    height: 280,
    borderRadius: theme.borders.radius.lg,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: theme.colors.background.elevated,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    marginBottom: theme.spacing.lg,
  },
  heroImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(9, 9, 13, 0.75)',
    justifyContent: 'flex-end',
    padding: theme.spacing.xl,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  platformBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.borders.radius.sm,
  },
  platformBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    fontFamily: theme.typography.fontFamily.mono,
  },
  versionBadge: {
    backgroundColor: 'rgba(112, 41, 245, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borders.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.brand.secondary,
  },
  versionBadgeText: {
    color: theme.colors.brand.secondary,
    fontSize: 11,
    fontFamily: theme.typography.fontFamily.mono,
    fontWeight: '700',
  },
  gameTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.heading,
    marginBottom: 6,
  },
  gameSub: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
    paddingBottom: 10,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: theme.borders.radius.md,
  },
  tabActive: {
    backgroundColor: theme.colors.background.surface,
    borderWidth: 1,
    borderColor: theme.colors.brand.primary,
  },
  tabText: {
    color: theme.colors.text.secondary,
    fontSize: 14,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#fff',
  },
  mainLayout: {
    flexDirection: 'row',
    gap: 24,
  },
  leftCol: {
    flex: 1,
  },
  rightCol: {
    width: 360,
    gap: 20,
  },
  sectionCard: {
    backgroundColor: theme.colors.background.elevated,
    borderRadius: theme.borders.radius.lg,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.heading,
    marginBottom: 12,
  },
  bodyText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: 22,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border.subtle,
    marginVertical: 18,
  },
  objectiveList: {
    gap: 10,
    marginTop: 8,
  },
  objectiveItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  objectiveText: {
    flex: 1,
    color: theme.colors.text.secondary,
    fontSize: 14,
    lineHeight: 20,
  },
  specsGrid: {
    gap: 16,
    marginTop: 8,
  },
  specBox: {
    backgroundColor: theme.colors.background.surface,
    borderRadius: theme.borders.radius.md,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  specBoxTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.brand.accent,
    fontFamily: theme.typography.fontFamily.mono,
    marginBottom: 12,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
  },
  specKey: {
    color: theme.colors.text.muted,
    fontSize: 13,
    fontWeight: '600',
  },
  specVal: {
    color: theme.colors.text.primary,
    fontSize: 13,
    fontWeight: '500',
  },
  bugsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  newBugBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.brand.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borders.radius.sm,
  },
  newBugBtnText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '700',
  },
  noBugsBox: {
    alignItems: 'center',
    paddingVertical: 36,
    gap: 10,
  },
  noBugsText: {
    color: theme.colors.text.secondary,
    fontSize: 14,
  },
  bugsList: {
    gap: 12,
  },
  bugCard: {
    backgroundColor: theme.colors.background.surface,
    borderRadius: theme.borders.radius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  bugTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  bugSeverityBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  bugSeverityText: {
    color: '#EF4444',
    fontSize: 10,
    fontWeight: '800',
    fontFamily: theme.typography.fontFamily.mono,
  },
  bugStatusText: {
    color: theme.colors.text.muted,
    fontSize: 11,
    fontFamily: theme.typography.fontFamily.mono,
  },
  bugDateText: {
    color: theme.colors.text.muted,
    fontSize: 11,
    marginLeft: 'auto',
  },
  bugDescText: {
    color: theme.colors.text.primary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 6,
  },
  reproBox: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: 6,
    padding: 8,
    marginTop: 6,
    marginBottom: 6,
  },
  reproTitle: {
    fontSize: 11,
    color: theme.colors.text.secondary,
    fontWeight: '700',
    marginBottom: 4,
  },
  reproStep: {
    fontSize: 12,
    color: theme.colors.text.muted,
    lineHeight: 16,
  },
  bugReporter: {
    fontSize: 11,
    color: theme.colors.text.muted,
    marginTop: 4,
  },
  actionCard: {
    backgroundColor: theme.colors.background.elevated,
    borderRadius: theme.borders.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    gap: 14,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  actionDesc: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    lineHeight: 18,
  },
  enrolledSuccessBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(57, 230, 0, 0.1)',
    borderRadius: theme.borders.radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.colors.brand.accent,
  },
  enrolledTitle: {
    color: theme.colors.brand.accent,
    fontSize: 14,
    fontWeight: '700',
  },
  enrolledDesc: {
    color: theme.colors.text.primary,
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.mono,
  },
  reportBugActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.background.surface,
    paddingVertical: 12,
    borderRadius: theme.borders.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  reportBugActionText: {
    color: theme.colors.brand.accent,
    fontSize: 14,
    fontWeight: '600',
  },
  metaCard: {
    backgroundColor: theme.colors.background.elevated,
    borderRadius: theme.borders.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    gap: 14,
  },
  metaTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: theme.colors.background.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  metaInfo: {
    flex: 1,
  },
  metaKey: {
    fontSize: 11,
    color: theme.colors.text.muted,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginTop: 1,
  },
});

