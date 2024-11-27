import { ContractCustomerList, CustomerDatabase } from "@/types/Database";
import { Link, router } from "expo-router";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Screen() {
  const data: ContractCustomerList[] = [
    { id: 1, name: "Nome 1", createdAt: "02/02/2024", sync: true },
    { id: 2, name: "Nome 2", createdAt: "02/02/2024", sync: true },
    { id: 3, name: "Nome 3", createdAt: "02/02/2024", sync: false },
    { id: 4, name: "Nome 4", createdAt: "02/02/2024", sync: true },
    { id: 5, name: "Nome 5", createdAt: "02/02/2024", sync: false },
    { id: 6, name: "Nome 6", createdAt: "02/02/2024", sync: false },
    { id: 7, name: "Nome 7", createdAt: "02/02/2024", sync: true },
    { id: 8, name: "Nome 8", createdAt: "02/02/2024", sync: true },
    { id: 9, name: "Nome 9", createdAt: "02/02/2024", sync: true },
  ];

  const handleClick = (id: number) => {
    router.navigate({ pathname: "/contracts/[id]", params: { id } });
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: ContractCustomerList;
    index: number;
  }) => {
    return (
      <Pressable onPress={() => handleClick(item.id)}>
        <View style={styles.row}>
          <Text style={styles.cell}>{item.name}</Text>
          <Text style={styles.cell}>{item.createdAt}</Text>
          <Text style={styles.cell}>
            {item.sync ? (
              <Text style={styles.success}>Sim</Text>
            ) : (
              <Text style={styles.error}>Não</Text>
            )}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Contratos Cadastrados</Text>
      <ScrollView horizontal>
        <View style={styles.listContainer}>
          <View style={styles.header}>
            <Text style={[styles.headerText, { width: 100 }]}>Nome</Text>
            <Text style={[styles.headerText, { width: 100 }]}>
              Data de Criação
            </Text>
            <Text style={[styles.headerText, { width: 100 }]}>
              Sincronizado
            </Text>
          </View>
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    marginTop: StatusBar.currentHeight || 0,
  },
  listContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    justifyContent: "space-between",
  },
  row: {
    marginVertical: 8,
    marginHorizontal: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    elevation: 1,
    borderRadius: 3,
    paddingVertical: 15,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
  },
  cell: {
    fontSize: 14,
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 5,
    marginBottom: 20,
  },
  success: {
    color: "#008000",
    fontWeight: "bold",
  },
  error: {
    color: "#ff0000",
    fontWeight: "bold",
  },
});
