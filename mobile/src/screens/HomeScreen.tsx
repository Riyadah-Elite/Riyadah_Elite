import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Colors } from "../config/theme";

export const HomeScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.heroCard}>
        <Text style={styles.badge}>COMPETITIVE ECOSYSTEM</Text>
        <Text style={styles.title}>Riyadah Elite</Text>
        <Text style={styles.subtitle}>
          The MENA premier game testing, QA certification, and tournament opportunity platform.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Core Capabilities</Text>
        
        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>Game Testing & QA</Text>
          <Text style={styles.featureDesc}>
            Join verified testing cohorts, run playtests on your rig, and submit structured bug reports with evidence.
          </Text>
        </View>

        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>Tournaments</Text>
          <Text style={styles.featureDesc}>
            Compete in grassroots, community, and collegiate tournaments across verified brackets.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
  },
  heroCard: {
    backgroundColor: Colors.surface,
    borderColor: Colors.surfaceBorder,
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  badge: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 8,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  section: {
    marginTop: 8,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  featureCard: {
    backgroundColor: Colors.card,
    borderColor: Colors.surfaceBorder,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  featureTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  featureDesc: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
});
