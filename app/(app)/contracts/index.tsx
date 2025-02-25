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
  };

  const insertTest = async () => {
    for (let i = 0; i < 5; i++) {
      await appRepository.storeBusinessContract({
        is_company: true,
        colab_id: 1,
        pre_contract: "Pre-contract example",
        category_id: 1,
        category_business_id: 1,
        person_type: "Individual",
        person_name: "Alice Johnson",
        person_nickname: "Alice",
        person_observation: "No specific observations.",
        gender: 1,
        civil_state: 1,
        observation: "No specific observations.",
        unity_consumer: "Residential",
        dealership_id: 1,
        phone_1: "+1234567890",
        phone_2: "+0987654321",
        cellphone: "+1122334455",
        observation_phone_1: "Primary contact",
        observation_phone_2: "Secondary contact",
        observation_cellphone: "Mobile contact",
        name: "Alice Johnson",
        type: "Individual",
        email: "alice.johnson@example.com",
        zipcode: "12345-678",
        street_id: 1,
        neighborhood_id: 2,
        number: "456",
        city_id: 1,
        signature: "Signed digitally",
        created_at: "2024-11-27T10:00:00Z",
        sale_at: "2024-11-27T10:00:00Z",
        contract_at: "2024-11-27T10:00:00Z",
        document: "AB123456789",
        document_2: "CD987654321",
        mensality_price: "100",
        due_contract_day: 10,
        observation_remote: "Remote observation",
        parents_address: "Parents address example",
        father_name: "John Johnson",
        mother_name: "Jane Johnson",
        naturality_city: 123,
        bankslip_installments_generated: "1",
        bankslip_installments: 12,
        membership_fee: 50.0,
        account_holder_name: "Alice Johnson",
        account_holder_type: "Individual",
        account_document: "AB123456789",
        account_document_2: "CD987654321",
        action_registration: "Action registration example",
        action_registration_send: "Action registration send example",
        installation_partner: "Installation partner example",
        complement: "Complement example",
        company_fundation_at: "2024-11-27T10:00:00Z",
      });
    }
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
                Data de Criação
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
