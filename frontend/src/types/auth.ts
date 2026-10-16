/** User as returned by the backend. `password` never leaves the server. */
export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
}

/** Backend responses use `{ message: string }` on failure. */
export interface ApiErrorBody {
  message: string;
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