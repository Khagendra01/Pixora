export const AUTH_STORAGE_KEY = "pixora-auth";

export type StoredAuthPayload = {
  loggedIn: boolean;
  user?: {
    id: string;
    fullName: string;
    email: string;
  };
};
