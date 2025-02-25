import { appRepository } from "@/repositories/AppRepository";
import { styleStore } from "@/styles/styles";
import { router, useLocalSearchParams } from "expo-router";
import Drawer from "expo-router/drawer";
import { useRef } from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";
import SignatureScreen, {
  SignatureViewRef,
} from "react-native-signature-canvas";

export default function Screen() {
  const { contractId } = useLocalSearchParams();

  const ref = useRef<SignatureViewRef>(null);

  const handleOK = async (signature: string) => {
    await appRepository
      .setSignature(Number(contractId), signature)
      .then(() => {
        Alert.alert("Sucesso!", "Assinatura salva com sucesso.");
        router.navigate({
          pathname: "/contracts/[id]",
          params: { id: contractId.toString() },
        });
      })
      .catch(() => {
        Alert.alert("Erro!", "Ocorreu um erro ao salvar a assinatura.");
      });
  };

  const handleBackPress = () => {
    router.navigate({ pathname: "/contracts" });
  };

  const handleClear = () => {
    ref.current?.clearSignature();
  };

  const handleConfirm = () => {
    console.log("end");
    ref.current?.readSignature();
  };

  const style = ".m-signature-pad--footer {display: none; margin: 0px;}";

  return (
    <SafeAreaView style={styles.container}>
      <Drawer.Screen
        options={{
          title: "Assinar Contrato #" + contractId,
        }}
      />
      <Text style={styleStore.title}>Assinar Contrato #{contractId}</Text>
      <SignatureScreen ref={ref} onOK={handleOK} webStyle={style} />
      <View style={styles.row}>
        <TouchableOpacity
          onPress={handleClear}
          style={{ ...styleStore.buttonCancel, marginRight: 10 }}
        >
          <Text style={styleStore.buttonText}>Limpar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleConfirm} style={styleStore.button}>
          <Text style={styleStore.buttonText}>Salvar</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity
          onPress={handleBackPress}
          style={styleStore.buttonWarning}
        >
          <Text style={styleStore.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    marginTop: StatusBar.currentHeight || 0,
  },
  row: {
    marginVertical: 58,
    flexDirection: "row",
    borderRadius: 3,
    justifyContent: "space-between",
    paddingHorizontal: 8,
    backgroundColor: "#fff",
  },
});
