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
import { Redirect } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { styleStore } from "@/styles/styles";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useConnection } from "@/hooks/useConnection";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function AppLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const { authState, onLogout } = useAuth();
  const { isConnected } = useConnection();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  if (authState && authState.authenticated === false) {
    return <Redirect href="/login" />;
  }

  const handleLogout = () => {
    if (!isConnected) {
      Alert.alert("Erro!", "Você precisa estar conectado à internet.");
      return;
    }

    Alert.alert(
      "Você tem certeza que deseja sair?",
      "Você será redirecionado para a tela de login e todas as informações serão APAGADAS.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sim",
          onPress: onLogout,
        },
      ],
    );
  };

  function CustomDrawerContent(props: any) {
    return (
      <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <DrawerItemList {...props} />
        </View>
        <View>
          <TouchableOpacity
            style={styleStore.buttonCancel}
            onPress={handleLogout}
          >
            <Text style={styleStore.buttonText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </DrawerContentScrollView>
    );
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
            drawerContent={(props) => <CustomDrawerContent {...props} />}
          >
            <Drawer.Screen
              name="index" // This is the name of the page and must match the url from root
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
                title: "Contrato Individual",
                drawerIcon: ({ color, size }) => (
                  <Ionicons name="person-circle" size={size} color={color} />
                ),
              }}
            />
            <Drawer.Screen
              name="storeCompany"
              options={{
                title: "Contrato Empresarial",
                drawerIcon: ({ color, size }) => (
                  <Ionicons name="business" size={size} color={color} />
                ),
              }}
            />
            <Drawer.Screen
              name="syncContracts"
              options={{
                title: "Sincronizar Contratos",
                drawerIcon: ({ color, size }) => (
                  <Ionicons name="document-attach" size={size} color={color} />
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
            <Drawer.Screen
              name="contracts/dependents"
              options={{
                title: "Adicionar Dependente",
                drawerItemStyle: {
                  display: "none",
                },
              }}
            />
            <Drawer.Screen
              name="contracts/payment"
              options={{
                title: "Vincular Pagamento",
                drawerItemStyle: {
                  display: "none",
                },
              }}
            />
            <Drawer.Screen
              name="sync"
              options={{
                title: "Sincronizar Tabelas",
                drawerIcon: ({ color, size }) => (
                  <Ionicons name="sync-circle" size={size} color={color} />
                ),
              }}
            />
          </Drawer>
        </GestureHandlerRootView>
      </ThemeProvider>
    </SQLiteProvider>
  );
}
