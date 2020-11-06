import React, { useContext, useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, Text, ToastAndroid, Keyboard } from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Header from '../../components/Header';
import styles from './styles';
import Mensagem from '../../components/Mensagem';
import firebase from '../../services/firebase';
import { AuthContext } from '../../contexts/auth';

function Chat ({ route }) {
    const [message, setMessage] = useState('');
    const [caregando, setCarregando] = useState(true);
    const [caregandoMensagens, setCarregandoMensagens] = useState(true);
    const [enviando, setEnviando] = useState(true);
    const [allMessages, setAllMessages] = useState([]);
    const { usuario } = useContext(AuthContext);
    const { idUser } = route.params;
    const idConversa = idUser > usuario.id ? idUser.concat(usuario.id) : usuario.id.concat(idUser);
    const [conversaExiste, setConversaExiste] = useState(false)

    useEffect(() => {
        console.log(idUser, usuario.id, idConversa)
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

                    console.log(aux);
                    setAllMessages(aux);
                    setCarregandoMensagens(false);
                })
                .catch((err) => {
                    ToastAndroid.show("Erro ao obter mensagens.", ToastAndroid.SHORT);
                });
        }

        load();
    }, []);

    useEffect(() => {
        async function load() {
            await firebase
                .firestore()
                .collection("conversas")
                .where("idConversa", "==", idConversa)
                .get()
                .then((querySnapshot) => {
                    let aux = [];

                    querySnapshot.forEach((documentSnapshot) => {
                        aux.push({ id: documentSnapshot.id, ...documentSnapshot.data() });
                    });

                    setConversaExiste(!!aux.length)
                })
                .catch((err) => {
                    ToastAndroid.show("Erro ao obter mensagens.", ToastAndroid.SHORT);
                });
        }

        load();
    }, []);

    async function criarConversa(){
        await firebase
            .firestore()
            .collection("conversas")
            .add({
                idConversa,
                idUser: usuario.id,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then(async (value) => {
                await firebase
                    .firestore()
                    .collection("conversas")
                    .add({
                        idConversa,
                        idUser,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    })
                    .then((value) => {
                        setConversaExiste(true);
                        send();
                    })
                    .catch((err) => {
                        Toast.show("Erro ao criar conversa.", Toast.SHORT);
                    });
            })
            .catch((err) => {
                Toast.show("Erro ao criar conversa.", Toast.SHORT);
            });
    }

    async function send () {
        await firebase
            .firestore()
            .collection("mensagens")
            .add({
                conteudo: message,
                idRemetente: usuario.id,
                idDestinatario: idUser,
                idConversa,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then((value) => {
                Keyboard.dismiss();
                setMessage('');
            })
            .catch((err) => {
                Toast.show("Erro ao postar resposta.", Toast.SHORT);
            });
    }

    return (
        <View style={styles.container}>
            <Header/>
            <Text style={styles.title}>{allMessages.length} mensagens trocadas {conversaExiste ? "true" : 'false'}</Text>
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
                <TouchableOpacity style={styles.sendButton} onPress={!conversaExiste ? criarConversa : send}>
                    <MaterialCommunityIcons name='send' size={25} color='#333' />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Chat;