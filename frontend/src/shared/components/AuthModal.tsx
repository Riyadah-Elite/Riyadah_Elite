import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme';
import { PrimaryButton } from './PrimaryButton';

export const AuthModal: React.FC = () => {
  const { authModalOpen, authModalContext, closeAuthModal, login, register, isLoading } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<'USER' | 'DEVELOPER' | 'ORG'>('USER');
  const [errorMsg, setErrorMsg] = useState('');

  if (!authModalOpen) return null;

  const handleSubmit = async () => {
    setErrorMsg('');
    if (!email || !password) {
      setErrorMsg('Please enter email and password');
      return;
    }

    if (tab === 'login') {
      const ok = await login({ email, password });
      if (!ok) setErrorMsg('Invalid login credentials');
    } else {
      if (!username) {
        setErrorMsg('Please choose a gamer handle');
        return;
      }
      const ok = await register({ username, email, password, role });
      if (!ok) setErrorMsg('Registration failed');
    }
  };

  return (
    <Modal
      visible={authModalOpen}
      transparent
      animationType="fade"
      onRequestClose={closeAuthModal}
    >
      <Pressable style={styles.overlay} onPress={closeAuthModal}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.container}
        >
          <Pressable style={styles.dialog} onPress={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <TouchableOpacity style={styles.closeBtn} onPress={closeAuthModal}>
              <Ionicons name="close" size={20} color={theme.colors.text.muted} />
            </TouchableOpacity>

            {/* Header */}
            <View style={styles.header}>
              <View style={styles.badge}>
                <Ionicons name="lock-closed" size={12} color={theme.colors.brand.accent} />
                <Text style={styles.badgeText}>Authentication Required</Text>
              </View>
              <Text style={styles.title}>
                {tab === 'login' ? 'Access Riyadah Nexus' : 'Create Gamer Account'}
              </Text>
              {authModalContext ? (
                <Text style={styles.subtitle}>
                  Action requires verified telemetry access: {authModalContext}
                </Text>
              ) : (
                <Text style={styles.subtitle}>
                  Join competitive tournaments, earn testing XP, and report bugs.
                </Text>
              )}
            </View>

            {/* Tabs */}
            <View style={styles.tabBar}>
              <TouchableOpacity
                style={[styles.tab, tab === 'login' && styles.tabActive]}
                onPress={() => { setTab('login'); setErrorMsg(''); }}
              >
                <Text style={[styles.tabText, tab === 'login' && styles.tabTextActive]}>
                  Sign In
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, tab === 'register' && styles.tabActive]}
                onPress={() => { setTab('register'); setErrorMsg(''); }}
              >
                <Text style={[styles.tabText, tab === 'register' && styles.tabTextActive]}>
                  Register
                </Text>
              </TouchableOpacity>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {tab === 'register' && (
                <>
                  <Text style={styles.label}>Gamer Handle</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Vanguard_QA"
                    placeholderTextColor="#555"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                  />
                  <Text style={styles.label}>Account Role</Text>
                  <View style={styles.roleRow}>
                    {(['USER', 'DEVELOPER', 'ORG'] as const).map((r) => (
                      <TouchableOpacity
                        key={r}
                        style={[styles.roleChip, role === r && styles.roleChipActive]}
                        onPress={() => setRole(r)}
                      >
                        <Text style={[styles.roleText, role === r && styles.roleTextActive]}>
                          {r}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}

              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="pilot@riyadahelite.gg"
                placeholderTextColor="#555"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••••••"
                placeholderTextColor="#555"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

              <PrimaryButton
                title={tab === 'login' ? 'Sign In' : 'Confirm & Create Account'}
                onPress={handleSubmit}
                loading={isLoading}
                style={{ marginTop: 16 }}
              />
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 5, 8, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 440,
  },
  dialog: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borders.radius['2xl'],
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    padding: 28,
    position: 'relative',
    ...theme.shadows.lg,
  },
  closeBtn: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
    padding: 6,
  },
  header: {
    marginBottom: 20,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.brand.accent,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: '800',
    color: theme.colors.text.primary,
    textTransform: 'uppercase',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: 6,
    lineHeight: 18,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background.elevated,
    borderRadius: theme.borders.radius.md,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: theme.borders.radius.sm,
  },
  tabActive: {
    backgroundColor: theme.colors.background.hover,
  },
  tabText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: '700',
    color: theme.colors.text.muted,
    textTransform: 'uppercase',
  },
  tabTextActive: {
    color: theme.colors.text.primary,
  },
  form: {
    gap: 10,
  },
  label: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: '700',
    color: theme.colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  input: {
    backgroundColor: theme.colors.background.primary,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.borders.radius.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.sm,
  },
  roleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  roleChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: theme.borders.radius.sm,
    backgroundColor: theme.colors.background.primary,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    alignItems: 'center',
  },
  roleChipActive: {
    borderColor: theme.colors.brand.primary,
    backgroundColor: 'rgba(112, 41, 245, 0.2)',
  },
  roleText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.muted,
    fontWeight: '700',
  },
  roleTextActive: {
    color: theme.colors.brand.secondary,
  },
  errorText: {
    color: theme.colors.status.error,
    fontSize: theme.typography.fontSize.xs,
    marginTop: 6,
  },
});

