/**
 * User-facing notification copy, kept in one place so wording is consistent.
 *
 * @author aliasgarbootwala3@gmial.com
 */

export const NOTIFICATION_MESSAGES = {
  WELCOME: "Welcome! Your account has been created.",
  ACCOUNT_DELETED: "Your account has been deleted.",
  ACCOUNT_RESTORED: "Your account has been restored.",
  GAME_LISTING_CREATED: (gameName: string) =>
    `Game testing is live: ${gameName}. You can enroll now.`,
  TOURNAMENT_CREATED: (tournamentName: string) =>
    `Tournament is live: ${tournamentName}. You can enroll now.`,
  BUG_REPORT_CREATED: (gameName: string) =>
    `A new bug report was submitted for ${gameName}`,
  USER_JOINED_GAME_TESTING: (username: string, gameName: string) =>
    `${username} joined your game testing: ${gameName}`,
  USER_JOINED_TOURNAMENT: (username: string, tournamentName: string) =>
    `${username} registered for your tournament: ${tournamentName}`,
  TOURNAMENT_FULL: (tournamentName: string) =>
    `Your tournament is full: ${tournamentName}`,
} as const;
