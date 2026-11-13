/**
 * Web token storage.
 *
 * The browser does not read or write the JWT: the API owns it as an HttpOnly
 * cookie, which is why every request is sent with `withCredentials`. Keeping
 * the token out of JavaScript is the point of that design.
 */
export async function getStoredToken(): Promise<string | null> {
  return null;
}

export async function setStoredToken(_token: string): Promise<void> {
  /* The Set-Cookie header already handled it. */
}

export async function clearStoredToken(): Promise<void> {
  /* The API clears the cookie on logout. */
}
