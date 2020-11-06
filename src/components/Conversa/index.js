import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AuthContext } from '../../contexts/auth';
import firebase from '../../services/firebase'
import styles from './styles';
import { MaterialCommunityIcons } from '@expo/vector-icons'

function Conversa (props) {
    const navigation = useNavigation();
    //const [destinatarios, setDestinatarios] = useState([]);
    const [destinatario, setDestinatario] = useState({});
    const [mensagens, setMensagens] = useState({});
    const { conv } = props;
    const { usuario } = useContext(AuthContext);

    useEffect(() => {
        async function load() {
            await firebase
                .firestore()
                .collection("usuarios")
                .doc(conv.idConversa.replace(usuario.id, ''))
                .get()
                .then((snapshot) => {
                    setDestinatario(snapshot.data());
                    //console.log(snapshot.data())
                })
                .catch((err) => {
                    ToastAndroid.show("Erro ao obter mensagens.", ToastAndroid.SHORT);
                });
        }
        //console.log(conv.idConversa.replace(usuario.id, ''), usuario.id)
        load();
    }, [])

    useEffect(() => {
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

                    //console.log(aux);
                    setMensagens(aux);
                })
                .catch((err) => {
                    ToastAndroid.show("Erro ao obter mensagens.", ToastAndroid.SHORT);
                });
        }

        load();
    }, []);

    function toDateTime(secs) {
        let t = new Date(Date.UTC(1970, 0, 1)); // Epoch
        let now = new Date(); // Epoch
        const nowsecs = new Date().getTime();

        t.setUTCSeconds(secs);
        

        return t;
    }

    return <TouchableOpacity style={styles.container} onPress={() => navigation.navigate('Chat', { idUser: conv.idConversa.replace(usuario.id, '') })}>
        <View style={styles.containerFotoMensagem}>
            <Image style={styles.avatar} source={{ uri: destinatario?.avatar }} />
            <View>
                <View style={styles.containerInfos}>
                    <Text style={styles.name}>{destinatario?.nome}</Text>
                </View>
                <Text style={styles.preview} numberOfLines={1}>{mensagens[mensagens.length-1]?.conteudo}</Text>
            </View>
        </View>
        <View style={styles.containerHoraIcon}>
            <Text style={styles.time}> • 11:33</Text>
            <MaterialCommunityIcons name='message-outline' size={30} color='#999' />
        </View>
    </TouchableOpacity>
}

export default Conversa;