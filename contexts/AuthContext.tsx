import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

interface AuthProps {
  authState?: { userId: string | null; authenticated: boolean | null };
  onLogin: (email: string, password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
}

const TOKEN_KEY = "user";

export interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthContext = createContext<AuthProps>({
  onLogin: async () => {
    return { userId: null, authenticated: false };
  },
  onLogout: async () => {
    return { userId: null, authenticated: false };
  },
  authState: { userId: null, authenticated: false },
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
}: any) => {
  const [authState, setAuthState] = useState<{
    userId: string | null;
    authenticated: boolean | null;
  }>({
    userId: null,
    authenticated: false,
  });

  useEffect(() => {
    const loadUser = async () => {
      const user = await SecureStore.getItemAsync(TOKEN_KEY);
      if (user) {
        setAuthState({ userId: user, authenticated: true });
      }
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log(email, password);

      setAuthState({ userId: "1", authenticated: true });

      await SecureStore.setItemAsync(TOKEN_KEY, "1");

      return { userId: "1", authenticated: true };
    } catch (error) {
      console.error(error);
      return { userId: null, authenticated: false };
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setAuthState({ userId: null, authenticated: false });
  };

  const value = {
    onLogin: login,
    onLogout: logout,
    authState,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
