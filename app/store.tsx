import { useRef } from "react";
import {
  Button,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import SignatureScreen, {
  SignatureViewRef,
} from "react-native-signature-canvas";

export default function Screen() {
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
      <Text>STORE CUSTOMERX</Text>
      <SignatureScreen ref={ref} onOK={handleOK} webStyle={style} />
      <View style={styles.row}>
        <Button title="Clear" onPress={handleClear} />
        <Button title="Confirm" onPress={handleConfirm} />
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
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },
});
