import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Colors } from "../config/theme";
import { api } from "../services/api";
import { GameOpportunity } from "../types";
import { LoadingView } from "../components/LoadingView";
import { ErrorView } from "../components/ErrorView";

export const OpportunitiesScreen: React.FC = () => {
  const [opportunities, setOpportunities] = useState<GameOpportunity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOpportunities = async () => {
    setLoading(true);
    setError(null);
    const res = await api.get<{ opportunities: GameOpportunity[] }>("/player/opportunities");
    if (res.status === "ok" && res.data?.opportunities) {
      setOpportunities(res.data.opportunities);
    } else {
      setError(res.message || "Failed to load opportunities");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  if (loading) return <LoadingView message="Loading playtest opportunities..." />;
  if (error && opportunities.length === 0) return <ErrorView message={error} onRetry={fetchOpportunities} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={opportunities}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Text style={styles.headerTitle}>Game Testing Cohorts</Text>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No active testing cohorts available right now.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.stageBadge}>{item.stage}</Text>
            </View>
            <Text style={styles.studio}>{item.studio} • {item.platform}</Text>
            <Text style={styles.description} numberOfLines={2}>
              {item.description}
            </Text>
            {item.rewardText ? (
              <Text style={styles.reward}>Bounty: {item.rewardText}</Text>
            ) : null}
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
  stageBadge: {
    backgroundColor: Colors.surfaceBorder,
    color: Colors.primary,
    fontSize: 11,
    fontWeight: "700",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  studio: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginBottom: 8,
  },
  description: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  reward: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: "600",
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
