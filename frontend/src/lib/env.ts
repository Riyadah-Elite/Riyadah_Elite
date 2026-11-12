import { Platform } from 'react-native';

/**
 * Where the Express API lives.
 *
 * Set EXPO_PUBLIC_API_URL for device builds (a LAN IP or hosted API). The
 * Android emulator cannot reach the host through localhost, so it gets the
 * standard 10.0.2.2 bridge address.
 */
const fallback = Platform.select({
  android: 'http://10.0.2.2:5000',
  default: 'http://localhost:5000',
});

export const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? fallback).replace(/\/+$/, '');
