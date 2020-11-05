import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AuthContext } from '../../contexts/auth';
import firebase from '../../services/firebase'
import styles from './styles';

function Conversa (props) {
    const navigation = useNavigation();
    const [destinatarios, setDestinatarios] = useState([]);
    const { conv } = props;
    const { usuario } = useContext(AuthContext);

    useEffect(() => {
        async function load() {
            await firebase
                .firestore()
                .collection("conversas")
                .where("idConversa", "==", conv.idConversa)
                .get()
                .then((querySnapshot) => {
                    let aux = [];

                    querySnapshot.forEach((documentSnapshot) => {
                        aux.push({ id: documentSnapshot.id, ...documentSnapshot.data() });
                    });

                    console.log(aux)
                    setDestinatarios(aux.filter(item => item.idUser !== usuario.id));
                })
                .catch((err) => {
                    ToastAndroid.show("Erro ao obter mensagens.", ToastAndroid.SHORT);
                });
        }

        load();
    }, [])

    return <TouchableOpacity style={styles.container} onPress={() => navigation.navigate('Chat', { idConversa: conv.idConversa })}>
        <Image style={styles.avatar} source={{ uri: destinatarios[0]?.avatar }} />
        <View>
            <View style={styles.containerInfos}>
                { destinatarios.map((item, i) => <Text key={item.id} style={styles.name}>{
                    i === 0 ? `${item.nome}` : `, ${item.nome}` 
                }</Text>) }
            </View>
            <Text style={styles.preview}>Olá, boa noite!<Text style={styles.time}> - 11:34</Text></Text>
        </View>
    </TouchableOpacity>
}

export default Conversa;