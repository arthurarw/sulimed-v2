import { initializeDatabase } from "@/db/schema";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SQLiteProvider } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Drawer } from "expo-router/drawer";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SQLiteProvider databaseName="sulimed.db" onInit={initializeDatabase}>
      <ThemeProvider value={DefaultTheme}>
        <GestureHandlerRootView>
          <Drawer>
            <Drawer.Screen
              name="index" // This is the name of the page and must match the url from root
              options={{
                title: "Home",
              }}
            />
            <Drawer.Screen
              name="store"
              options={{
                title: "Cadastrar Contrato PF",
              }}
            />
            <Drawer.Screen
              name="storeCompany"
              options={{
                title: "Cadastrar Contrato PJ",
              }}
            />
          </Drawer>
        </GestureHandlerRootView>
      </ThemeProvider>
    </SQLiteProvider>
  );
}
