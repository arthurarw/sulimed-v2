import { createContext, useContext } from "react";
import { useStorageState } from "@/hooks/useStorageState";
import { Text, View } from "react-native";
import AuthService from "@/services/AuthService";

const AuthContext = createContext<{
  signIn: () => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");
  return (
    <AuthContext.Provider
      value={{
        signIn: async () => {
          const login = await AuthService.login("admin", "admin");
          if (!login.id) {
            return;
          }

          setSession(`${login.id}`);
        },
        signOut: () => {
          setSession(null);
        },
        session,
        isLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
