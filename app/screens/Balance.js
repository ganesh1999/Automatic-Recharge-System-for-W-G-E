import React, { Component } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View, Text,
    ImageBackground, Modal, TouchableHighlight, ActivityIndicator, Alert
} from 'react-native';
import firebase from 'react-native-firebase';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import Loading from './Loading'
import { Value } from 'react-native-reanimated';


class Balance extends Component {

    constructor(props) {
        super(props)

        this.state = {
            currentelectricitybalance: '',
            currentgasbalance: '',
            currentwaterbalance: '',
            hasgas: '',
            haswater: '',
            haselectricity: '',
            modalVisible: false,
            electricityrechargemodalVisible: false,
            waterrechargemodalVisible: false,
            gasrechargemodalVisible: false,
            temprechargevariable: "",
            pastelectricitybalance: '',
            pastwaterbalance: '',
            pastgasbalance: '',
            tempstate: false,
            iscompleted: '',
            showactivity: false,



        }

        this.logout = this.logout.bind(this);
        this.setloadingmodalvisible = this.setloadingmodalvisible.bind(this);
        this.getgasconnection = this.getgasconnection.bind(this);
        this.getwaterconnection = this.getwaterconnection.bind(this);
        this.getelectricityconnection = this.getelectricityconnection.bind(this);
        this.checkupdatestatus = this.checkupdatestatus.bind(this);
        this.setelectricityrechargeModalVisible = this.setelectricityrechargeModalVisible.bind(this);
        this.rechargegas = this.rechargegas.bind(this);
        this.rechargewater = this.rechargewater.bind(this);
        this.rechargeelectricity = this.rechargeelectricity.bind(this);
        this.getrechargeamount = this.getrechargeamount.bind(this);
        this.showactivity = this.showactivity.bind(this);


    }

