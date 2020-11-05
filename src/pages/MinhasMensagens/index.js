import React, { useContext, useEffect, useState } from 'react';
import { Text, ToastAndroid, View, TouchableOpacity } from 'react-native';
import Conversa from '../../components/Conversa';
import Header from '../../components/Header';
import styles from './styles';
import firebase from '../../services/firebase';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AuthContext } from '../../contexts/auth';
import { useNavigation } from '@react-navigation/native';

function MinhasMensagens () {
    const [conversas, setConversas] = useState([]);
    const { usuario } = useContext(AuthContext);
    const navigation = useNavigation();

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

                    //console.log(aux)
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
            <View style={styles.containerTitle}>
                <Text style={styles.title}>Minhas Mensagens</Text>
                <TouchableOpacity style={styles.buttonNewMessage} onPress={() => navigation.push('NovaMensagem')} >
                    <MaterialCommunityIcons name='plus' size={30} color='#333' />
                </TouchableOpacity>
            </View>
            {
                conversas.map(item => (
                    <Conversa key={item.id} conv={item} />
                ))
            }
        </View>
    )
}

export default MinhasMensagens;