import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  title: {
      fontSize: 16,
      textAlign: 'center',
      marginVertical: 5,
      color: '#555',
      fontWeight: 'bold',
  },

  containerMessages: {
      flex: 1,
  },

  containerInput: {
    alignItems: 'center',
    flexDirection: 'row',
  },

  input: {
      flex: 1,
      minHeight: 60,
      backgroundColor: '#fff',
      marginLeft: 10,
      borderRadius: 30,
      paddingHorizontal: 20,
      paddingVertical: 10,
      fontSize: 16,
      borderWidth: 1,
      borderColor: '#ccc',
  },

  sendButton: {
      height: 60,
      width: 60,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      margin: 10,
      borderRadius: 30,
      borderWidth: 1,
      borderColor: '#ccc',
  },
});

export default styles;