    async componentDidMount() {

        var user = firebase.auth().currentUser.uid;

        await firebase.database().ref('users/' + user).once('value', (data) => {
            var info = data.toJSON();

            this.setState({
                currentelectricitybalance: info.currentelectricitybalance,
                currentgasbalance: info.currentgasbalance,
                currentwaterbalance: info.currentwaterbalance,
                haselectricity: info.haselectricity,
                haswater: info.haswater,
                hasgas: info.hasgas
            })
        }).catch(() => {
            Alert.alert(
                'Failed !',
                'Could not fetch user data Try again ! ',
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
    async componentWillUpdate() {
        var user = firebase.auth().currentUser.uid;
        await firebase.database().ref('users/' + user).once('value', (data) => {
            var info = data.toJSON();
            this.setState({
                currentelectricitybalance: info.currentelectricitybalance,
                currentgasbalance: info.currentgasbalance,
                currentwaterbalance: info.currentwaterbalance,
                haselectricity: info.haselectricity,
                haswater: info.haswater,
                hasgas: info.hasgas
            })
        }).catch(() => {
            Alert.alert(
                'Failed !',
                'Could not fetch user data Try again ! ',
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

    showactivity(visible) {
        this.setState({
            showactivity: visible
        })
    }

    getgasconnection() {
        var user = firebase.auth().currentUser.uid;
        firebase.database().ref('users/' + user).update({
            hasgas: true
        });
        this.showactivity(true);
        setTimeout(() => { this.showactivity(false) }, 1500);
        this.checkupdatestatus();
    }

    getwaterconnection() {
        var user = firebase.auth().currentUser.uid;
        firebase.database().ref('users/' + user).update({
            haswater: true
        });
        this.showactivity(true);
        setTimeout(() => { this.showactivity(false) }, 1500);
        this.checkupdatestatus();
    }

    getelectricityconnection() {
        var user = firebase.auth().currentUser.uid;
        firebase.database().ref('users/' + user).update({
            haselectricity: true
        });
        this.showactivity(true);
        setTimeout(() => { this.showactivity(false) }, 1500);
        this.checkupdatestatus();
    }

    async rechargeelectricity() {
        var user = firebase.auth().currentUser.uid;
        if (this.state.temprechargevariable == 0) {
            Alert.alert(
                'Warning !',
                'Please Fill some amount in reacharge box',
                [
                    {
                        text: 'OK'
                    },
                ],
                { cancelable: false },
            );

        } else {
            this.setelectricityrechargeModalVisible(false);
            this.showactivity(true);
            setTimeout(() => { this.showactivity(false) }, 1500);
            await firebase.database().ref('users/' + user).once('value', (data) => {
                var info = data.toJSON();
                this.setState({
                    pastelectricitybalance: info.currentelectricitybalance,
                })
            }).then(async () => {
                let x = parseInt(this.state.pastelectricitybalance) + parseInt(this.state.temprechargevariable);

                await firebase.database().ref('users/' + user).update({
                    currentelectricitybalance: x
                }).then(async () => {
                    await firebase.database().ref('users/' + user).once('value', (data) => {
                        var info = data.toJSON();
                        this.setState({
                            currentelectricitybalance: info.currentelectricitybalance,
                        })
                    }).then(() => {
                        this.setState({
                            temprechargevariable: 0
                        })
                    })
                })


            }).catch(() => {
                Alert.alert(
                    'Recharge Failed !',
                    'User is not logged in , Try again ! ',
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


    }

    async rechargewater() {
        var user = firebase.auth().currentUser.uid;
        if (this.state.temprechargevariable == 0) {
            Alert.alert(
                'Warning !',
                'Please Fill some amount in reacharge box',
                [
                    {
                        text: 'OK'
                    },
                ],
                { cancelable: false },
            );

        } else {
            this.setwaterrechargeModalVisible(false);
            this.showactivity(true);
            setTimeout(() => { this.showactivity(false) }, 1500);
            await firebase.database().ref('users/' + user).once('value', (data) => {
                var info = data.toJSON();

                this.setState({
                    pastwaterbalance: info.currentwaterbalance,
                })
            }).then(async () => {
                let x = parseInt(this.state.pastwaterbalance) + parseInt(this.state.temprechargevariable);

                await firebase.database().ref('users/' + user).update({
                    currentwaterbalance: x
                }).then(async () => {
                    await firebase.database().ref('users/' + user).once('value', (data) => {
                        var info = data.toJSON();

                        this.setState({
                            currentwaterbalance: info.currentwaterbalance,
                        })
                    }).then(() => {
                        this.setState({
                            temprechargevariable: 0
                        })
                    })
                })


            }).catch(() => {
                Alert.alert(
                    'Recharge Failed !',
                    'User is not logged in , Try again ! ',
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


    }


    async rechargegas() {
        var user = firebase.auth().currentUser.uid;
        if (this.state.temprechargevariable == 0) {
            Alert.alert(
                'Warning !',
                'Please Fill some amount in reacharge box',
                [
                    {
                        text: 'OK'
                    },
                ],
                { cancelable: false },
            );

        } else {
            this.setgasrechargeModalVisible(false);
            this.showactivity(true);
            setTimeout(() => { this.showactivity(false) }, 1500);
            await firebase.database().ref('users/' + user).once('value', (data) => {
                var info = data.toJSON();

                this.setState({
                    pastgasbalance: info.currentgasbalance,
                })
            }).then(async () => {
                let x = parseInt(this.state.pastgasbalance) + parseInt(this.state.temprechargevariable);

                await firebase.database().ref('users/' + user).update({
                    currentgasbalance: x
                }).then(async () => {
                    await firebase.database().ref('users/' + user).once('value', (data) => {
                        var info = data.toJSON();

                        this.setState({
                            currentgasbalance: info.currentgasbalance,
                        })
                    }).then(() => {
                        this.setState({
                            temprechargevariable: 0
                        })
                    })
                })


            }).catch(() => {
                Alert.alert(
                    'Recharge Failed !',
                    'User is not logged in , Try again ! ',
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


    }



    getrechargeamount(evt) {
        this.setState({
            temprechargevariable: evt
        });
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
    setloadingmodalvisible(visible) {
        this.setState({ modalVisible: visible });

    }
    setelectricityrechargeModalVisible(visible) {
        this.setState({ electricityrechargemodalVisible: visible });

    }

    setwaterrechargeModalVisible(visible) {
        this.setState({ waterrechargemodalVisible: visible });

    }

    setgasrechargeModalVisible(visible) {
        this.setState({ gasrechargemodalVisible: visible });

    }

    async checkupdatestatus() {

        var user = firebase.auth().currentUser.uid;


        await firebase.database().ref('users/' + user).once('value', (data) => {
            var info = data.toJSON();

            this.setState({
                currentelectricitybalance: info.currentelectricitybalance,
                currentgasbalance: info.currentgasbalance,
                currentwaterbalance: info.currentwaterbalance,
                haselectricity: info.haselectricity,
                haswater: info.haswater,
                hasgas: info.hasgas
            })
        }).catch(() => {
            Alert.alert(
                'Failed !',
                'Could not fetch user data Try again ! ',
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



    render() {
        if (this.state.showactivity) {
            return (<Loading />)
        } else {

            return (
                <ImageBackground source={require('../assets/126388.jpg')} style={styles.container}>
                    <View style={styles.container}>


                        <ScrollView>

                            {/* Header */}

                            <View style={styles.header}>
                                <Text style={styles.connectionid}>Connection ID : 123456789 </Text>
                                <TouchableOpacity style={styles.signoutbutton} onPress={this.logout}>
                                    <Text style={styles.signouttext}>Sign Out</Text>
                                </TouchableOpacity>

                            </View>


                            {/* Recharge Section */}

                            {/* Water */}


                            <Text style={{
                                fontSize: 20, color: 'black', padding: 4, marginLeft: 8,
                                marginTop: 8, fontWeight: 'bold'
                            }}>Current Balance:</Text>
                            <View style={styles.Horizontalline}></View>

                            <View style={styles.balance}>
                                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Water:</Text>

                                {this.state.haswater ?
                                    (<View><Text style={{ textAlign: 'center', fontWeight: 'bold', marginTop: 20, fontSize: 40 }}>
                                        <Icon name='rupee' size={35} />{this.state.currentwaterbalance}</Text>
                                        <TouchableOpacity style={{ padding: 2, alignSelf: 'center', marginTop: 28 }}>
                                            <Text style={{
                                                color: 'white', backgroundColor: '#1e90ff', borderRadius: 8, fontSize: 16,
                                                padding: 5, textDecorationLine: 'underline'
                                            }} onPress={() => { this.setwaterrechargeModalVisible(true); }}>Recharge</Text>
                                        </TouchableOpacity></View>)
                                    : (<TouchableOpacity style={{ alignSelf: 'center', marginTop: 22 }} onPress={this.getwaterconnection}>
                                        <Text style={{
                                            fontSize: 25, textAlign: 'center', marginHorizontal: 40, textDecorationLine: 'underline',
                                            fontWeight: 'bold'
                                        }}>Get Connection</Text>
                                    </TouchableOpacity>)}


                            </View>


                            {/* Gas */}


                            <View style={styles.balance}>
                                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Gas:</Text>
                                {this.state.hasgas ? (<View><Text style={{
                                    textAlign: 'center', fontWeight: 'bold',
                                    marginTop: 20, fontSize: 40
                                }}><Icon name='rupee' size={35} />{this.state.currentgasbalance}</Text>
                                    <TouchableOpacity style={{ padding: 2, alignSelf: 'center', marginTop: 28 }}>
                                        <Text style={{
                                            color: 'white', backgroundColor: '#1e90ff', borderRadius: 8,
                                            fontSize: 16, padding: 5, textDecorationLine: 'underline'
                                        }} onPress={() => { this.setgasrechargeModalVisible(true); }}>Recharge</Text>
                                    </TouchableOpacity></View>) : (<TouchableOpacity style={{
                                        alignSelf: 'center',
                                        marginTop: 22
                                    }} onPress={this.getgasconnection}>
                                        <Text style={{
                                            fontSize: 25, textAlign: 'center', marginHorizontal: 40,
                                            textDecorationLine: 'underline', fontWeight: 'bold'
                                        }}>Get Connection</Text>
                                    </TouchableOpacity>)}

                            </View>


                            {/* Electricity */}



                            <View style={styles.balance}>
                                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Electricity:</Text>
                                {this.state.haselectricity ? (<View><Text style={{
                                    textAlign: 'center', fontWeight: 'bold', marginTop: 20,
                                    fontSize: 40
                                }}><Icon name='rupee' size={35} />{this.state.currentelectricitybalance}</Text>
                                    <TouchableOpacity style={{ padding: 2, alignSelf: 'center', marginTop: 28 }}>
                                        <Text style={{
                                            color: 'white', backgroundColor: '#1e90ff', borderRadius: 8, fontSize: 16,
                                            padding: 5, textDecorationLine: 'underline'
                                        }} onPress={() => { this.setelectricityrechargeModalVisible(true); }}>Recharge</Text>
                                    </TouchableOpacity></View>) : (<TouchableOpacity style={{ alignSelf: 'center', marginTop: 22 }}
                                        onPress={this.getelectricityconnection}>
                                        <Text style={{
                                            fontSize: 25, textAlign: 'center', marginHorizontal: 40, textDecorationLine: 'underline',
                                            fontWeight: 'bold'
                                        }}>Get Connection</Text>
                                    </TouchableOpacity>)}

                            </View>


                        </ScrollView>

                    </View>


                    {/*   Loading Modal */}


                    <Modal animationType="slide" visible={this.state.modalVisible} transparent={true}>
                        <View style={styles.loading}>
                            <View>
                                <Text style={{ alignSelf: 'center', fontSize: 25 }}>Loading.....</Text>
                            </View>
                        </View>
                    </Modal>

                    {/* Electricity Modal  */}

                    <Modal animationType="slide" visible={this.state.electricityrechargemodalVisible} transparent={true}>
                        <View style={styles.editprofile}>
                            <View>
                                <TextInput keyboardType='numeric' placeholder="$00" placeholderTextColor="#696969" style={{
                                    borderColor: '#1e90ff',
                                    borderWidth: 2, textAlign: 'center', backgroundColor: 'white', padding: 8,
                                    borderRadius: 20,
                                    marginHorizontal: 60
                                }} onChangeText={this.getrechargeamount}></TextInput>
                            </View>
                            <TouchableHighlight
                                onPress={() => {
                                    this.rechargeelectricity();
                                }}>
                                <Text style={{
                                    color: 'white', alignSelf: 'flex-end',
                                    fontSize: 18,
                                    textDecorationLine: 'underline', backgroundColor: '#1e90ff', borderColor: 'white',
                                    borderRadius: 15, padding: 4, marginVertical: 4, marginEnd: 70
                                }}>Recharge</Text>
                            </TouchableHighlight>
                            <TouchableHighlight
                                onPress={() => {
                                    this.setelectricityrechargeModalVisible(false);
                                }}>
                                <Text style={{
                                    color: 'white', alignSelf: 'flex-end',
                                    fontSize: 18,
                                    textDecorationLine: 'underline',
                                    borderRadius: 15, color: '#1e90ff'
                                }}>Close</Text>
                            </TouchableHighlight>
                        </View>
                    </Modal>


                    {/* Water Modal  */}

                    <Modal animationType="slide" visible={this.state.waterrechargemodalVisible} transparent={true}>
                        <View style={styles.editprofile}>
                            <View>
                                <TextInput keyboardType='numeric' placeholder="$00" placeholderTextColor="#696969" style={{
                                    borderColor: '#1e90ff',
                                    borderWidth: 2, textAlign: 'center', backgroundColor: 'white', padding: 8,
                                    borderRadius: 20,
                                    marginHorizontal: 60
                                }} onChangeText={this.getrechargeamount}></TextInput>
                            </View>
                            <TouchableHighlight
                                onPress={() => {
                                    this.rechargewater();
                                }}>
                                <Text style={{
                                    color: 'white', alignSelf: 'flex-end',
                                    fontSize: 18,
                                    textDecorationLine: 'underline', backgroundColor: '#1e90ff', borderColor: 'white',
                                    borderRadius: 15, padding: 4, marginVertical: 4, marginEnd: 70
                                }}>Recharge</Text>
                            </TouchableHighlight>
                            <TouchableHighlight
                                onPress={() => {
                                    this.setwaterrechargeModalVisible(false);
                                }}>
                                <Text style={{
                                    color: 'white', alignSelf: 'flex-end',
                                    fontSize: 18,
                                    textDecorationLine: 'underline',
                                    borderRadius: 15, color: '#1e90ff'
                                }}>Close</Text>
                            </TouchableHighlight>
                        </View>
                    </Modal>


                    {/* Gas Modal  */}

                    <Modal animationType="slide" visible={this.state.gasrechargemodalVisible} transparent={true}>
                        <View style={styles.editprofile}>
                            <View>
                                <TextInput keyboardType='numeric' placeholder="$00" placeholderTextColor="#696969" style={{
                                    borderColor: '#1e90ff',
                                    borderWidth: 2, textAlign: 'center', backgroundColor: 'white', padding: 8,
                                    borderRadius: 20,
                                    marginHorizontal: 60
                                }} onChangeText={this.getrechargeamount}></TextInput>
                            </View>
                            <TouchableHighlight
                                onPress={() => {
                                    this.rechargegas();
                                }}>
                                <Text style={{
                                    color: 'white', alignSelf: 'flex-end',
                                    fontSize: 18,
                                    textDecorationLine: 'underline', backgroundColor: '#1e90ff', borderColor: 'white',
                                    borderRadius: 15, padding: 4, marginVertical: 4, marginEnd: 70
                                }}>Recharge</Text>
                            </TouchableHighlight>
                            <TouchableHighlight
                                onPress={() => {
                                    this.setgasrechargeModalVisible(false);
                                }}>
                                <Text style={{
                                    color: 'white', alignSelf: 'flex-end',
                                    fontSize: 18,
                                    textDecorationLine: 'underline',
                                    borderRadius: 15, color: '#1e90ff'
                                }}>Close</Text>
                            </TouchableHighlight>
                        </View>
                    </Modal>

                </ImageBackground>

            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
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
    Horizontalline: {
        borderWidth: 1,
        borderColor: "#1e90ff",
        marginLeft: 15,
        marginRight: 15,
        marginTop: 1,
        marginBottom: 10
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
    balance: {
        padding: 20,
        height: 190,
        width: 260,
        backgroundColor: '#e0ffff',
        margin: 8,
        borderRadius: 15,
        alignSelf: 'center',
        borderColor: '#1e90ff', borderWidth: 1.5,
        opacity: 0.8
    },
    loading: {
        flex: 1,
        padding: 18,
        marginHorizontal: 60,
        marginVertical: 280,
        backgroundColor: 'white',
        borderRadius: 18,
        borderWidth: 2,
        borderColor: '#1e90ff',

    },
    editprofile: {
        padding: 18,
        marginHorizontal: 60,
        marginBottom: 400,
        marginTop: 50,
        backgroundColor: '#e0ffff',
        borderRadius: 18,
        borderWidth: 2,
        borderColor: '#1e90ff',

    },


});

export default Balance;