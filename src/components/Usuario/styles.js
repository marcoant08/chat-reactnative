import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    height: 80,
    width: "98%",
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
  },

  avatar: {
    height: 60,
    width: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#fff",
    backgroundColor: "#ccc",
    marginHorizontal: 20,
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default styles;
