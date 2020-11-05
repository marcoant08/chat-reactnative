import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Image, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import styles from './styles';

function Conversa (props) {
    const navigation = useNavigation();
    const { conv } = props;

    return <TouchableOpacity style={styles.container} onPress={() => navigation.navigate('Chat', { idConversa: conv.idConversa })}>
        <Image style={styles.avatar} source={{ uri: 'https://veja.abril.com.br/wp-content/uploads/2019/12/neymar.jpg' }} />
        <View style={styles.containerInfos}>
            <Text style={styles.name}>{conv.idConversa}</Text>
            <Text style={styles.preview}>Olá, boa noite!<Text style={styles.time}> - 11:34</Text></Text>
        </View>
    </TouchableOpacity>
}

export default Conversa;