import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    //flexDirection: 'row',
  },

  balao: {
    flex: 1,
    height: 50,
    backgroundColor: '#ddd',
    marginHorizontal: 10,
    marginVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 40,
  },

  time: {
      color: '#555',
      paddingHorizontal: 10
  },

  mensagem: {
      fontSize: 16,
  }
});

export default styles;
