import React, { useContext, useEffect, useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, ToastAndroid } from 'react-native';
import Header from '../../components/Header';
import styles from './styles';
import firebase from '../../services/firebase';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Usuario from '../../components/Usuario';
import { AuthContext } from '../../contexts/auth';

function NovaMensagem () {
    const [nome, setNome] = useState('');
    const [usuarios, setUsuarios] = useState([]);
    const { usuario } = useContext(AuthContext);

    async function pesquisar() {
        /* await firebase
            .firestore()
            .collection("usuarios")
            .where("nome", "==", nome)
            .get()
            .then((querySnapshot) => {
                let aux = [];

                querySnapshot.forEach((documentSnapshot) => {
                    aux.push({ id: documentSnapshot.id, ...documentSnapshot.data() });
                });

                console.log(aux)
                if(!!aux.length) ToastAndroid.show('Nenhum usuário encontrado.')
                setUsuarios(aux);
            })
            .catch((err) => {
                ToastAndroid.show("Erro ao obter mensagens.", ToastAndroid.SHORT);
            }); */
            await firebase
                .firestore()
                .collection("usuarios")
                //.where('nome', '==', nome)
                .get()
                .then((querySnapshot) => {
                    setUsuarios([]);
            
                    querySnapshot.forEach((documentSnapshot) => {
                        if (documentSnapshot.id !== usuario.id) setUsuarios((oldArray) => [ ...oldArray, { id: documentSnapshot.id, ...documentSnapshot.data() }]);
                    });
                })
                .catch((err) => {
                    Toast.show("Erro ao carregar respostas.", Toast.SHORT);
                });
    }

    return <View style={styles.container}>
        <Header />
        <View style={styles.containerInput}>
            <TextInput
                placeholder='Escreva alguma coisa...'
                multiline
                style={styles.input}
                value={nome}
                onChangeText={setNome}
            />
            <TouchableOpacity style={styles.sendButton} onPress={pesquisar}>
                <MaterialCommunityIcons name='account-search' size={25} color='#333' />
            </TouchableOpacity>
        </View>
        <View style={styles.containerUsers}>
            { usuarios.map(item => <Usuario key={item.id} user={item} />) }
        </View>
    </View>
}

export default NovaMensagem;