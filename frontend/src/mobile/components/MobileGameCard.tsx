import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { GameListing } from '../../shared/types';
import { theme } from '../../shared/theme';

interface Props {
  game: GameListing;
}

export const MobileGameCard: React.FC<Props> = ({ game }) => {
  const router = useRouter();

  return (
    <View style={styles.card}>
      {game.imageUrl && (
        <Image source={{ uri: game.imageUrl }} style={styles.img} />
      )}
      <View style={styles.body}>
        <View style={styles.top}>
          <Text style={styles.cat}>{game.categoryName || 'ACTION'}</Text>
          <Text style={styles.platform}>{game.platform?.toUpperCase() || 'PC'}</Text>
        </View>

        <Text style={styles.title}>{game.gameName}</Text>
        {game.description && (
          <Text style={styles.desc} numberOfLines={2}>{game.description}</Text>
        )}

        <View style={styles.metaRow}>
          <Text style={styles.metaTxt}>{game.enrolledCount ?? 0} Testers</Text>
          <Text style={styles.metaDot}>•</Text>
          <Text style={[styles.metaTxt, { color: theme.colors.brand.accent }]}>
            {game.openBugsCount ?? 0} Open Tickets
          </Text>
        </View>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => router.push(`/games/${game.id}` as any)}
        >
          <Text style={styles.btnTxt}>Inspect Playtest</Text>
          <Ionicons name="arrow-forward" size={14} color={theme.colors.brand.accent} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borders.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    overflow: 'hidden',
    marginBottom: 14,
  },
  img: {
    width: '100%',
    height: 120,
  },
  body: {
    padding: 14,
    gap: 8,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cat: {
    fontSize: 9,
    fontWeight: '800',
    color: theme.colors.brand.accent,
    textTransform: 'uppercase',
  },
  platform: {
    fontSize: 9,
    fontWeight: '800',
    color: theme.colors.brand.secondary,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.text.primary,
  },
  desc: {
    fontSize: 11,
    color: theme.colors.text.secondary,
    lineHeight: 16,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 4,
  },
  metaTxt: {
    fontSize: 10,
    color: theme.colors.text.muted,
    fontWeight: '600',
  },
  metaDot: {
    color: theme.colors.text.muted,
    fontSize: 8,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background.elevated,
    paddingVertical: 8,
    borderRadius: theme.borders.radius.sm,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(57, 230, 0, 0.25)',
    marginTop: 4,
  },
  btnTxt: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.text.primary,
    textTransform: 'uppercase',
  },
});

