import React, { Component } from 'react'
import {
    StyleSheet,
    View, Text,
    TouchableOpacity,
    ImageBackground,
    Modal,
    TouchableHighlight, Alert
} from 'react-native'
import firebase from 'react-native-firebase';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome'
import Icon2 from 'react-native-vector-icons/Entypo'
import Loading from './Loading'

class Userprofile extends Component {
    constructor() {
        super()
        this.state = {
            name: '',
            address: '',
            mobile: '',
            email: '',
            pickervalue: '',
            modalVisible: false,
            showactivity: false

        }

        this.setModalVisible = this.setModalVisible.bind(this);
        this.logout = this.logout.bind(this);
    }

    async componentDidMount() {
        var user = firebase.auth().currentUser.uid;
        console.log("this is user", 'users/' + user);

        await firebase.database().ref('users/' + user).once('value', (data) => {
            var info = data.toJSON();
            console.log("this is info:", info);
            this.setState({
                name: info.name,
                address: info.address,
                mobile: info.mobile,
                email: firebase.auth().currentUser.email,
                pickervalue: info.pickervalue
            })
        }).catch(() => {
            Alert.alert(
                'Failed !',
                'Could not fetch user details , Try again ! ',
                [
                    {
                        text: 'OK', onPress: () => {
                            firebase.auth().signOut()
                                .then(() => { this.props.navigation.navigate('Login') })
                        }
                    },
                ],
                { cancelable: false },
            );
        })

    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }
    showactivity(visible) {
        this.setState({
            showactivity: visible
        })
    }
    logout() {
        this.showactivity(true);
        setTimeout(() => { this.showactivity(false) }, 500);
        firebase.auth().signOut().then(res => {
            Alert.alert(
                'Success !',
                'Log in again to access information .. ',
                [
                    {
                        text: 'OK', onPress: () => { this.props.navigation.navigate('Login') }
                    },
                ],
                { cancelable: false },
            );

        })

    }


    render() {
        if (this.state.showactivity) {
            return (<Loading />)
        } else {
            return (
                <ImageBackground source={require('../assets/126388.jpg')} style={styles.container}>
                    <ScrollView style={styles.container}>

                        <View style={styles.header}>
                            <Text style={styles.connectionid}>Connection ID : 123456789 </Text>
                            <TouchableOpacity style={styles.signoutbutton} onPress={this.logout}>
                                <Text style={styles.signouttext}>Sign Out</Text>
                            </TouchableOpacity>

                        </View>

                        <Text style={{ fontSize: 20, color: 'black', padding: 4, marginLeft: 8, marginTop: 8, fontWeight: 'bold' }}>User Section:</Text>
                        <View style={styles.Horizontalline}></View>
                        <View style={styles.userinfo}>

                            <View>
                                <Text style={{ fontSize: 18, marginLeft: 18, marginTop: 12, fontWeight: 'bold' }}>Name : </Text>
                                <View style={styles.Horizontalline2}></View>
                                <Text style={{
                                    fontSize: 18, marginLeft: 18, backgroundColor: 'white',
                                    marginRight: 18, padding: 8, borderRadius: 8
                                }}>{this.state.name}</Text>
                                <Text style={{ fontSize: 18, marginLeft: 18, marginTop: 16, fontWeight: 'bold' }}>Address : </Text>
                                <View style={styles.Horizontalline2}></View>
                                <Text style={{
                                    fontSize: 18, marginLeft: 18, backgroundColor: 'white',
                                    marginRight: 18, padding: 8, borderRadius: 8
                                }}>{this.state.address}</Text>
                                <Text style={{ fontSize: 18, marginLeft: 18, marginTop: 16, fontWeight: 'bold' }}>Email : </Text>
                                <View style={styles.Horizontalline2}></View>
                                <Text style={{
                                    fontSize: 18, marginLeft: 18, backgroundColor: 'white',
                                    marginRight: 18, padding: 8, borderRadius: 8
                                }}>{this.state.email}</Text>
                                <Text style={{ fontSize: 18, marginLeft: 18, marginTop: 16, fontWeight: 'bold' }}>Contact No : </Text>
                                <View style={styles.Horizontalline2}></View>
                                <Text style={{
                                    fontSize: 18, marginLeft: 18, backgroundColor: 'white',
                                    marginRight: 18, padding: 8, borderRadius: 8
                                }}>{this.state.mobile}</Text>
                                <Text style={{ fontSize: 18, marginLeft: 18, marginTop: 16, fontWeight: 'bold' }}>Section : </Text>
                                <View style={styles.Horizontalline2}></View>
                                <Text style={{
                                    fontSize: 18, marginLeft: 18, marginBottom: 16, backgroundColor: 'white',
                                    marginRight: 18, padding: 8, borderRadius: 8
                                }}>{this.state.pickervalue}</Text>
                            </View>

                        </View>

                        <Modal animationType="slide" transparent={false} visible={this.state.modalVisible} transparent={true}>
                            <View style={styles.editprofile}>
                                <View>
                                    <Icon name='phone-square' size={40} style={{ alignSelf: 'center' }} color='#1e90ff' />
                                    <Text style={{ alignSelf: 'center', fontSize: 25, marginTop: 8 }}>+918788388038</Text>
                                    <Icon2 name='mail' size={40} style={{ alignSelf: 'center', marginTop: 16 }} color='#1e90ff' />
                                    <Text style={{ alignSelf: 'center', fontSize: 20, marginTop: 8 }}>blockmatrix@gmail.com</Text>

                                    <TouchableHighlight
                                        onPress={() => {
                                            this.setModalVisible(false);
                                        }}>
                                        <Text style={{
                                            color: '#1e90ff', alignSelf: 'flex-end',
                                            fontSize: 18,
                                            textDecorationLine: 'underline', marginTop: 12
                                        }}>Close</Text>
                                    </TouchableHighlight>
                                </View>
                            </View>
                        </Modal>

                        <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => {
                            this.setModalVisible(true);
                        }}>
                            <Text style={{
                                color: 'white', backgroundColor: '#1e90ff', padding: 16,
                                borderRadius: 8, marginVertical: 16
                            }}>Contact Us</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </ImageBackground>
            );
        }
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 23,
        marginTop: 8,
        backgroundColor: '#1e90ff',
        marginHorizontal: 4,
        marginVertical: 4,
        borderRadius: 15,
        flexDirection: 'row'
    },
    connectionid: {
        fontSize: 18,
        color: 'white'
    },
    signoutbutton: {
        marginLeft: 58,

    },
    signouttext: {
        textDecorationLine: 'underline',
        color: 'white'

    },
    Horizontalline: {
        borderWidth: 1,
        borderColor: "#1e90ff",
        marginLeft: 15,
        marginRight: 15,
        marginTop: 1,
        marginBottom: 10
    },
    Horizontalline2: {
        borderWidth: 1,
        borderColor: "#1e90ff",
        marginLeft: 15,
        marginRight: 15,
        marginTop: 1,
        marginBottom: 10
    },

    userinfo: {
        backgroundColor: '#add8e6',
        margin: 8,
        borderRadius: 15,
        opacity: 0.8,
    },
    editprofile: {
        flex: 1,
        padding: 18,
        marginHorizontal: 60,
        marginVertical: 280,
        backgroundColor: 'white',
        borderRadius: 18,
        borderWidth: 2,
        borderColor: '#1e90ff',
        backgroundColor: '#e0ffff'

    },

});


export default Userprofile;










