import { useNavigation } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { AuthContext } from "../../contexts/auth";
import firebase from "../../services/firebase";
import styles from "./styles";

function Home() {
  const navigation = useNavigation();
  const [usuarios, setUsuarios] = useState([]);
  const { usuario, alterar } = useContext(AuthContext);

  useEffect(() => {
    async function load() {
      await firebase
        .firestore()
        .collection("usuarios")
        .get()
        .then((querySnapshot) => {
          setUsuarios([]);

          querySnapshot.forEach((documentSnapshot) => {
            setUsuarios((oldArray) => [
              ...oldArray,
              { id: documentSnapshot.id, ...documentSnapshot.data() },
            ]);
          });
        })
        .catch((err) => {
          Toast.show("Erro ao carregar respostas.", Toast.SHORT);
        });
    }

    load();
  }, []);

  return (
    <View style={styles.container}>
      <Text>
        {usuarios.length} | usuário logado: {usuario.nome}
      </Text>
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={() => navigation.navigate("MinhasMensagens")}
      >
        <Text style={styles.buttonText}>Ver Conversas</Text>
      </TouchableOpacity>
      {usuarios.map((item) => {
        return (
          <TouchableOpacity
            key={item.id}
            style={{
              backgroundColor: "#ddd",
              height: 50,
              width: 100,
              borderRadius: 10,
              margin: 5,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => alterar(item)}
          >
            <Text>{item.nome}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default Home;
