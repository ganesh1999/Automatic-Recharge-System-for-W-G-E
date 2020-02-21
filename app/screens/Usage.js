import React, { Component } from 'react'
import { StyleSheet, View, Text, ImageBackground, ScrollView, TouchableOpacity, Alert } from 'react-native';
import firebase from 'react-native-firebase'
import Loading from './Loading'


class Usage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showactivity: false,
            haselectricity: '',
            hasgas: '',
            haswater: '',
            electricityusage: '',
            waterusage: '',
            gasusage: '',
            bulbstatus: '',
            motorstatus: '',
            electricitybalance: '',
            waterbalance: '',
        }

        this.resetgasusage = this.resetgasusage.bind(this);
        this.logout = this.logout.bind(this);
        this.onbulb = this.onbulb.bind(this);
        this.offbulb = this.offbulb.bind(this);
        this.onmotor = this.onmotor.bind(this);
        this.offmotor = this.offmotor.bind(this);
    }

    async componentDidMount() {
        var user = firebase.auth().currentUser.uid;
        await firebase.database().ref('users/' + user).once('value', (data) => {
            var info = data.toJSON();
            this.setState({
                hasgas: info.hasgas,
                haselectricity: info.haselectricity,
                haswater: info.haswater,
                electricityusage: info.electricityusage,
                waterusage: info.waterusage,
                gasusage: info.gasusage,
                bulbstatus: info.bulbstatus,
                electricitybalance: info.currentelectricitybalance,
                waterbalance: info.currentwaterbalance,
                motorstatus: info.motorstatus

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
                electricityusage: info.electricityusage,
                waterusage: info.waterusage,
                gasusage: info.gasusage,
                bulbstatus: info.bulbstatus,
                electricitybalance: info.currentelectricitybalance,
                waterbalance: info.currentwaterbalance,
                motorstatus: info.motorstatus
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
    showactivity(visible) {
        this.setState({
            showactivity: visible
        })
    }


    resetgasusage() {
        var user = firebase.auth().currentUser.uid;
        firebase.database().ref('users/' + user).update({
            gasusage: 0
        }).then(() => {
            this.setState({
                gasusage: 0
            })
        })
    }
    onbulb() {
        console.log("electricity balance is", this.state.electricitybalance);
        if (this.state.electricitybalance <= 0) {
            Alert.alert(
                'Alert !',
                'Balance is not sufficient ! ',
                [
                    {
                        text: 'OK'
                    },
                ],
                { cancelable: false },
            );
        }
        if (this.state.electricitybalance > 0) {
            var user = firebase.auth().currentUser.uid;
            firebase.database().ref('users/' + user).update({
                bulbstatus: true
            }).then(() => {


                this.setState({
                    bulbstatus: true
                })


            })
        }

    }
    offbulb() {
        var user = firebase.auth().currentUser.uid;
        firebase.database().ref('users/' + user).update({
            bulbstatus: false
        }).then(() => {
            this.setState({
                bulbstatus: false
            })
        })
    }
    onmotor() {
        console.log("water balance is", this.state.waterbalance);
        if (this.state.waterbalance <= 0) {
            Alert.alert(
                'Alert !',
                'Balance is not sufficient ! ',
                [
                    {
                        text: 'OK'
                    },
                ],
                { cancelable: false },
            );
        }
        if (this.state.waterbalance > 0) {
            var user = firebase.auth().currentUser.uid;
            firebase.database().ref('users/' + user).update({
                motorstatus: true
            }).then(() => {


                this.setState({
                    motorstatus: true
                })


            })
        }
    }
    offmotor() {
        var user = firebase.auth().currentUser.uid;
        firebase.database().ref('users/' + user).update({
            motorstatus: false
        }).then(() => {
            this.setState({
                motorstatus: false
            })
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


                            {/* Usage Section */}

                            {/* Water */}


                            <Text style={{
                                fontSize: 20, color: 'black', padding: 4, marginLeft: 8,
                                marginTop: 8, fontWeight: 'bold'
                            }}>Usage:</Text>
                            <View style={styles.Horizontalline}></View>

                            <View style={styles.balance}>
                                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Water(liters):</Text>

                                {this.state.haswater ?
                                    (<View><Text style={{ textAlign: 'center', fontWeight: 'bold', marginTop: 20, fontSize: 40 }}>
                                        {this.state.waterusage}</Text>
                                        <View style={{ flexDirection: 'row' }}>
                                            {this.state.motorstatus ? (<TouchableOpacity style={{ padding: 2, alignSelf: 'flex-start', marginTop: 28 }}>
                                                <Text style={{
                                                    color: 'white', backgroundColor: '#1e90ff', borderRadius: 8, fontSize: 16,
                                                    padding: 5, textDecorationLine: 'underline'
                                                }} onPress={() => { this.offmotor() }}>OFF</Text>
                                            </TouchableOpacity>) : (<TouchableOpacity style={{ padding: 2, alignSelf: 'flex-start', marginTop: 28 }}>
                                                <Text style={{
                                                    color: 'white', backgroundColor: '#1e90ff', borderRadius: 8, fontSize: 16,
                                                    padding: 5, textDecorationLine: 'underline'
                                                }} onPress={() => { this.onmotor() }}>ON</Text>
                                            </TouchableOpacity>)}<Text style={{
                                                padding: 2, alignSelf: 'flex-end', marginTop: 28,
                                                fontSize: 16, marginBottom: 5, marginLeft: 8
                                            }}>current status :{this.state.motorstatus ? (<Text>ON</Text>) : (<Text>OFF</Text>)}</Text></View>
                                    </View>)
                                    : (
                                        <Text style={{
                                            fontSize: 25, textAlign: 'center', marginHorizontal: 40, textDecorationLine: 'underline',
                                            fontWeight: 'bold', marginTop: 35
                                        }}>NO DATA</Text>
                                    )}


                            </View>


                            {/* Gas */}


                            <View style={styles.balance}>
                                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Gas:</Text>
                                {this.state.hasgas ? (<View><Text style={{
                                    textAlign: 'center', fontWeight: 'bold',
                                    marginTop: 20, fontSize: 40
                                }}>{this.state.gasusage}</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <TouchableOpacity style={{ padding: 2, alignSelf: 'flex-start', marginTop: 28 }}>
                                            <Text style={{
                                                color: 'white', backgroundColor: '#1e90ff', borderRadius: 8, fontSize: 16,
                                                padding: 5, textDecorationLine: 'underline'
                                            }} onPress={() => { this.resetgasusage() }}>Reset</Text>
                                        </TouchableOpacity><Text style={{
                                            padding: 2, alignSelf: 'flex-end', marginTop: 28,
                                            fontSize: 16, marginBottom: 5, marginLeft: 8
                                        }}>Reset Date : XXXXX</Text></View></View>) : (<Text style={{
                                            fontSize: 25, textAlign: 'center', marginHorizontal: 40, textDecorationLine: 'underline',
                                            fontWeight: 'bold', marginTop: 35
                                        }}>NO DATA</Text>)}

                            </View>


                            {/* Electricity */}



                            <View style={styles.balance}>
                                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Electricity(units):</Text>
                                {this.state.haselectricity ? (<View><Text style={{
                                    textAlign: 'center', fontWeight: 'bold', marginTop: 20,
                                    fontSize: 40
                                }}>{this.state.electricityusage}</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        {this.state.bulbstatus ? (<TouchableOpacity style={{ padding: 2, alignSelf: 'flex-start', marginTop: 28 }}>
                                            <Text style={{
                                                color: 'white', backgroundColor: '#1e90ff', borderRadius: 8, fontSize: 16,
                                                padding: 5, textDecorationLine: 'underline'
                                            }} onPress={() => { this.offbulb() }}>OFF</Text>
                                        </TouchableOpacity>) : (<TouchableOpacity style={{ padding: 2, alignSelf: 'flex-start', marginTop: 28 }}>
                                            <Text style={{
                                                color: 'white', backgroundColor: '#1e90ff', borderRadius: 8, fontSize: 16,
                                                padding: 5, textDecorationLine: 'underline'
                                            }} onPress={() => { this.onbulb() }}>ON</Text>
                                        </TouchableOpacity>)}
                                        <Text style={{
                                            padding: 2, alignSelf: 'flex-end', marginTop: 28,
                                            fontSize: 16, marginBottom: 5, marginLeft: 8
                                        }}>current status :{this.state.bulbstatus ? (<Text>ON</Text>) : (<Text>OFF</Text>)}</Text></View></View>) : (<Text style={{
                                            fontSize: 25, textAlign: 'center', marginHorizontal: 40, textDecorationLine: 'underline',
                                            fontWeight: 'bold', marginTop: 35
                                        }}>NO DATA</Text>)}

                            </View>


                        </ScrollView>

                    </View>
                </ImageBackground>

            );
        }
    }
}

export default Usage;

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

})