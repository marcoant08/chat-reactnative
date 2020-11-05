import React, { useEffect, useState } from 'react';
import { Text, ToastAndroid, View } from 'react-native';
import Conversa from '../../components/Conversa';
import Header from '../../components/Header';
import styles from './styles';
import firebase from '../../services/firebase';

function MinhasMensagens () {
    const [conversas, setConversas] = useState([]);
    const usuario = {
        nome: 'Marco',
        id: 'WpRZ4vTqzGhS44BlLnWjeUenEwe2',
        email: 'marcoant008@gmail.com',
    }

    useEffect(() => {
        async function load() {
            await firebase
                .firestore()
                .collection("conversas")
                .where("idUser", "==", usuario.id)
                .onSnapshot((querySnapshot) => {
                    let aux = [];

                    querySnapshot.forEach((documentSnapshot) => { aux.push({ id: documentSnapshot.id, ...documentSnapshot.data() }) });

                    aux.sort(function (a, b) {
                        if (a.createdAt.seconds > b.createdAt.seconds) {
                        return 1;
                        }
                        if (a.createdAt.seconds < b.createdAt.seconds) {
                        return -1;
                        }
                        // a must be equal to b
                        return 0;
                    });

                    console.log(aux)
                    setConversas(aux)
                })
                .catch((err) => {
                    ToastAndroid.show("Erro ao carregar respostas.", ToastAndroid.SHORT);
                });
        }

        load();
    }, []);

    return (
        <View style={styles.container}>
            <Header/>
            <Text style={styles.title}>Minhas Mensagens</Text>
            {
                conversas.map(item => (
                    <Conversa key={item.id} conv={item} />
                ))
            }
        </View>
    )
}

export default MinhasMensagens;