import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { Colors } from "../config/theme";
import { HomeScreen } from "../screens/HomeScreen";
import { OpportunitiesScreen } from "../screens/OpportunitiesScreen";
import { TournamentsScreen } from "../screens/TournamentsScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { LoginScreen } from "../screens/LoginScreen";
import { RegisterScreen } from "../screens/RegisterScreen";
import { useAuth } from "../context/AuthContext";

type Tab = "home" | "opportunities" | "tournaments" | "profile" | "auth";

export const NavigationContainer: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const renderScreen = () => {
    switch (activeTab) {
      case "home":
        return <HomeScreen />;
      case "opportunities":
        return <OpportunitiesScreen />;
      case "tournaments":
        return <TournamentsScreen />;
      case "profile":
        return <ProfileScreen />;
      case "auth":
        return authMode === "login" ? (
          <LoginScreen
            onSwitchToRegister={() => setAuthMode("register")}
            onSuccess={() => setActiveTab("profile")}
          />
        ) : (
          <RegisterScreen
            onSwitchToLogin={() => setAuthMode("login")}
            onSuccess={() => setActiveTab("profile")}
          />
        );
      default:
        return <HomeScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.logoText}>RIYADAH ELITE</Text>
        <TouchableOpacity
          style={styles.authBadge}
          onPress={() => {
            if (user) {
              setActiveTab("profile");
            } else {
              setActiveTab("auth");
            }
          }}
        >
          <Text style={styles.authBadgeText}>{user ? user.username : "Sign In"}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.body}>{renderScreen()}</View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === "home" && styles.tabItemActive]}
          onPress={() => setActiveTab("home")}
        >
          <Text style={[styles.tabLabel, activeTab === "home" && styles.tabLabelActive]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === "opportunities" && styles.tabItemActive]}
          onPress={() => setActiveTab("opportunities")}
        >
          <Text style={[styles.tabLabel, activeTab === "opportunities" && styles.tabLabelActive]}>
            Playtests
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === "tournaments" && styles.tabItemActive]}
          onPress={() => setActiveTab("tournaments")}
        >
          <Text style={[styles.tabLabel, activeTab === "tournaments" && styles.tabLabelActive]}>
            Tournaments
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === "profile" && styles.tabItemActive]}
          onPress={() => setActiveTab("profile")}
        >
          <Text style={[styles.tabLabel, activeTab === "profile" && styles.tabLabelActive]}>
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    height: 56,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceBorder,
    backgroundColor: Colors.surface,
  },
  logoText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
  authBadge: {
    backgroundColor: Colors.card,
    borderColor: Colors.surfaceBorder,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  authBadgeText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: "700",
  },
  body: {
    flex: 1,
  },
  tabBar: {
    flexDirection: "row",
    height: 56,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceBorder,
  },
  tabItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabItemActive: {
    borderTopWidth: 2,
    borderTopColor: Colors.primary,
  },
  tabLabel: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: "600",
  },
  tabLabelActive: {
    color: Colors.primary,
  },
});
