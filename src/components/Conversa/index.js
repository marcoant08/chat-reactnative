import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AuthContext } from '../../contexts/auth';
import firebase from '../../services/firebase'
import styles from './styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, {
    Image as SvgImage,
    Defs,
    ClipPath,
    Polygon,
} from 'react-native-svg';

function Conversa (props) {
    const navigation = useNavigation();
    //const [destinatarios, setDestinatarios] = useState([]);
    const [destinatario, setDestinatario] = useState({});
    const [mensagens, setMensagens] = useState({});
    const { conv } = props;
    const { usuario } = useContext(AuthContext);

    useEffect(() => {
        async function load() {
            await firebase
                .firestore()
                .collection("usuarios")
                .doc(conv.idConversa.replace(usuario.id, ''))
                .get()
                .then((snapshot) => {
                    setDestinatario(snapshot.data());
                    //console.log(snapshot.data())
                })
                .catch((err) => {
                    ToastAndroid.show("Erro ao obter mensagens.", ToastAndroid.SHORT);
                });
        }
        //console.log(conv.idConversa.replace(usuario.id, ''), usuario.id)
        load();
    }, [])

    useEffect(() => {
        console.log('aa');
        async function load() {
            await firebase
                .firestore()
                .collection("mensagens")
                .where("idConversa", "==", conv.idConversa)
                //.orderBy('createdAt','desc')
                //.limit(1)
                .onSnapshot((querySnapshot) => {
                    let aux = [];

                    querySnapshot.forEach((documentSnapshot) => {
                        aux.push({ id: documentSnapshot.id, ...documentSnapshot.data() });
                    });

                    aux.sort(function (a, b) {
                        if (a.ordem > b.ordem) {
                            return 1;
                        }
                        if (a.ordem < b.ordem) {
                            return -1;
                        }
                        // a must be equal to b
                        return 0;
                    });

                    setMensagens(aux);
                })
                .catch((err) => {
                    ToastAndroid.show("Erro ao obter mensagens.", ToastAndroid.SHORT);
                });
        }

        load();
    }, []);

    function toDateTime() {
    //function toDateTime(secs) {
        /* let t = new Date(Date.UTC(1970, 0, 1)); // Epoch
        t.setUTCSeconds(secs); */

        /* let dia = t.getDate();
        let mes = t.getMonth() + 1;
        let ano = t.getFullYear();
        let hora = t.getHours();
        let minutos = t.getMinutes(); */


        let dia = Number(conv.ordem.substring(8, 10));
        let mes = Number(conv.ordem.substring(5, 7));
        let ano = Number(conv.ordem.substring(0, 4));
        let hora = Number(conv.ordem.substring(10, 12));
        let minutos = Number(conv.ordem.substring(13, 14));

        const now = new Date();
        let nowdia = now.getDate();
        let nowmes = now.getMonth() + 1;
        let nowano = now.getFullYear();
        let nowhora = now.getHours();
        let nowminutos = now.getMinutes();

        if (dia<10) dia = "0".concat(dia);
        if (mes<10) mes = "0".concat(mes);
        if (hora<10) hora = "0".concat(hora);
        if (minutos<10) minutos = "0".concat(minutos);
        
        if (nowdia<10) nowdia = "0".concat(nowdia);
        if (nowmes<10) nowmes = "0".concat(nowmes);
        if (nowhora<10) nowhora = "0".concat(nowhora);
        if (nowminutos<10) nowminutos = "0".concat(nowminutos);

        const data = `${dia}/${mes}/${ano}`;
        const nowdata = `${nowdia}/${nowmes}/${nowano}`;

        const horario = `${hora}:${minutos}`;
        const nowhorario = `${nowhora}:${nowminutos}`;

        console.log(data, nowdata)
        console.log(horario, nowhorario)

        //return `${horario}`

        if (data === nowdata && nowhora === hora && nowminutos - minutos <= 2) { return 'Agora' }
        if (data === nowdata && nowhora === hora && nowminutos - minutos >= 2 && nowminutos - minutos <= 59) { return `${nowminutos - minutos}m` }
        if (data === nowdata && nowhora - hora <= 12) { return `${nowhora - hora}h` }
        if (data === nowdata && nowhora - hora > 12) { return horario }
        if (data !== nowdata && nowano === ano && mes === nowmes && nowdia - dia === 1) { return "Ontem" }
        if (nowano === ano && mes === nowmes && nowdia - dia <= 15) { return `${nowdia - dia}d` }
        if (nowano === ano && mes !== nowmes) { return `${dia}/${mes}` }

        return data;
    }

    return <TouchableOpacity style={styles.container} onPress={() => navigation.navigate('Chat', { idUser: conv.idConversa.replace(usuario.id, '') })}>
        <View style={styles.containerFotoMensagem}>
            <Image style={styles.avatar} source={{ uri: destinatario?.avatar }} />
            {/* <Svg style={styles.avatar} width="75" height="75" viewBox="0 0 50 50">
                <Defs>
                    <ClipPath id="image" clipRule="evenodd">
                        <Polygon points="0 10, 22.5 0, 45 10, 45 40, 22.5 50, 0 40" />
                    </ClipPath>
                </Defs>
                <SvgImage
                    x="0"
                    y="0"
                    width="50"
                    height="50"
                    href={destinatario.avatar}
                    clipPath="#image"
                />
            </Svg> */}
            <View>
                <View style={styles.containerInfos}>
                    <Text style={styles.name}>{destinatario?.nome}</Text>
                </View>
                <Text style={styles.preview} numberOfLines={1}>{mensagens[mensagens.length-1]?.conteudo}</Text>
            </View>
        </View>
        <View style={styles.containerHoraIcon}>
            { mensagens.length > 0 && <Text style={styles.time}>• {toDateTime()}</Text> }
            <MaterialCommunityIcons name='message-outline' size={30} color='#999' />
        </View>
    </TouchableOpacity>
}

export default Conversa;