import { useAuth } from "@/contexts/AuthContext";
import { useConnection } from "@/hooks/useConnection";
import { appRepository } from "@/repositories/AppRepository";
import { useState } from "react";
import {
  Alert,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
export default function Screen() {
  const [refreshing, setRefreshing] = useState(false);
  const { isConnected } = useConnection();
  const { onLogout } = useAuth();
  const [fetchingCities, setFetchingCities] = useState(false);
  const [fetchingStreets, setFetchingStreets] = useState(false);
  const [fetchingNeighborhoods, setFetchingNeighborhoods] = useState(false);
  const [fetchingCategories, setFetchingCategories] = useState(false);
  const [fetchingCategoriesBusiness, setFetchingCategoriesBusiness] =
    useState(false);

  const handleSyncContractsClick = () => {
    if (!isConnected) {
      Alert.alert("Erro!", "Você precisa estar conectado à internet.");
      return;
    }

    Alert.alert(
      "Você tem certeza que deseja sincronizar os contratos?",
      "Os contratos sincronizados serão excluídos do seu dispositivo e enviado ao servidor.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sim",
          onPress: handleSyncContracts,
        },
      ],
    );
  };

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

  const handleSyncContracts = async () => {
    setRefreshing(true);
    appRepository.syncBusinessContracts();
    appRepository.syncIndividualContracts();
    setRefreshing(false);
  };

  const handleSyncTables = async () => {
    setFetchingCities(false);
    setFetchingStreets(false);
    setFetchingNeighborhoods(false);
    setFetchingCategoriesBusiness(false);
    setFetchingCategories(false);
    setRefreshing(true);

    console.log("Syncing tables...");
    await appRepository.syncTablesToServer();

    await appRepository
      .fetchCities()
      .then(() => {
        setFetchingCities(true);
      })
      .catch((error) => {
        console.error(error);
        Alert.alert("Erro!", error);
      });

    await appRepository
      .fetchStreets()
      .then(() => {
        setFetchingStreets(true);
      })
      .catch((error) => {
        console.error(error);
        Alert.alert("Erro!", error);
      });

    await appRepository
      .fetchNeighborhoods()
      .then(() => {
        setFetchingNeighborhoods(true);
      })
      .catch((error) => {
        console.error(error);
        Alert.alert("Erro!", error);
      });

    await appRepository
      .fetchCategoriesBusinessContracts()
      .then(() => {
        setFetchingCategoriesBusiness(true);
      })
      .catch((error) => {
        console.error(error);
        Alert.alert("Erro!", error);
      });

    await appRepository
      .fetchCategoriesContract()
      .then(() => {
        setFetchingCategories(true);
      })
      .catch((error) => {
        console.error(error);
        Alert.alert("Erro!", error);
      });

    setRefreshing(false);
    Alert.alert("Sucesso!", "Tabelas sincronizadas com sucesso.");
  };

  return (
    <SafeAreaView style={styles.container}>
      {refreshing ? (
        <>
          <Text>
            {!fetchingCities ? "Sincronizando Cidades..." : "Cidades OK"}
          </Text>
          <Text>{!fetchingStreets ? "Sincronizando Ruas..." : "Ruas OK"}</Text>
          <Text>
            {!fetchingNeighborhoods ? "Sincronizando Bairros..." : "Bairros OK"}
          </Text>
          <Text>
            {!fetchingCategoriesBusiness
              ? "Sincronizando Categorias Empresariais..."
              : "Categorias Empresariais OK"}
          </Text>
          <Text>
            {!fetchingCategories
              ? "Sincronizando Categorias..."
              : "Categorias OK"}
          </Text>
        </>
      ) : (
        <>
          <TouchableOpacity style={styles.button} onPress={handleSyncTables}>
            <Text style={styles.buttonText}>Sincronizar Tabelas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={handleSyncContractsClick}
          >
            <Text style={styles.buttonText}>Sincronizar Contratos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonError} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    marginTop: StatusBar.currentHeight || 0,
  },
  button: {
    backgroundColor: "#1D643B", // Purple color
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5, // Rounded corners
    marginTop: 50,
    marginVertical: 10, // Space between buttons
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3, // For Android shadow
  },
  buttonError: {
    backgroundColor: "#ff0000", // Red color
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5, // Rounded corners
    marginTop: 50,
    marginVertical: 10, // Space between buttons
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3, // For Android shadow
  },
  buttonText: {
    color: "#fff", // White text
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
