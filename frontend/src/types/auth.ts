/** User as returned by the backend. `password` never leaves the server. */
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  fullName?: string;
  role?: string;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/** Backend responses use `{ message: string }` or `{ errors: ... }` on failure. */
export interface ApiErrorBody {
  message?: string;
  status?: string;
  errors?: Record<string, string[]>;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

/** The backend sets an httpOnly cookie and also returns the token. */
export interface AuthResponse {
  user: User;
  token: string;
}