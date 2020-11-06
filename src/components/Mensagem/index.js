import React, { useContext, useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../contexts/auth';
import styles from './styles';

function Mensagem (props) {
    const { usuario } = useContext(AuthContext);
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
        <View style={[styles.balao, isAutor ? { borderBottomEndRadius: 0, backgroundColor: '#021740' } :  { borderBottomStartRadius: 0 }]}>
            <Text style={[styles.mensagem, { color: isAutor ? '#fff' : '#222' }]}>{msg.conteudo} <Text></Text></Text>
        </View>
        { selected && <Text style={[styles.time, isAutor && { alignSelf: 'flex-end' }]}>{toDateTime(msg.createdAt.seconds).toString()}<Text></Text></Text> }
    </TouchableOpacity>
}

export default Mensagem;