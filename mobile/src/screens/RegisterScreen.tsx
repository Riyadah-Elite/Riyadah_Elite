import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import { Colors } from "../config/theme";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { User } from "../types";

export const RegisterScreen: React.FC<{ onSwitchToLogin?: () => void; onSuccess?: () => void }> = ({
  onSwitchToLogin,
  onSuccess,
}) => {
  const { login } = useAuth();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!fullName || !username || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError(null);

    const res = await api.post<{ user: User; token: string }>("/auth/signup", {
      fullName,
      username,
      email,
      password,
    });

    if (res.status === "ok" && res.data) {
      login(res.data.token, res.data.user);
      if (onSuccess) onSuccess();
    } else {
      setError(res.message || "Registration failed");
    }

    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join the Riyadah Elite testing and competitive circuit</Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor={Colors.textMuted}
        value={fullName}
        onChangeText={setFullName}
      />

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor={Colors.textMuted}
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Email address"
        placeholderTextColor={Colors.textMuted}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={Colors.textMuted}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading ? (
          <ActivityIndicator color={Colors.background} />
        ) : (
          <Text style={styles.buttonText}>Register</Text>
        )}
      </TouchableOpacity>

      {onSwitchToLogin ? (
        <TouchableOpacity style={styles.switchButton} onPress={onSwitchToLogin}>
          <Text style={styles.switchText}>Already have an account? Sign In</Text>
        </TouchableOpacity>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: 24,
  },
  errorText: {
    color: Colors.danger,
    marginBottom: 12,
    fontSize: 13,
  },
  input: {
    backgroundColor: Colors.surface,
    borderColor: Colors.surfaceBorder,
    borderWidth: 1,
    borderRadius: 8,
    color: Colors.textPrimary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 14,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: Colors.background,
    fontSize: 15,
    fontWeight: "700",
  },
  switchButton: {
    marginTop: 16,
    alignItems: "center",
  },
  switchText: {
    color: Colors.secondary,
    fontSize: 13,
  },
});
