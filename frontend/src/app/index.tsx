import React from 'react';
import { View, ScrollView, StyleSheet, Platform } from 'react-native';
import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturedGames } from '@/components/landing/FeaturedGames';
import { Tournaments } from '@/components/landing/Tournaments';
import { GameTesting } from '@/components/landing/GameTesting';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Community } from '@/components/landing/Community';
import { Footer } from '@/components/landing/Footer';
import { AuthModal } from '@/components/auth/AuthModal';

export default function HomeScreen() {
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webContainer}>
        <Navbar />
        {/* 1. Compact Hero */}
        <HeroSection />
        {/* 2. Featured Games */}
        <FeaturedGames />
        {/* 3. Upcoming Tournaments */}
        <Tournaments />
        {/* 4. Playtest & QA Opportunities */}
        <GameTesting />
        {/* 5. How It Works */}
        <HowItWorks />
        {/* 6. Community CTA & Compact Footer */}
        <Community />
        <Footer />
        {/* Global Auth Modal for Gated Tournament Registration & Sign In */}
        <AuthModal />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Navbar />
      <HeroSection />
      <FeaturedGames />
      <Tournaments />
      <GameTesting />
      <HowItWorks />
      <Community />
      <Footer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    width: '100%',
    minHeight: '100%',
    backgroundColor: '#F4FAFE',
  },
  container: {
    flex: 1,
    backgroundColor: '#F4FAFE',
  },
  contentContainer: {
    flexGrow: 1,
  },
});
