import React, { useContext, useEffect, useState } from 'react';
import { Text, ToastAndroid, View, TouchableOpacity, FlatList } from 'react-native';
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
                //.orderBy('createdAt', 'desc')
                .onSnapshot((querySnapshot) => {
                    let aux = [];

                    querySnapshot.forEach((documentSnapshot) => { aux.push({ id: documentSnapshot.id, ...documentSnapshot.data() }) });

                    aux.sort(function (a, b) {
                        if (a.ordem < b.ordem) {
                            return 1;
                        }
                        if (a.ordem > b.ordem) {
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
            <View style={styles.containerTitle}>
                <Text style={styles.title}>Minhas Mensagens</Text>
                <TouchableOpacity style={styles.buttonNewMessage} onPress={() => navigation.navigate('NovaMensagem')} >
                    <MaterialCommunityIcons name='plus' size={30} color='#333' />
                </TouchableOpacity>
            </View>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={conversas}
                renderItem={({ item, index }) => (
                    <Conversa conv={item} />
                )}
                keyExtractor={(item) => String(item.id)}
            />
        </View>
    )
}

export default MinhasMensagens;