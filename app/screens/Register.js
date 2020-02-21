import React, { Component } from 'react';
import {
    StyleSheet, Text, View, TextInput, Image, TouchableOpacity,
    ImageBackground, Picker, KeyboardAvoidingView, Alert
} from 'react-native';
import Userinfo from './Balance';
import firebase from 'react-native-firebase';
import { ScrollView } from 'react-native-gesture-handler';
import Loading from './Loading'

export default class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            address: '',
            mobile: '',
            email: '',
            password: '',
            pickervalue: '',
            currentelectricitybalance: 0,
            currentgasbalance: 0,
            currentwaterbalance: 0,
            hasgas: false,
            haswater: false,
            haselectricity: false,
            userid: '',
            loadingscreen: false,
            tempo: false,
            tempo2: true,
            waterusage: 0,
            gasusage: 0,
            electricityusage: 0

        }

        this.getname = this.getname.bind(this);
        this.getaddress = this.getaddress.bind(this);
        this.getmobile = this.getmobile.bind(this);
        this.getemail = this.getemail.bind(this);
        this.getpassword = this.getpassword.bind(this);
        this.createuser = this.createuser.bind(this);

    }


    getname(evt) {
        this.setState({
            name: evt
        });
    }
    getaddress(evt2) {
        this.setState({
            address: evt2
        });
    }
    getmobile(evt3) {
        this.setState({
            mobile: evt3
        });
    }
    getemail(evt4) {
        this.setState({
            email: evt4
        });
    }
    getpassword(evt5) {
        this.setState({
            password: evt5
        });
    }
    setloadingscreen(visible) {
        this.setState({ loadingscreen: visible });

    }

    async createuser() {

        console.log(this.state.name)
        if ((this.state.name == '') || (this.state.address == '') || (this.state.email == '')
            || (this.state.mobile == '') || (this.state.pickervalue == '') || (this.state.password == '')) {
            Alert.alert(
                'Registration Failed !',
                'Please fill all the details above',
                [
                    {
                        text: 'OK', onPress: () => this.setState({
                            loadingscreen: false
                        })
                    },
                ],
                { cancelable: false },
            );
        } else {


            this.setState({
                loadingscreen: true
            })
            await firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then(cred => {
                var user = firebase.auth().currentUser.uid;
                firebase.database().ref('users/' + user).set({
                    name: this.state.name,
                    address: this.state.address,
                    mobile: this.state.mobile,
                    pickervalue: this.state.pickervalue,
                    haselectricity: this.state.haselectricity,
                    hasgas: this.state.hasgas,
                    haswater: this.state.haswater,
                    currentelectricitybalance: this.state.currentelectricitybalance,
                    currentwaterbalance: this.state.currentwaterbalance,
                    currentgasbalance: this.state.currentgasbalance,
                    waterusage: this.state.waterusage,
                    gasusage: this.state.gasusage,
                    electricityusage: this.state.electricityusage
                }).then(() => { setTimeout(() => { this.setloadingscreen(false) }, 1500); }).then(() => {
                    this.props.navigation.navigate('Balance');
                })
            }).catch(() => {
                Alert.alert(
                    'Registration Failed !',
                    'Please fill the corerct information in the above form ',
                    [
                        {
                            text: 'OK', onPress: () => this.setState({
                                loadingscreen: false
                            })
                        },
                    ],
                    { cancelable: false },
                );
            })




        }

    }


    render() {
        if (this.state.loadingscreen) {
            return <Loading />
        } else {

            return (
                <ImageBackground source={require('../assets/126388.jpg')}
                    style={styles.container}>

                    {/*   Logo and Title  */}
                    <ScrollView>
                        <KeyboardAvoidingView behavior='position'>

                            <View style={styles.logocontainer}>
                                <Image
                                    style={styles.logo}
                                    source={require('../assets/logo.png')} />
                                <Text style={styles.texttitle}>Nature is not Human Hearted !</Text>
                            </View>

                            {/* Input Fields and Button */}
                            <Text style={styles.registertext}>Register :</Text>
                            <View style={styles.Horizontalline}></View>

                            <View style={styles.signupform}>

                                <TextInput placeholder="Enter full name" placeholderTextColor="#696969"
                                    style={styles.inputtext} onChangeText={this.getname} />

                                <TextInput placeholder="Enter address" placeholderTextColor="#696969"
                                    style={styles.inputtext} onChangeText={this.getaddress} />

                                <TextInput placeholder="Enter Email" placeholderTextColor="#696969"
                                    style={styles.inputtext} onChangeText={this.getemail} />

                                <TextInput keyboardType='numeric' placeholder="Enter Mobile" placeholderTextColor="#696969"
                                    style={styles.inputtext} onChangeText={this.getmobile} maxLength={10} />
                                <View style={styles.picker}>
                                    <Picker
                                        selectedValue={this.state.pickervalue}
                                        onValueChange={(itemvalue, itemindex) => this.setState({ pickervalue: itemvalue })}>

                                        <Picker.Item label="Select Category" color="#696969" value="nothing" />
                                        <Picker.Item label="Urban" value="Urban" />
                                        <Picker.Item label="Agriculture" value="Agriculture" />
                                        <Picker.Item label="Industry" value="Industry" />

                                    </Picker>
                                </View>
                                <TextInput placeholder="Set Password" placeholderTextColor="#696969" secureTextEntry={true}
                                    style={styles.inputtext} onChangeText={this.getpassword} />



                                <TouchableOpacity style={styles.buttonstyle} onPress={this.createuser} >
                                    <Text style={styles.buttontext}>SIGN UP</Text>
                                </TouchableOpacity>
                            </View>



                            {/*footer elements */}


                            <View style={styles.footer}>
                                <Text style={styles.footertext}> Already have account ?</Text>

                                <TouchableOpacity >
                                    <Text style={styles.signup} onPress={() => this.props.navigation.navigate('Login')}>Login</Text>
                                </TouchableOpacity>
                            </View>
                        </KeyboardAvoidingView>
                    </ScrollView>



                </ImageBackground>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#808080'
    },
    logocontainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5,
        marginTop: 80,
        padding: 20

    },
    logo: {
        width: 80,
        height: 80
    },
    texttitle: {
        color: 'white',
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 15
    },
    registertext: {

        fontSize: 25,
        marginLeft: 30,
        fontWeight: 'bold',
        color: 'white'
    },
    Horizontalline: {
        borderWidth: 1.5,
        borderColor: "white",
        marginLeft: 30,
        marginRight: 30,
        marginTop: 1
    },
    signupform: {

        padding: 20,
        marginTop: 10
    },

    inputtext: {
        height: 50,
        paddingHorizontal: 10,
        marginTop: 5,
        borderColor: "#00bfff",
        textAlign: 'left',
        borderWidth: 2,
        borderRadius: 15,
        backgroundColor: "white",
        opacity: 0.9


    },
    picker: {
        borderWidth: 2,
        borderColor: '#00bfff',
        borderRadius: 15,
        marginTop: 5,
        paddingHorizontal: 10,
        height: 50,
        backgroundColor: "white",
        opacity: 0.9
    },

    buttonstyle: {
        backgroundColor: '#1e90ff',
        padding: 15,
        borderRadius: 20,
        marginTop: 10
    },

    buttontext: {
        textAlign: 'center',
        color: '#ffffff'
    },

    footer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    footertext: {
        fontSize: 15,
        color: 'white',
        fontStyle: 'italic'
    },
    signup: {
        color: 'white',
        textDecorationLine: 'underline',
        fontSize: 18,
        marginLeft: 20,
        fontWeight: 'bold'
    }
});