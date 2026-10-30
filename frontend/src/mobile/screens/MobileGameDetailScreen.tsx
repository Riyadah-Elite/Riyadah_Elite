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

export const MobileGameDetailScreen: React.FC<Props> = ({ id }) => {
  const router = useRouter();
  const { user, openAuthModal } = useAuth();
  const [game, setGame] = useState<GameListing | null>(null);
  const [bugs, setBugs] = useState<BugReport[]>([]);
  const [enrolled, setEnrolled] = useState(false);
  const [tab, setTab] = useState<'overview' | 'specs' | 'bugs'>('overview');

  useEffect(() => {
    gameService.getGame(id).then(setGame);
    bugService.listReports({ gameListingId: id }).then(setBugs);
  }, [id]);

  if (!game) {
    return (
      <View style={{ padding: 40, alignItems: 'center' }}>
        <Text style={{ color: theme.colors.text.secondary }}>Loading playtest details...</Text>
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
      {/* Back Header */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.push('/games')}>
        <Ionicons name="arrow-back" size={18} color={theme.colors.text.primary} />
        <Text style={styles.backTxt}>Back to Games</Text>
      </TouchableOpacity>

      {/* Hero Image */}
      <View style={styles.heroCard}>
        {game.imageUrl && <Image source={{ uri: game.imageUrl }} style={styles.heroImg} />}
        <View style={styles.heroOverlay}>
          <View style={styles.tagRow}>
            <StatusBadge label="QA Playtest" variant="green" />
            <Text style={styles.platformBadge}>{game.platform?.toUpperCase() || 'PC'}</Text>
          </View>
          <Text style={styles.title}>{game.gameName}</Text>
        </View>
      </View>

      {/* Action / Enrollment Box */}
      <View style={styles.actionBox}>
        {enrolled ? (
          <View style={styles.enrolledBox}>
            <Ionicons name="checkmark-circle" size={20} color={theme.colors.brand.accent} />
            <Text style={styles.enrolledText}>Enrolled • Key: RE-QA-9842</Text>
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
          style={styles.bugBtn}
          onPress={() => router.push(`/bug-report?gameId=${game.id}` as any)}
        >
          <Ionicons name="bug-outline" size={16} color={theme.colors.brand.accent} />
          <Text style={styles.bugBtnTxt}>Report QA Issue</Text>
        </TouchableOpacity>
      </View>

      {/* Segment Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'overview' && styles.tabBtnActive]}
          onPress={() => setTab('overview')}
        >
          <Text style={[styles.tabTxt, tab === 'overview' && styles.tabTxtActive]}>Overview</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'specs' && styles.tabBtnActive]}
          onPress={() => setTab('specs')}
        >
          <Text style={[styles.tabTxt, tab === 'specs' && styles.tabTxtActive]}>Specs</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'bugs' && styles.tabBtnActive]}
          onPress={() => setTab('bugs')}
        >
          <Text style={[styles.tabTxt, tab === 'bugs' && styles.tabTxtActive]}>
            Bugs ({bugs.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Contents */}
      {tab === 'overview' && (
        <View style={styles.contentCard}>
          <Text style={styles.sectionTitle}>Game Description</Text>
          <Text style={styles.bodyTxt}>
            {game.description ||
              'Next-gen high-fidelity action title currently undergoing competitive balancing and network latency stress testing.'}
          </Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Testing Priorities</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Ionicons name="ellipse" size={6} color={theme.colors.brand.accent} style={{ marginTop: 6 }} />
              <Text style={styles.bulletTxt}>Weapon hitbox & netcode synchronization under 100ms+ ping.</Text>
            </View>
            <View style={styles.bulletItem}>
              <Ionicons name="ellipse" size={6} color={theme.colors.brand.accent} style={{ marginTop: 6 }} />
              <Text style={styles.bulletTxt}>Memory leak detection on matches longer than 40 minutes.</Text>
            </View>
            <View style={styles.bulletItem}>
              <Ionicons name="ellipse" size={6} color={theme.colors.brand.accent} style={{ marginTop: 6 }} />
              <Text style={styles.bulletTxt}>Audio spatial rendering bugs with 7.1 surround sound.</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.metaRow}>
            <View style={styles.metaCol}>
              <Text style={styles.metaLbl}>Active Testers</Text>
              <Text style={styles.metaVal}>{game.enrolledCount ?? 0} Players</Text>
            </View>
            <View style={styles.metaCol}>
              <Text style={styles.metaLbl}>Bounty Pool</Text>
              <Text style={[styles.metaVal, { color: theme.colors.brand.accent }]}>
                {game.amount ? `$${game.amount.amount.toLocaleString()}` : '$5,000'}
              </Text>
            </View>
          </View>
        </View>
      )}

      {tab === 'specs' && (
        <View style={styles.contentCard}>
          <Text style={styles.sectionTitle}>Recommended Specs (60 FPS)</Text>
          <View style={styles.specItem}>
            <Text style={styles.specLbl}>OS</Text>
            <Text style={styles.specVal}>Windows 11 64-bit</Text>
          </View>
          <View style={styles.specItem}>
            <Text style={styles.specLbl}>CPU</Text>
            <Text style={styles.specVal}>Intel Core i7-12700K / Ryzen 7</Text>
          </View>
          <View style={styles.specItem}>
            <Text style={styles.specLbl}>GPU</Text>
            <Text style={styles.specVal}>RTX 4070 Ti / RX 7900 XT</Text>
          </View>
          <View style={styles.specItem}>
            <Text style={styles.specLbl}>RAM</Text>
            <Text style={styles.specVal}>32 GB DDR5</Text>
          </View>
          <View style={styles.specItem}>
            <Text style={styles.specLbl}>Storage</Text>
            <Text style={styles.specVal}>65 GB NVMe SSD</Text>
          </View>
        </View>
      )}

      {tab === 'bugs' && (
        <View style={styles.contentCard}>
          <View style={styles.bugsHeader}>
            <Text style={styles.sectionTitle}>Reported Bugs</Text>
            <TouchableOpacity
              style={styles.addBugBtn}
              onPress={() => router.push(`/bug-report?gameId=${game.id}` as any)}
            >
              <Ionicons name="add" size={14} color="#000" />
              <Text style={styles.addBugTxt}>New Bug</Text>
            </TouchableOpacity>
          </View>

          {bugs.length === 0 ? (
            <Text style={{ color: theme.colors.text.muted, marginVertical: 12 }}>
              No open bugs reported for this build.
            </Text>
          ) : (
            <View style={styles.bugsStack}>
              {bugs.map((b) => (
                <View key={b.id} style={styles.miniBugCard}>
                  <View style={styles.miniBugRow}>
                    <Text style={styles.severityTag}>{b.severity.toUpperCase()}</Text>
                    <Text style={styles.bugStatus}>{b.status.toUpperCase()}</Text>
                  </View>
                  <Text style={styles.miniBugDesc}>{b.bugDescription}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  backTxt: {
    color: theme.colors.text.secondary,
    fontSize: 13,
  },
  heroCard: {
    height: 180,
    borderRadius: theme.borders.radius.md,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: theme.colors.background.surface,
    marginBottom: 14,
  },
  heroImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(9, 9, 13, 0.7)',
    justifyContent: 'flex-end',
    padding: 14,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  platformBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    fontFamily: theme.typography.fontFamily.heading,
  },
  actionBox: {
    gap: 10,
    marginBottom: 16,
  },
  enrolledBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(57, 230, 0, 0.1)',
    borderRadius: theme.borders.radius.sm,
    padding: 10,
    borderWidth: 1,
    borderColor: theme.colors.brand.accent,
  },
  enrolledText: {
    color: theme.colors.brand.accent,
    fontWeight: '700',
    fontSize: 13,
  },
  bugBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: theme.colors.background.surface,
    paddingVertical: 10,
    borderRadius: theme.borders.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  bugBtnTxt: {
    color: theme.colors.brand.accent,
    fontSize: 13,
    fontWeight: '600',
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: theme.borders.radius.sm,
    backgroundColor: theme.colors.background.surface,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  tabBtnActive: {
    backgroundColor: theme.colors.brand.primary,
    borderColor: theme.colors.brand.secondary,
  },
  tabTxt: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  tabTxtActive: {
    color: '#fff',
  },
  contentCard: {
    backgroundColor: theme.colors.background.surface,
    borderRadius: theme.borders.radius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  bodyTxt: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    lineHeight: 19,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border.subtle,
    marginVertical: 12,
  },
  bulletList: {
    gap: 8,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bulletTxt: {
    flex: 1,
    fontSize: 12,
    color: theme.colors.text.secondary,
    lineHeight: 17,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaCol: {
    flex: 1,
  },
  metaLbl: {
    fontSize: 11,
    color: theme.colors.text.muted,
  },
  metaVal: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginTop: 2,
  },
  specItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
  },
  specLbl: {
    fontSize: 12,
    color: theme.colors.text.muted,
  },
  specVal: {
    fontSize: 12,
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
  bugsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  addBugBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.brand.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  addBugTxt: {
    fontSize: 11,
    fontWeight: '700',
    color: '#000',
  },
  bugsStack: {
    gap: 10,
  },
  miniBugCard: {
    backgroundColor: theme.colors.background.elevated,
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  miniBugRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginBottom: 4,
  },
  severityTag: {
    fontSize: 9,
    color: '#EF4444',
    fontFamily: theme.typography.fontFamily.mono,
    fontWeight: '700',
  },
  bugStatus: {
    fontSize: 9,
    color: theme.colors.text.muted,
    fontFamily: theme.typography.fontFamily.mono,
  },
  miniBugDesc: {
    fontSize: 12,
    color: theme.colors.text.primary,
  },
});

