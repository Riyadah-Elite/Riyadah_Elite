import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'riyadah.elite.token';

/**
 * Native token storage.
 *
 * The API also sets an HttpOnly cookie, but a React Native app cannot rely on
 * a browser cookie jar surviving a restart. The token returned by the login
 * response is therefore kept in the platform keychain and sent as a Bearer
 * header. It never touches AsyncStorage or plain disk.
 */
export async function getStoredToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function setStoredToken(token: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
  } catch {
    /* A keychain failure must not break a successful login for this session. */
  }
}

export async function clearStoredToken(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch {
    /* Nothing to clear. */
  }
}
