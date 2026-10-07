import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Colors } from "../config/theme";
import { api } from "../services/api";
import { Tournament } from "../types";
import { LoadingView } from "../components/LoadingView";
import { ErrorView } from "../components/ErrorView";

export const TournamentsScreen: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTournaments = async () => {
    setLoading(true);
    setError(null);
    const res = await api.get<{ tournaments: Tournament[] }>("/tournaments");
    if (res.status === "ok" && res.data?.tournaments) {
      setTournaments(res.data.tournaments);
    } else {
      setError(res.message || "Failed to load tournaments");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  if (loading) return <LoadingView message="Loading tournaments..." />;
  if (error && tournaments.length === 0) return <ErrorView message={error} onRetry={fetchTournaments} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={tournaments}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Text style={styles.headerTitle}>Active Competitions</Text>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No upcoming tournaments found.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.statusBadge}>{item.status}</Text>
            </View>
            <Text style={styles.game}>{item.game} • {item.format}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.meta}>Platform: {item.platform}</Text>
              {item.prizePool ? <Text style={styles.prize}>Prize: {item.prizePool}</Text> : null}
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  list: {
    padding: 16,
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  card: {
    backgroundColor: Colors.surface,
    borderColor: Colors.surfaceBorder,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: "700",
    flex: 1,
  },
  statusBadge: {
    backgroundColor: Colors.surfaceBorder,
    color: Colors.secondary,
    fontSize: 11,
    fontWeight: "700",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  game: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  meta: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  prize: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: "700",
  },
  emptyContainer: {
    padding: 32,
    alignItems: "center",
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 14,
  },
});
