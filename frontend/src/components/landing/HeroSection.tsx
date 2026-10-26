import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export function HeroSection() {
  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <View style={styles.badgeDot} />
        <Text style={styles.badgeText}>RIYADAH ARENA • ESPORTS & QA ECOSYSTEM</Text>
      </View>

      <Text style={styles.headline}>
        Discover Games.{'\n'}
        <Text style={styles.headlineHighlight}>Join the Competition.</Text>
      </Text>

      <Text style={styles.subtitle}>
        Explore games, join playtests, compete in tournaments, and help studios build better gaming experiences.
      </Text>

      <View style={styles.ctaRow}>
        <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.85}>
          <Ionicons name="game-controller-outline" size={18} color="white" />
          <Text style={styles.primaryBtnText}>Explore Games</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.85}>
          <Ionicons name="trophy-outline" size={18} color="#08A8C8" />
          <Text style={styles.secondaryBtnText}>View Tournaments</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statVal}>Verified Builds</Text>
          <Text style={styles.statLabel}>Alpha & Beta</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statVal}>Telemetry QA</Text>
          <Text style={styles.statLabel}>Direct Dev Logs</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statVal}>Tiered Ladders</Text>
          <Text style={styles.statLabel}>Official Brackets</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 40,
    backgroundColor: '#F4FAFE',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(8, 168, 200, 0.10)',
    borderWidth: 1,
    borderColor: 'rgba(8, 168, 200, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#08A8C8',
    marginRight: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#08A8C8',
    letterSpacing: 0.5,
  },
  headline: {
    fontSize: 36,
    fontWeight: '900',
    color: '#14283A',
    lineHeight: 44,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  headlineHighlight: {
    color: '#08A8C8',
  },
  subtitle: {
    fontSize: 15,
    color: '#647B91',
    lineHeight: 24,
    marginBottom: 28,
  },
  ctaRow: {
    flexDirection: 'column',
    gap: 12,
    marginBottom: 32,
  },
  primaryBtn: {
    backgroundColor: '#08A8C8',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#08A8C8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
  secondaryBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCE8F0',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryBtnText: {
    color: '#14283A',
    fontWeight: '700',
    fontSize: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#DCE8F0',
  },
  statBox: {
    flex: 1,
  },
  statVal: {
    fontSize: 14,
    fontWeight: '900',
    color: '#14283A',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#647B91',
    marginTop: 2,
  },
});

