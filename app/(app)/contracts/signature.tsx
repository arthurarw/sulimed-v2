import { useLocalSearchParams } from "expo-router";
import Drawer from "expo-router/drawer";
import { useRef } from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Button,
} from "react-native";
import SignatureScreen, {
  SignatureViewRef,
} from "react-native-signature-canvas";

export default function Screen() {
  const { contractId } = useLocalSearchParams();

  const ref = useRef<SignatureViewRef>(null);

  const handleOK = async (signature: string) => {
    console.log(typeof signature);
    console.log(signature);
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
      <Drawer.Screen options={{ title: "Assinar Contrato #" + contractId }} />
      <Text style={styles.title}>Assinar Contrato #{contractId}</Text>
      <SignatureScreen ref={ref} onOK={handleOK} webStyle={style} />
      <View style={styles.row}>
        <Button title="Limpar" onPress={handleClear} />
        <Button title="Salvar" onPress={handleConfirm} />
      </View>
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
