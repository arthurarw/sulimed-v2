import { initializeDatabase } from "@/db/schema";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { SQLiteProvider } from "expo-sqlite";
import { useEffect } from "react";
import { Drawer } from "expo-router/drawer";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { DATABASE_NAME } from "@/utils/Settings";
import { useSession } from "@/contexts/ProviderContext";
import { Redirect } from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const { session } = useSession();

  if (!session) {
    return <Redirect href="/" />;
  }

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SQLiteProvider databaseName={DATABASE_NAME} onInit={initializeDatabase}>
      <ThemeProvider value={DefaultTheme}>
        <GestureHandlerRootView>
          <Drawer
            screenOptions={{
              drawerPosition: "left",
              drawerType: "front",
              drawerActiveTintColor: "#1D643B",
            }}
          >
            <Drawer.Screen
              name="index"
              options={{
                title: "Login",
                drawerIcon: ({ color, size }) => (
                  <Ionicons name="home" size={size} color={color} />
                ),
              }}
            />
            <Drawer.Screen
              name="home" // This is the name of the page and must match the url from root
              options={{
                title: "Home",
                drawerIcon: ({ color, size }) => (
                  <Ionicons name="home" size={size} color={color} />
                ),
              }}
            />
            <Drawer.Screen
              name="contracts/index"
              options={{
                title: "Contratos",
                drawerIcon: ({ color, size }) => (
                  <Ionicons name="documents" size={size} color={color} />
                ),
              }}
            />
            <Drawer.Screen
              name="store"
              options={{
                title: "Cadastrar Contrato Individual",
                drawerIcon: ({ color, size }) => (
                  <Ionicons name="person-circle" size={size} color={color} />
                ),
              }}
            />
            <Drawer.Screen
              name="storeCompany"
              options={{
                title: "Cadastrar Contrato Empresarial",
                drawerIcon: ({ color, size }) => (
                  <Ionicons name="business" size={size} color={color} />
                ),
              }}
            />
            <Drawer.Screen
              name="config"
              options={{
                title: "Configurações",
                drawerIcon: ({ color, size }) => (
                  <Ionicons name="game-controller" size={size} color={color} />
                ),
              }}
            />
            <Drawer.Screen
              name="contracts/[id]"
              options={{
                title: "Informações do Contrato",
                drawerItemStyle: {
                  display: "none",
                },
              }}
            />
            <Drawer.Screen
              name="contracts/signature"
              options={{
                title: "Assinar Contrato",
                drawerItemStyle: {
                  display: "none",
                },
              }}
            />
          </Drawer>
        </GestureHandlerRootView>
      </ThemeProvider>
    </SQLiteProvider>
  );
}
