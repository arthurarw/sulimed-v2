import { appRepository } from "@/repositories/AppRepository";
import { ContractCustomerList } from "@/types/Database";
import { formatBrazilTime } from "@/utils/String";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Screen() {
  const [contracts, setContracts] = useState<ContractCustomerList[]>([]);
  const [refreshing, setRefreshing] = useState(true);

  const fetchContracts = async () => {
    setRefreshing(true);
    const contracts = await appRepository.fetchContracts();
    setContracts(contracts);
    setRefreshing(false);
  };

  const handleClick = (id: number) => {
    router.navigate({
      pathname: "/contracts/[id]",
      params: { id: id.toString() },
    });
    return;
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
          <Text style={styles.cell}>{item.is_company ? "Sim" : "Não"}</Text>
          <Text style={styles.cell}>{item.created_at}</Text>
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

  useEffect(() => {
    //insertTest();
    fetchContracts();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Contratos Cadastrados</Text>
      <ScrollView horizontal>
        {contracts.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum contrato cadastrado</Text>
        ) : (
          <View style={styles.listContainer}>
            <View style={styles.header}>
              <Text style={[styles.headerText, { width: 100 }]}>Nome</Text>
              <Text style={[styles.headerText, { width: 100 }]}>
                Empresarial
              </Text>
              <Text style={[styles.headerText, { width: 100 }]}>
                Dt. de Criação
              </Text>
              <Text style={[styles.headerText, { width: 100 }]}>
                Sincronizado
              </Text>
            </View>
            <FlatList
              data={contracts}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={fetchContracts}
                />
              }
            />
          </View>
        )}
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
  emptyText: {
    fontSize: 14,
    marginTop: 40,
  },
});
