import { initialProfile } from './mockData.js';

const USERS_DB_KEY = 'fitwise_users_db_v1';
const ACTIVE_SESSION_KEY = 'fitwise_active_user_session_v1';

// Seed demo user
const SEED_USERS = [
  {
    name: "Alex",
    email: "athlete@nutrifit.app",
    password: "demo1234",
    profile: {
      ...initialProfile,
      name: "Alex",
      email: "athlete@nutrifit.app"
    },
    createdAt: new Date().toISOString()
  },
  {
    name: "Alex Morgan",
    email: "alex.morgan@fitwise.ai",
    password: "demo1234",
    profile: {
      ...initialProfile,
      name: "Alex Morgan",
      email: "alex.morgan@fitwise.ai"
    },
    createdAt: new Date().toISOString()
  }
];

// Optional background sync with backend server if running
const syncWithBackend = async (endpoint, data) => {
  try {
    if (typeof window === 'undefined') return;
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const url = isLocal && window.location.port !== '3001' ? `http://localhost:3001/api/auth/${endpoint}` : `/api/auth/${endpoint}`;
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  } catch (e) {
    // Local storage acts as persistent client-side store
  }
};

/**
 * Retrieve all registered users from localStorage (seeded if empty)
 */
export const getUsersDB = () => {
  try {
    const raw = localStorage.getItem(USERS_DB_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure demo user is present
        const hasDemo = parsed.some(
          (u) => (u.email || '').toLowerCase() === 'alex.morgan@fitwise.ai'
        );
        if (!hasDemo) {
          parsed.unshift(SEED_USERS[0]);
          localStorage.setItem(USERS_DB_KEY, JSON.stringify(parsed));
        }
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error reading users DB:", e);
  }

  // Fallback to seed
  try {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(SEED_USERS));
  } catch (e) { }
  return SEED_USERS;
};

/**
 * Persist users list to localStorage
 */
export const saveUsersDB = (users) => {
  try {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
  } catch (e) {
    console.error("Error saving users DB:", e);
  }
};

/**
 * Find user by email (case-insensitive)
 */
export const findUserByEmail = (email) => {
  if (!email) return null;
  const clean = email.trim().toLowerCase();
  const users = getUsersDB();
  return users.find((u) => (u.email || '').toLowerCase() === clean) || null;
};

/**
 * Register a new user
 * Returns { success: boolean, error?: string, user?: object }
 */
export const registerUser = ({ name, email, password, defaultGuestProfile = {} }) => {
  const cleanName = (name || '').trim();
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPassword = (password || '').trim();

  if (!cleanName) {
    return { success: false, error: "Please enter your full name." };
  }
  if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
    return { success: false, error: "Please enter a valid email address." };
  }
  if (!cleanPassword) {
    return { success: false, error: "Please enter a password." };
  }
  if (cleanPassword.length < 6) {
    return { success: false, error: "Password must be at least 6 characters long." };
  }

  const users = getUsersDB();
  const existing = users.find((u) => (u.email || '').toLowerCase() === cleanEmail);
  if (existing) {
    return {
      success: false,
      error: `An account with "${cleanEmail}" already exists. Please sign in instead.`
    };
  }

  const newUser = {
    name: cleanName,
    email: cleanEmail,
    password: cleanPassword, // Stored password for verification
    profile: {
      ...defaultGuestProfile,
      name: cleanName,
      email: cleanEmail
    },
    createdAt: new Date().toISOString()
  };

  const updatedUsers = [...users, newUser];
  saveUsersDB(updatedUsers);
  syncWithBackend('register', { name: cleanName, email: cleanEmail, password: cleanPassword });

  return { success: true, user: newUser };
};

/**
 * Authenticate user credentials
 * Returns { success: boolean, error?: string, user?: object }
 */
export const authenticateUser = (email, password) => {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPassword = (password || '').trim();

  if (!cleanEmail) {
    return { success: false, error: "Please enter your email address." };
  }
  if (!cleanPassword) {
    return { success: false, error: "Please enter your password." };
  }

  const users = getUsersDB();
  const foundUser = users.find((u) => (u.email || '').toLowerCase() === cleanEmail);

  if (!foundUser) {
    return {
      success: false,
      error: `No account found with "${cleanEmail}". Please check your email or click Register to create a new account.`
    };
  }

  // Strict password check
  if (foundUser.password !== cleanPassword) {
    return {
      success: false,
      error: "Incorrect password. Please enter the password you registered with."
    };
  }

  return { success: true, user: foundUser };
};

/**
 * Reset user password
 * Returns { success: boolean, error?: string, message?: string }
 */
export const resetUserPassword = (email, newPassword) => {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPassword = (newPassword || '').trim();

  if (!cleanEmail) {
    return { success: false, error: "Please enter your email address." };
  }
  if (!cleanPassword || cleanPassword.length < 6) {
    return { success: false, error: "New password must be at least 6 characters long." };
  }

  const users = getUsersDB();
  const userIndex = users.findIndex((u) => (u.email || '').toLowerCase() === cleanEmail);

  if (userIndex === -1) {
    return {
      success: false,
      error: `No account found with "${cleanEmail}". Please check the email or register.`
    };
  }

  users[userIndex].password = cleanPassword;
  users[userIndex].updatedAt = new Date().toISOString();
  saveUsersDB(users);
  syncWithBackend('reset-password', { email: cleanEmail, newPassword: cleanPassword });

  return {
    success: true,
    message: "Password reset successfully! You can now sign in with your new password."
  };
};

/**
 * Update user's profile in the database
 */
export const updateUserProfileInDB = (email, updatedFields) => {
  if (!email) return;
  const cleanEmail = email.trim().toLowerCase();
  const users = getUsersDB();
  const userIndex = users.findIndex((u) => (u.email || '').toLowerCase() === cleanEmail);

  if (userIndex !== -1) {
    users[userIndex].profile = {
      ...(users[userIndex].profile || {}),
      ...updatedFields
    };
    if (updatedFields.name) {
      users[userIndex].name = updatedFields.name;
    }
    saveUsersDB(users);
  }
};

/**
 * Active session helpers
 */
export const getActiveSession = () => {
  try {
    const raw = localStorage.getItem(ACTIVE_SESSION_KEY) || sessionStorage.getItem(ACTIVE_SESSION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.email) {
        // Sync latest profile from DB
        const userInDB = findUserByEmail(parsed.email);
        if (userInDB) {
          return {
            email: userInDB.email,
            name: userInDB.name,
            profile: userInDB.profile
          };
        }
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error reading active session:", e);
  }
  return null;
};

export const saveActiveSession = (user, rememberMe = true) => {
  try {
    const sessionData = {
      email: user.email,
      name: user.name,
      profile: user.profile || user
    };
    const stringified = JSON.stringify(sessionData);
    if (rememberMe) {
      localStorage.setItem(ACTIVE_SESSION_KEY, stringified);
      sessionStorage.removeItem(ACTIVE_SESSION_KEY);
    } else {
      sessionStorage.setItem(ACTIVE_SESSION_KEY, stringified);
      localStorage.removeItem(ACTIVE_SESSION_KEY);
    }
  } catch (e) {
    console.error("Error saving active session:", e);
  }
};

export const clearActiveSession = () => {
  try {
    localStorage.removeItem(ACTIVE_SESSION_KEY);
    sessionStorage.removeItem(ACTIVE_SESSION_KEY);
  } catch (e) { }
};
