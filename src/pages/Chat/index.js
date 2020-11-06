import React, { useContext, useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, Text, ToastAndroid, Keyboard, Image } from 'react-native';
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
    const [destinatario, setDestinatario] = useState({});
    const [allMessages, setAllMessages] = useState([]);
    const { usuario } = useContext(AuthContext);
    const { idUser } = route.params;
    const idConversa = idUser > usuario.id ? idUser.concat(usuario.id) : usuario.id.concat(idUser);
    const [conversaExiste, setConversaExiste] = useState(false)

    /* useEffect(() => {
        console.log(idUser, usuario.id, idConversa)
    }, []); */

    useEffect(() => {
        async function load() {
            await firebase
                .firestore()
                .collection("usuarios")
                .doc(idUser)
                .get()
                .then((snapshot) => {
                    setDestinatario(snapshot.data())
                })
                .catch((err) => {
                    ToastAndroid.show("Erro ao obter inforações do destinatário.", ToastAndroid.SHORT);
                });
        }

        load();
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

                    /* if (!!aux[aux.length-1].createdAt) {
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
                    } */

                    //console.log(aux);
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
            <View style={styles.containerInfos}>
                <View style={styles.containerDescription}>
                    <Text style={styles.nome}>{destinatario.nome}</Text>
                    <Text style={styles.description}>UX Design | <Text style={{ fontWeight: 'bold' }}>Kawasaki ER-6</Text></Text>
                </View>
            </View>
            <Image style={styles.avatar} source={{ uri: destinatario.avatar}} />
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
                <View style={styles.containerInput2}>
                    <TextInput
                        placeholder='Digite aqui...'
                        multiline
                        style={styles.input}
                        value={message}
                        onChangeText={setMessage}
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={!conversaExiste ? criarConversa : send}>
                        <MaterialCommunityIcons name='chat-outline' size={25} color='#f25c05' />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default Chat;