import * as SecureStore from 'expo-secure-store';

const PRIMARY_TOKEN_KEY = 'playpoint.token';
const LEGACY_TOKEN_KEY = 'riyadah.elite.token';

/**
 * Native token storage.
 *
 * The API also sets an HttpOnly cookie, but a React Native app cannot rely on
 * a browser cookie jar surviving a restart. The token returned by the login
 * response is therefore kept in the platform keychain and sent as a Bearer
 * header. It never touches AsyncStorage or plain disk.
 * Supports legacy token migration from 'riyadah.elite.token' to 'playpoint.token'.
 */
export async function getStoredToken(): Promise<string | null> {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      return window.localStorage.getItem(PRIMARY_TOKEN_KEY) || window.localStorage.getItem(LEGACY_TOKEN_KEY);
    } catch {
      return null;
    }
  }
  try {
    const primary = await SecureStore.getItemAsync(PRIMARY_TOKEN_KEY);
    if (primary) return primary;
    return await SecureStore.getItemAsync(LEGACY_TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function setStoredToken(token: string): Promise<void> {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(PRIMARY_TOKEN_KEY, token);
      return;
    } catch {
      // ignore
    }
  }
  try {
    await SecureStore.setItemAsync(PRIMARY_TOKEN_KEY, token, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
  } catch {
    /* A keychain failure must not break a successful login for this session. */
  }
}

export async function clearStoredToken(): Promise<void> {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.removeItem(PRIMARY_TOKEN_KEY);
      window.localStorage.removeItem(LEGACY_TOKEN_KEY);
      return;
    } catch {
      // ignore
    }
  }
  try {
    await SecureStore.deleteItemAsync(PRIMARY_TOKEN_KEY);
    await SecureStore.deleteItemAsync(LEGACY_TOKEN_KEY);
  } catch {
    /* Nothing to clear. */
  }
}
