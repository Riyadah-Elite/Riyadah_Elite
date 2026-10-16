/**
 * @author aliasgarbootwala3@gmial.com
 */

export interface RegisterUserInput {
  username: string;
  email: string;
  password: string;
  avatarPath: string;
  avatarMimeType: string;
}

export interface CreateUserInput {
  username: string;
  email: string;
  password: string;
  avatar: string;
}

export interface LoginUserInput {
  email: string;
  password: string;
}

export interface LogoutUserInput {
  token: string;
  userId: string;
}

export interface ProfileUserInput {
  userId: string;
  token: string;
}