import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { DesktopSidebar } from '../components/DesktopSidebar';
import { DesktopHeader } from '../components/DesktopHeader';
import { DesktopFooter } from '../components/DesktopFooter';
import { AuthModal } from '../../shared/components/AuthModal';
import { theme } from '../../shared/theme';

interface DesktopLayoutProps {
  children: React.ReactNode;
}

export const DesktopLayout: React.FC<DesktopLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <View style={styles.container}>
      {/* Persistent Desktop Sidebar */}
      <DesktopSidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
      />

      {/* Main Canvas */}
      <View style={styles.mainCanvas}>
        <DesktopHeader />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
        >
          <View style={styles.contentContainer}>
            {children}
          </View>
          <DesktopFooter />
        </ScrollView>
      </View>

      {/* Global Auth Modal */}
      <AuthModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: theme.colors.background.primary,
    height: '100%',
    width: '100%',
    overflow: 'hidden',
  },
  mainCanvas: {
    flex: 1,
    flexDirection: 'column',
    height: '100%',
    backgroundColor: theme.colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  contentContainer: {
    maxWidth: theme.spacing.layout.maxContentWidth,
    width: '100%',
    marginHorizontal: 'auto',
    paddingHorizontal: 36,
    paddingTop: 32,
    paddingBottom: 40,
  },
});

