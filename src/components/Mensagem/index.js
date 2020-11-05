import React, { useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import styles from './styles';

function Mensagem (props) {
    const usuario = {
        nome: 'Marco',
        id: 'WpRZ4vTqzGhS44BlLnWjeUenEwe2',
        email: 'marcoant008@gmail.com',
    }
    const { msg } = props;
    const [selected, setSelected] = useState(false);
    const isAutor = usuario.id === msg.idRemetente;
    
    function toDateTime(secs) {
        let t = new Date(Date.UTC(1970, 0, 1)); // Epoch
        t.setUTCSeconds(secs);
        return t;
    }

    return <TouchableOpacity
                style={styles.container}
                activeOpacity={0.8}
                onPress={() => setSelected(!selected)}
            >
        <View style={[styles.balao, isAutor ? { borderBottomEndRadius: 0, backgroundColor: '#fff' } :  { borderBottomStartRadius: 0 }]}>
            <Text style={styles.mensagem}>{msg.conteudo} <Text></Text></Text>
        </View>
        { selected && <Text style={[styles.time, isAutor && { alignSelf: 'flex-end' }]}>{toDateTime(msg.createdAt.seconds).toString()}<Text></Text></Text> }
    </TouchableOpacity>
}

export default Mensagem;