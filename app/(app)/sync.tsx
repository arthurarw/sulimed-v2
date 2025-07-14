import { useConnection } from "@/hooks/useConnection";
import { appRepository } from "@/repositories/AppRepository";
import AppService from "@/services/AppService";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Screen() {
  const [refreshing, setRefreshing] = useState(false);
  const [items, setItems] = useState([
    { id: "1", text: "Sincronizar Cidades", checked: false },
    { id: "2", text: "Sincronizar Ruas", checked: false },
    { id: "3", text: "Sincronizar Bairros", checked: false },
    { id: "4", text: "Sincronizar Categorias", checked: false },
    { id: "5", text: "Sincronizar Categorias Empresariais", checked: false },
  ]);

  const { isConnected } = useConnection();
  const [fetchingCities, setFetchingCities] = useState(false);
  const [fetchingStreets, setFetchingStreets] = useState(false);
  const [fetchingNeighborhoods, setFetchingNeighborhoods] = useState(false);
  const [fetchingCategories, setFetchingCategories] = useState(false);
  const [fetchingCategoriesBusiness, setFetchingCategoriesBusiness] =
    useState(false);
  const [connectionServer, setConnectionServer] = useState(false);

  const toggleItem = (id: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item,
      ),
    );
  };
  const renderItem = (item: { id: string; text: string; checked: boolean }) => (
    <TouchableOpacity style={styles.item} onPress={() => toggleItem(item.id)}>
      <Ionicons
        name={item.checked ? "checkmark-circle" : "ellipse-outline"}
        size={24}
        color={item.checked ? "green" : "gray"}
        style={styles.icon}
      />
      <Text style={styles.itemText}>{item.text}</Text>
    </TouchableOpacity>
  );

  const handleSyncTables = async () => {
    const hasNetwork = await isConnected();
    if (!hasNetwork) {
      Alert.alert("Erro", "Ooops!! Sem conexão com a internet.");
      return;
    }

    const checkConnection = await AppService.fetchCities()
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });

    if (!checkConnection) {
      Alert.alert("Erro", "Ooops!! Sem conexão com o servidor.");
      setConnectionServer(false);
      setRefreshing(false);
      return;
    }

    setRefreshing(true);
    setConnectionServer(true);

    setFetchingCities(false);
    setFetchingStreets(false);
    setFetchingNeighborhoods(false);
    setFetchingCategoriesBusiness(false);
    setFetchingCategories(false);

    console.log("Syncing tables...");
    for await (const item of items) {
      if (item.checked === true) {
        await appRepository.syncTablesToServer(item.id);

        if (item.id === "1") {
          console.log("Fetching cities...");
          await appRepository
            .fetchCities()
            .then(() => {
              setFetchingCities(true);
            })
            .catch((error) => {
              console.error(error);
              Alert.alert("Erro!", error);
            });
        }

        if (item.id === "2") {
          console.log("Fetching streets...");
          await appRepository
            .fetchStreets()
            .then(() => {
              setFetchingStreets(true);
            })
            .catch((error) => {
              console.error(error);
              Alert.alert("Erro!", error);
            });
        }

        if (item.id === "3") {
          console.log("Fetching neighborhoods...");
          await appRepository
            .fetchNeighborhoods()
            .then(() => {
              setFetchingNeighborhoods(true);
            })
            .catch((error) => {
              console.error(error);
              Alert.alert("Erro!", error);
            });
        }

        if (item.id === "4") {
          console.log("Fetching categories...");
          await appRepository
            .fetchCategoriesContract()
            .then(() => {
              setFetchingCategories(true);
            })
            .catch((error) => {
              console.error(error);
              Alert.alert("Erro!", error);
            });
        }

        if (item.id === "5") {
          console.log("Fetching business categories...");
          await appRepository
            .fetchCategoriesBusinessContracts()
            .then(() => {
              setFetchingCategoriesBusiness(true);
            })
            .catch((error) => {
              console.error(error);
              Alert.alert("Erro!", error);
            });
        }
      }
    }

    setRefreshing(false);
    Alert.alert("Sucesso!", "Tabelas sincronizadas com sucesso.");
  };

  useFocusEffect(
    useCallback(() => {
      setItems((prevItems) =>
        prevItems.map((item) => ({ ...item, checked: false })),
      );
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text>Selecione as tabelas que você deseja sincronizar</Text>
      <FlatList
        data={items}
        renderItem={({ item }) => renderItem(item)}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
      />

      <>
        <Modal animationType="slide" transparent={true} visible={refreshing}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <>
                <Text>
                  {!connectionServer
                    ? "Estabelecendo conexão com o servidor..."
                    : "Conectado ao servidor..."}
                </Text>
                <Text>{fetchingCities && "Cidades OK"}</Text>
                <Text>{fetchingStreets && "Ruas OK"}</Text>
                <Text>{fetchingNeighborhoods && "Bairros OK"}</Text>
                <Text>
                  {fetchingCategoriesBusiness && "Categorias Empresariais OK"}
                </Text>
                <Text>{fetchingCategories && "Categorias OK"}</Text>
              </>

              {refreshing ? (
                <>
                  <ActivityIndicator size="large" color="#1D643B" />
                  <Text>Sincronizando...</Text>
                </>
              ) : (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setRefreshing(false)}
                >
                  <Text style={styles.buttonText}>Fechar</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Modal>
      </>

      {refreshing ? (
        <>
          <TouchableOpacity
            style={{ ...styles.button, backgroundColor: "gray" }}
            disabled={true}
          >
            <Text style={styles.buttonText}>Sincronizar Tabelas</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity
            style={[
              styles.button,
              items.filter((item) => item.checked).length === 0 && {
                backgroundColor: "gray",
              },
            ]}
            disabled={items.filter((item) => item.checked).length === 0}
            onPress={handleSyncTables}
          >
            <Text style={styles.buttonText}>Sincronizar Tabelas</Text>
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
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  icon: {
    marginRight: 10,
  },
  itemText: {
    fontSize: 16,
  },
  checkedText: {
    textDecorationLine: "line-through",
    color: "gray",
  },
  buttonText: {
    color: "#fff", // White text
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  centeredView: {
    width: "100%", // Take full width
    height: "100%", // Take full height
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center", // Center content vertically
  },
  modalView: {
    margin: 20,
    width: "80%",
    height: "60%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
