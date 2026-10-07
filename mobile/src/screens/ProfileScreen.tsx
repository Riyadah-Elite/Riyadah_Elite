import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "../config/theme";
import { useAuth } from "../context/AuthContext";

export const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>
            {user ? user.username.charAt(0).toUpperCase() : "G"}
          </Text>
        </View>

        {user ? (
          <>
            <Text style={styles.name}>{user.fullName}</Text>
            <Text style={styles.username}>@{user.username}</Text>
            <Text style={styles.roleBadge}>{user.role}</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
              <Text style={styles.logoutText}>Sign Out</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.name}>Guest Tester</Text>
            <Text style={styles.subtitle}>
              Sign in to manage playtest submissions, track QA badges, and register for tournaments.
            </Text>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  card: {
    backgroundColor: Colors.surface,
    borderColor: Colors.surfaceBorder,
    borderWidth: 1,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  avatarPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.surfaceBorder,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: {
    color: Colors.primary,
    fontSize: 28,
    fontWeight: "700",
  },
  name: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  username: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: 12,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
    marginTop: 8,
  },
  roleBadge: {
    backgroundColor: Colors.card,
    color: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: Colors.surfaceBorder,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  logoutText: {
    color: Colors.danger,
    fontWeight: "600",
  },
});
