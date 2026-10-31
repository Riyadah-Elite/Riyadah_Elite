import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { MobileHeader } from '../components/MobileHeader';
import { MobileNavigation } from '../components/MobileNavigation';
import { MobileFooter } from '../components/MobileFooter';
import { AuthModal } from '../../shared/components/AuthModal';
import { theme } from '../../shared/theme';

interface MobileLayoutProps {
  children: React.ReactNode;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  return (
    <View style={styles.container}>
      <MobileHeader />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {children}
        </View>
        <MobileFooter />
      </ScrollView>
      <MobileNavigation />
      <AuthModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    height: '100%',
    width: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
});

