import React, { useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, Text, ToastAndroid, Keyboard } from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Header from '../../components/Header';
import styles from './styles';
import Mensagem from '../../components/Mensagem';
import firebase from '../../services/firebase';

function Chat ({ route }) {
    const [message, setMessage] = useState('');
    const [caregando, setCarregando] = useState(true);
    const [enviando, setEnviando] = useState(true);
    const [allMessages, setAllMessages] = useState([]);
    const usuario = {
        nome: 'Marco',
        id: 'WpRZ4vTqzGhS44BlLnWjeUenEwe2',
        email: 'marcoant008@gmail.com',
    }
    const { idConversa } = route.params;

    useEffect(() => {
        /* setInterval(function(){ 
            setAllMessages(allMessages.sort(function (a, b) {
                if (a?.createdAt.seconds > b?.createdAt.seconds) {
                    return 1;
                }
                if (a?.createdAt.seconds < b?.createdAt.seconds) {
                    return -1;
                }
                // a must be equal to b
                return 0;
            }))
         }, 3000); */
        /* setAllMessages(allMessages.sort(function (a, b) {
            if (a?.createdAt.seconds > b?.createdAt.seconds) {
                return 1;
            }
            if (a?.createdAt.seconds < b?.createdAt.seconds) {
                return -1;
            }
            // a must be equal to b
            return 0;
        })) */
    }, []);

    useEffect(() => {
        async function load() {
            await firebase
                .firestore()
                .collection("mensagens")
                .where("idConversa", "==", idConversa)
                .onSnapshot((querySnapshot) => {
                    let aux = [];

                    querySnapshot.forEach((documentSnapshot) => {
                        aux.push({ id: documentSnapshot.id, ...documentSnapshot.data() });
                    });

                    /* aux.sort(function (a, b) {
                        if (a?.createdAt.seconds > b?.createdAt.seconds) {
                          return 1;
                        }
                        if (a?.createdAt.seconds < b?.createdAt.seconds) {
                          return -1;
                        }
                        // a must be equal to b
                        return 0;
                    }); */

                    console.log(aux)

                    setAllMessages(aux);
                    setCarregando(false);
                })
                .catch((err) => {
                    ToastAndroid.show("Erro ao obter mensagens.", ToastAndroid.SHORT);
                });
        }

        load();
    }, [])

    async function handleSend () {
        setEnviando(true)

        await firebase
            .firestore()
            .collection("mensagens")
            .add({
                conteudo: message,
                idRemetente: usuario.id,
                idDestinatario: '06IzHTTb7QPtVnqhDB7zfrfhHeD2',
                idConversa: 'YL1RnPVXFDGZh9GYJfKz',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then((value) => {
                Keyboard.dismiss();
                setMessage('');
                /* setAllMessages([
                    ...allMessages,
                    {
                        id: value.id,
                        conteudo: message,
                        idRemetente: usuario.id,
                        idDestinatario: '06IzHTTb7QPtVnqhDB7zfrfhHeD2',
                        idConversa: 'YL1RnPVXFDGZh9GYJfKz',
                    },
                ]); */
            })
            .catch((err) => {
                Toast.show("Erro ao postar resposta.", Toast.SHORT);
            });

        setEnviando(false);
    }

    return (
        <View style={styles.container}>
            <Header/>
            <Text style={styles.title}>{allMessages.length} mensagens trocadas</Text>
            <View style={styles.containerMessages}>
                <ScrollView>
                {
                    allMessages.map(item => (
                        <Mensagem key={item.id} msg={item} />
                    ))
                }
                </ScrollView>
            </View>
            <View style={styles.containerInput}>
                <TextInput
                    placeholder='Escreva alguma coisa...'
                    multiline
                    style={styles.input}
                    value={message}
                    onChangeText={setMessage}
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                    <MaterialCommunityIcons name='send' size={25} color='#333' />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Chat;