import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AuthContext } from '../../contexts/auth';
import firebase from '../../services/firebase'
import styles from './styles';

function Conversa (props) {
    const navigation = useNavigation();
    //const [destinatarios, setDestinatarios] = useState([]);
    const [destinatario, setDestinatario] = useState({});
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
                    setDestinatario(snapshot.data())
                    //console.log(snapshot.data())
                })
                .catch((err) => {
                    ToastAndroid.show("Erro ao obter mensagens.", ToastAndroid.SHORT);
                });
        }
        console.log(conv.idConversa.replace(usuario.id, ''), usuario.id)
        load();
    }, [])

    return <TouchableOpacity style={styles.container} onPress={() => navigation.navigate('Chat', { idUser: conv.idConversa.replace(usuario.id, '') })}>
        <Image style={styles.avatar} source={{ uri: destinatario?.avatar }} />
        <View>
            <View style={styles.containerInfos}>
                <Text style={styles.name}>{destinatario?.nome}</Text>
            </View>
            <Text style={styles.preview}>Olá, boa noite!<Text style={styles.time}> - 11:34</Text></Text>
        </View>
    </TouchableOpacity>
}

export default Conversa;