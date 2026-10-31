import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme } from '../../shared/theme';
import { PrimaryButton } from '../../shared/components/PrimaryButton';
import { SecondaryButton } from '../../shared/components/SecondaryButton';
import { useAuth } from '../../shared/context/AuthContext';

export const MobileHero: React.FC = () => {
  const router = useRouter();
  const { openAuthModal } = useAuth();

  return (
    <View style={styles.container}>
      {/* Eyebrow */}
      <View style={styles.eyebrow}>
        <View style={styles.dot} />
        <Text style={styles.eyebrowText}>RIYADAH ELITE • QA & ESPORTS</Text>
      </View>

      {/* Headline */}
      <Text style={styles.headline}>
        DISCOVER GAMES.{'\n'}
        <Text style={{ color: theme.colors.brand.accent }}>TEST BUILDS.</Text>{'\n'}
        COMPETE.
      </Text>

      <Text style={styles.subtext}>
        Connect directly with game studios. Join closed playtests, file reproducible bug tickets, and compete in prize-backed tournaments.
      </Text>

      {/* Buttons */}
      <View style={styles.ctaRow}>
        <PrimaryButton
          title="Explore Games"
          variant="neon"
          onPress={() => router.push('/games')}
          icon={<Ionicons name="game-controller" size={16} color="#09090D" />}
          style={{ flex: 1 }}
        />
        <SecondaryButton
          title="Playtests"
          onPress={() => router.push('/games')}
          icon={<Ionicons name="flask" size={16} color={theme.colors.brand.secondary} />}
          style={{ flex: 1 }}
        />
      </View>

      {/* Featured Card */}
      <View style={styles.featuredCard}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80' }}
          style={styles.cardImg}
        />
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTag}>FEATURED MISSION</Text>
            <Text style={styles.cardPrize}>$15,000 USD</Text>
          </View>
          <Text style={styles.cardTitle}>APEX PROTOCOL: ALPHA</Text>
          <Text style={styles.cardDesc}>
            Tactical extraction scrim with crash telemetry sync. 48/64 Squads registered.
          </Text>
          <PrimaryButton
            title="Reserve Slot"
            variant="neon"
            onPress={() => openAuthModal('Apex Protocol: Alpha')}
            style={{ marginTop: 8 }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
    marginBottom: 28,
  },
  eyebrow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(57, 230, 0, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borders.radius.round,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.brand.accent,
  },
  eyebrowText: {
    fontSize: 9,
    fontWeight: '800',
    color: theme.colors.brand.accent,
    letterSpacing: 0.8,
  },
  headline: {
    fontSize: 32,
    fontWeight: '900',
    color: theme.colors.text.primary,
    letterSpacing: -1,
    lineHeight: 36,
  },
  subtext: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    lineHeight: 19,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  featuredCard: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borders.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
    overflow: 'hidden',
    marginTop: 8,
  },
  cardImg: {
    width: '100%',
    height: 140,
  },
  cardContent: {
    padding: 16,
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTag: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.brand.accent,
    letterSpacing: 0.5,
  },
  cardPrize: {
    fontSize: 12,
    fontWeight: '900',
    color: theme.colors.brand.accent,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.text.primary,
  },
  cardDesc: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    lineHeight: 16,
  },
});

