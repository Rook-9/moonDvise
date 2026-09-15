export interface AuthSession {
  username: string;
}

interface StoredUser extends AuthSession {
  passwordHash: string;
}

const USERS_KEY = 'lunara-users';
const SESSION_KEY = 'lunara-session';

async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}

function getUsers(): StoredUser[] {
  const stored = localStorage.getItem(USERS_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored) as StoredUser[];
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getStoredSession(): AuthSession | null {
  const stored = localStorage.getItem(SESSION_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as AuthSession;
  } catch {
    return null;
  }
}

function saveSession(session: AuthSession): AuthSession {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export async function register(username: string, password: string): Promise<AuthSession> {
  const users = getUsers();
  const normalizedUsername = username.trim().toLowerCase();

  if (users.some(user => user.username === normalizedUsername)) {
    throw new Error('USER_EXISTS');
  }

  const session = { username: normalizedUsername };
  users.push({ ...session, passwordHash: await hashPassword(password) });
  saveUsers(users);
  return saveSession(session);
}

export async function login(username: string, password: string): Promise<AuthSession> {
  const normalizedUsername = username.trim().toLowerCase();
  const user = getUsers().find(candidate => candidate.username === normalizedUsername);

  if (!user || user.passwordHash !== await hashPassword(password)) {
    throw new Error('INVALID_CREDENTIALS');
  }

  return saveSession({ username: user.username });
}

export function clearStoredSession(): void {
  localStorage.removeItem(SESSION_KEY);
}
