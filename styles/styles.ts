import { StatusBar, StyleSheet } from "react-native";

export const styleStore = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    marginTop: StatusBar.currentHeight || 0
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 50,
    width: "100%",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#1D643B",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonCancel: {
    backgroundColor: "#c0392b",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    textTransform: "uppercase",
  },
  buttonWarning: {
    backgroundColor: "#f39c12",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    textTransform: "uppercase",
  },
  buttonBlue: {
    backgroundColor: "#3498db",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    textTransform: "uppercase",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "uppercase",
  },
  btnContainer: {
    flexDirection: "column",
    gap: 15,
    justifyContent: "space-between",
    width: "100%",
  },
  errorText: {
    color: "#c0392b",
    marginBottom: 10,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
});
