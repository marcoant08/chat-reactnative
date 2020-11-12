import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  containerTitle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginHorizontal: 20,
    paddingVertical: 10,
  },

  buttonNewMessage: {
    margin: 15,
  },
});

export default styles;
