import { useNavigation } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AuthContext } from "../../contexts/auth";
import firebase from "../../services/firebase";
import styles from "./styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function Conversa(props) {
  const navigation = useNavigation();
  const [destinatario, setDestinatario] = useState({});
  const [mensagens, setMensagens] = useState({});
  const { conv } = props;
  const { usuario } = useContext(AuthContext);

  useEffect(() => {
    async function load() {
      await firebase
        .firestore()
        .collection("usuarios")
        .doc(conv.idConversa.replace(usuario.id, ""))
        .get()
        .then((snapshot) => {
          setDestinatario(snapshot.data());
        })
        .catch((err) => {
          ToastAndroid.show("Erro ao obter mensagens.", ToastAndroid.SHORT);
        });
    }

    load();
  }, []);

  useEffect(() => {
    console.log("aa");
    async function load() {
      await firebase
        .firestore()
        .collection("mensagens")
        .where("idConversa", "==", conv.idConversa)
        .onSnapshot((querySnapshot) => {
          let aux = [];

          querySnapshot.forEach((documentSnapshot) => {
            aux.push({ id: documentSnapshot.id, ...documentSnapshot.data() });
          });

          aux.sort(function (a, b) {
            if (a.ordem > b.ordem) {
              return 1;
            }
            if (a.ordem < b.ordem) {
              return -1;
            }

            return 0;
          });

          setMensagens(aux);
        })
        .catch((err) => {
          ToastAndroid.show("Erro ao obter mensagens.", ToastAndroid.SHORT);
        });
    }

    load();
  }, []);

  function toDateTime() {
    let dia = Number(conv.ordem.substring(8, 10));
    let mes = Number(conv.ordem.substring(5, 7));
    let ano = Number(conv.ordem.substring(0, 4));
    let hora = Number(conv.ordem.substring(11, 13));
    let minutos = Number(conv.ordem.substring(14, 16));

    const now = new Date();
    let nowdia = now.getDate();
    let nowmes = now.getMonth() + 1;
    let nowano = now.getFullYear();
    let nowhora = now.getHours();
    let nowminutos = now.getMinutes();

    if (dia < 10) dia = "0".concat(dia);
    if (mes < 10) mes = "0".concat(mes);
    if (hora < 10) hora = "0".concat(hora);
    if (minutos < 10) minutos = "0".concat(minutos);

    if (nowdia < 10) nowdia = "0".concat(nowdia);
    if (nowmes < 10) nowmes = "0".concat(nowmes);
    if (nowhora < 10) nowhora = "0".concat(nowhora);
    if (nowminutos < 10) nowminutos = "0".concat(nowminutos);

    const data = `${dia}/${mes}/${ano}`;
    const nowdata = `${nowdia}/${nowmes}/${nowano}`;

    const horario = `${hora}:${minutos}`;
    const nowhorario = `${nowhora}:${nowminutos}`;

    if (data === nowdata && nowhora === hora && nowminutos - minutos <= 2) {
      return "Agora";
    }
    if (
      data === nowdata &&
      nowhora === hora &&
      nowminutos - minutos >= 2 &&
      nowminutos - minutos <= 59
    ) {
      return `${nowminutos - minutos}m`;
    }
    if (data === nowdata && nowhora - hora <= 12) {
      return `${nowhora - hora}h`;
    }
    if (data === nowdata && nowhora - hora > 12) {
      return horario;
    }
    if (
      data !== nowdata &&
      nowano === ano &&
      mes === nowmes &&
      nowdia - dia === 1
    ) {
      return "Ontem";
    }
    if (nowano === ano && mes === nowmes && nowdia - dia <= 15) {
      return `${nowdia - dia}d`;
    }
    if (nowano === ano && mes !== nowmes) {
      return `${dia}/${mes}`;
    }

    return data;
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        navigation.navigate("Chat", {
          idUser: conv.idConversa.replace(usuario.id, ""),
        })
      }
    >
      <View style={styles.containerFotoMensagem}>
        <Image style={styles.avatar} source={{ uri: destinatario?.avatar }} />
        <View>
          <View style={styles.containerInfos}>
            <Text style={styles.name}>{destinatario?.nome}</Text>
          </View>
          <Text style={styles.preview} numberOfLines={1}>
            {mensagens[mensagens.length - 1]?.conteudo}
          </Text>
        </View>
      </View>
      <View style={styles.containerHoraIcon}>
        {mensagens.length > 0 && (
          <Text style={styles.time}>• {toDateTime()}</Text>
        )}
        <MaterialCommunityIcons name="message-outline" size={30} color="#999" />
      </View>
    </TouchableOpacity>
  );
}

export default Conversa;
