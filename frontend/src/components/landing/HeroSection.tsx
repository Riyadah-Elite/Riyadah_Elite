import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';


export function HeroSection() {
  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <View style={styles.badgeDot} />
        <Text style={styles.badgeText}>NEXT-GEN GAMING ECOSYSTEM</Text>
      </View>

      <Text style={styles.headline}>
        Play. Test.{' '}
        <Text style={styles.headlineHighlight}>Compete.</Text>{' '}
        Create.
      </Text>

      <Text style={styles.subtitle}>
        Join Riyadah Elite — the home for game testing, tournaments, and creative gaming experiences across the region and beyond.
      </Text>

      <View style={styles.ctaRow}>
        <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.85}>
          <Text style={styles.primaryBtnText}>Join the Community</Text>
          <Ionicons name="arrow-forward" size={18} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.85}>
          <Ionicons name="game-controller-outline" size={20} color="#0891B2" />
          <Text style={styles.secondaryBtnText}>Explore Games</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statVal}>100%</Text>
          <Text style={styles.statLabel}>Verified Studios</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statVal}>Real-Time</Text>
          <Text style={styles.statLabel}>Bug Reporting</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statVal}>Direct</Text>
          <Text style={styles.statLabel}>Dev Feedback</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    backgroundColor: '#F8FCFF',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#CFFAFE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0891B2',
    marginRight: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0E7490',
    letterSpacing: 0.5,
  },
  headline: {
    fontSize: 38,
    fontWeight: '900',
    color: '#172B3A',
    lineHeight: 44,
    marginBottom: 16,
  },
  headlineHighlight: {
    color: '#0891B2',
  },
  subtitle: {
    fontSize: 16,
    color: '#5B7083',
    lineHeight: 24,
    marginBottom: 28,
  },
  ctaRow: {
    flexDirection: 'column',
    gap: 12,
    marginBottom: 36,
  },
  primaryBtn: {
    backgroundColor: '#0891B2',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryBtnText: {
    color: '#172B3A',
    fontWeight: '700',
    fontSize: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  statBox: {
    flex: 1,
  },
  statVal: {
    fontSize: 18,
    fontWeight: '900',
    color: '#172B3A',
  },
  statLabel: {
    fontSize: 12,
    color: '#5B7083',
    marginTop: 2,
  },
});
