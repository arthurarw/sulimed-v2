import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Screen() {
  const data = [
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

  const handleAlert = (index: number) => {
    console.log(index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text>Contratos</Text>
      <ScrollView horizontal={true}>
        <View style={styles.listContainer}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Nome</Text>
            <Text style={styles.headerText}>Data de Criação</Text>
            <Text style={styles.headerText}>Sincronizado</Text>
          </View>
          <FlatList
            data={data}
            renderItem={({ item }) => <Text>{item.name}</Text>}
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
  },
});
