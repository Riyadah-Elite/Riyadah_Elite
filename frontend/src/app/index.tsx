import React from 'react';
import { View, ScrollView, StyleSheet, Platform } from 'react-native';
import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeatureCards } from '@/components/landing/FeatureCards';
import { FeaturedGames } from '@/components/landing/FeaturedGames';
import { PlatformStats } from '@/components/landing/PlatformStats';
import { GameTesting } from '@/components/landing/GameTesting';
import { Tournaments } from '@/components/landing/Tournaments';
import { Rewards } from '@/components/landing/Rewards';
import { About } from '@/components/landing/About';
import { Community } from '@/components/landing/Community';
import { Newsletter } from '@/components/landing/Newsletter';
import { Footer } from '@/components/landing/Footer';

export default function HomeScreen() {
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webContainer}>
        <Navbar />
        <HeroSection />
        <FeatureCards />
        <FeaturedGames />
        <PlatformStats />
        <GameTesting />
        <Tournaments />
        <Rewards />
        <About />
        <Community />
        <Newsletter />
        <Footer />
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
      <FeatureCards />
      <FeaturedGames />
      <PlatformStats />
      <GameTesting />
      <Tournaments />
      <Rewards />
      <About />
      <Community />
      <Newsletter />
      <Footer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    width: '100%',
    minHeight: '100%',
    backgroundColor: '#F8FCFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FCFF',
  },
  contentContainer: {
    flexGrow: 1,
  },
});
