import { SessionProvider } from "@/contexts/ProviderContext";
import { Slot } from "expo-router";

export const unstable_settings = {
  initialRouteName: "login",
};

export default function RootLayoutNav() {
  return (
    <SessionProvider>
      <Slot />
    </SessionProvider>
  );
}
