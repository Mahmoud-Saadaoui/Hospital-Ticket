import { useCallback, useEffect, useMemo, useState } from "react";
import {
  login as loginRequest,
  logout as logoutRequest,
  refresh as refreshRequest,
  register as registerRequest,
} from "../api/authApi";
import {
  clearAccessToken,
  setAccessToken,
} from "../api/axiosInstance";
import { AuthContext } from "./AuthContext.js";

const AUTH_USER_KEY = "hospital-ticket-user";

const getUserFromResponse = (response) => {
  const data = response?.data;

  if (!data?.id && !data?.email) {
    return null;
  }

  return {
    id: data.id ?? null,
    name: data.name ?? "",
    email: data.email ?? "",
    isAdmin: data.isAdmin === true,
  };
};

const readStoredUser = () => {
  try {
    const storedUser = sessionStorage.getItem(AUTH_USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

const storeUser = (user) => {
  if (user) {
    sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } else {
    sessionStorage.removeItem(AUTH_USER_KEY);
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessTokenState] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [authError, setAuthError] = useState(null);

  const clearSession = useCallback(() => {
    clearAccessToken();
    setAccessTokenState(null);
    storeUser(null);
    setUser(null);
  }, []);

  const refreshSession = useCallback(async () => {
    const response = await refreshRequest();
    const accessToken = response?.data?.accessToken;

    if (!accessToken) {
      throw new Error("Refresh token response is invalid");
    }

    setAccessToken(accessToken);
    setAccessTokenState(accessToken);
    setUser((currentUser) => currentUser || readStoredUser());
    return accessToken;
  }, []);

  useEffect(() => {
    let isMounted = true;

    // The initial refresh synchronizes the React session with the HTTP-only cookie.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshSession()
      .catch(() => {
        if (isMounted) {
          clearSession();
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsInitializing(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [clearSession, refreshSession]);

  useEffect(() => {
    const handleSessionExpired = () => {
      clearSession();
    };

    window.addEventListener("auth:session-expired", handleSessionExpired);

    return () => {
      window.removeEventListener(
        "auth:session-expired",
        handleSessionExpired
      );
    };
  }, [clearSession]);

  const startSession = useCallback((response) => {
    const accessToken = response?.data?.accessToken;
    const nextUser = getUserFromResponse(response);

    if (!accessToken) {
      throw new Error("Authentication response is invalid");
    }

    setAccessToken(accessToken);
    setAccessTokenState(accessToken);
    setUser(nextUser);
    storeUser(nextUser);
    setAuthError(null);
  }, []);

  const login = useCallback(async (credentials) => {
    try {
      const response = await loginRequest(credentials);
      startSession(response);
      return response;
    } catch (error) {
      setAuthError(error);
      throw error;
    }
  }, [startSession]);

  const register = useCallback(async (credentials) => {
    try {
      const response = await registerRequest(credentials);
      startSession(response);
      return response;
    } catch (error) {
      setAuthError(error);
      throw error;
    }
  }, [startSession]);

  const logout = useCallback(async () => {
    try {
      return await logoutRequest();
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const value = useMemo(() => ({
    user,
    accessToken,
    isAuthenticated: Boolean(accessToken),
    isAdmin: user?.isAdmin === true,
    isInitializing,
    authError,
    login,
    register,
    logout,
    refreshSession,
  }), [
    user,
    accessToken,
    isInitializing,
    authError,
    login,
    register,
    logout,
    refreshSession,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
