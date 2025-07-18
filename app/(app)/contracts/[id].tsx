import { appRepository } from "@/repositories/AppRepository";
import { Contract } from "@/types/Database";
import { formatBrazilDateTimeNew } from "@/utils/String";
import { router, useLocalSearchParams } from "expo-router";
import Drawer from "expo-router/drawer";
import { useEffect, useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
export default function Screen() {
  const { id } = useLocalSearchParams();
  const [contract, setContract] = useState<Contract | null>(null);

  const fetchContract = async () => {
    console.log("Fetching contract...");
    const contract = await appRepository.fetchContract(Number(id));
    console.log(contract);
    setContract(contract);
  };

  const handleBackPress = () => {
    router.navigate({ pathname: "/contracts" });
  };

  const handleSignatureContract = () => {
    router.navigate({
      pathname: "/contracts/signature",
      params: { contractId: id },
    });
  };

  useEffect(() => {
    fetchContract();
  }, [id]);

  return (
    <SafeAreaView style={styles.container}>
      <Drawer.Screen options={{ title: "Informações do Contrato" }} />
      {contract ? (
        <>
          <View style={styles.containerText}>
            <Text style={styles.title}>Contrato #{id}</Text>
            <Text>Nome: {contract.name}</Text>
            <Text>Empresarial: {contract.is_company ? "SIM" : "NÃO"}</Text>
            <Text>CPF/CNPJ: {String(contract.document)}</Text>
            <Text>Data de Cadastro: {contract.created_at}</Text>
            <Text>Contrato assinado: {contract.signature ? "SIM" : "NÃO"}</Text>
            <Text>
              ID Contrato:{" "}
              {Number(contract.remote_contract_id)
                ? Number(contract.remote_contract_id)
                : "-"}
            </Text>
          </View>
          <TouchableOpacity
            style={
              contract.signature === null
                ? styles.button
                : styles.buttonDisabled
            }
            onPress={handleSignatureContract}
            disabled={contract.signature !== null}
          >
            <Text style={styles.buttonText}>Assinar Contrato</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonBack} onPress={handleBackPress}>
            <Text style={styles.buttonText}>Voltar</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text>Voltar</Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: "#f0f0f0",
    marginTop: StatusBar.currentHeight || 0,
  },
  containerText: {
    fontSize: 14,
    marginTop: 10,
    alignItems: "flex-start",
    flex: 1,
  },
  button: {
    backgroundColor: "#1D643B", // Purple color
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5, // Rounded corners
    marginVertical: 10, // Space between buttons
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3, // For Android shadow
  },
  buttonDisabled: {
    backgroundColor: "#aaa",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5, // Rounded corners
    marginVertical: 10, // Space between buttons
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3, // For Android shadow
  },
  buttonBack: {
    backgroundColor: "#1fb860", // Purple color
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5, // Rounded corners
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 5,
    marginBottom: 20,
  },
});
