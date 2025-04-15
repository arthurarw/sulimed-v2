import AppService from "@/services/AppService";
import { styleStore } from "@/styles/styles";
import React, { useCallback, useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from "react-native";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDismissable?: boolean;
}

const ModalStreet: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  isDismissable = true,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleSave = async () => {
    if (!inputValue) {
      alert("Por favor, insira o nome da rua.");
      return;
    }

    await AppService.storeStreet(inputValue);

    alert("Rua salva com sucesso!");
    handleClose();
    setInputValue("");
  };

  const handleClose = useCallback(() => {
    if (isDismissable) {
      onClose();
    }
  }, [isDismissable, onClose]);

  if (!isOpen) return null; // Early return for when the modal is not open

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isOpen}
        onRequestClose={handleClose}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Inserir uma nova Rua</Text>
            <TextInput
              style={styleStore.input}
              placeholder="Nome da Rua"
              value={inputValue}
              onChangeText={setInputValue}
            />
            <View style={styleStore.btnContainer}>
              <TouchableOpacity
                style={styleStore.buttonCancel}
                onPress={handleClose}
              >
                <Text style={styleStore.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styleStore.button} onPress={handleSave}>
                <Text style={styleStore.buttonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

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
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default ModalStreet;
