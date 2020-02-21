import React, { Component } from 'react';
import {
    StyleSheet, Text, View, TextInput, Image, TouchableOpacity,
    ImageBackground, KeyboardAvoidingView, Alert
} from 'react-native';
import firebase from 'react-native-firebase';
import Userinfo from './Balance';
import Loading from './Loading'



export default class Login extends Component {

    constructor() {
        super()
        this.state = {
            loginemail: '',
            loginpassword: '',
            loadingscreen: false
        }

        this.getpassword = this.getpassword.bind(this);
        this.getemail = this.getemail.bind(this);
        this.signin = this.signin.bind(this);
        this.setloadingscreen = this.setloadingscreen.bind(this);

    }


    getemail(evt) {
        this.setState({
            loginemail: evt
        })
    }

    getpassword(evt) {
        this.setState({
            loginpassword: evt
        })
    }

    async signin() {
        if ((this.state.loginemail == "" || this.state.loginpassword == "")) {
            Alert.alert(
                'Login Failed !',
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
            await firebase.auth().signInWithEmailAndPassword(this.state.loginemail, this.state.loginpassword).then(user => {
                console.log('log in success');
                this.props.navigation.navigate('Balance');
            }).then(() => { setTimeout(() => { this.setloadingscreen(false) }, 1500); })
                .catch(() => {
                    Alert.alert(
                        'Login Failed !',
                        'Username and password are not correct ',
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

    setloadingscreen(visible) {
        this.setState({ loadingscreen: visible });

    }

    render() {
        if (this.state.loadingscreen) {
            return <Loading />
        } else {

            return (
                <ImageBackground source={require('../assets/126388.jpg')}
                    style={styles.container}>

                    {/*   Logo and Title  */}
                    <KeyboardAvoidingView behavior='position'>
                        <View style={styles.logocontainer}>
                            <Image
                                style={styles.logo}
                                source={require('../assets/logo.png')} />
                            <Text style={styles.texttitle}>Nature is not Human Hearted !</Text>
                        </View>

                        {/* Input Fields and Button */}

                        <View style={styles.loginform}>
                            <TextInput placeholder="Enter Email" placeholderTextColor="#696969"
                                style={styles.inputtext} onChangeText={this.getemail} />
                            <TextInput placeholder="Enter Password" placeholderTextColor="#696969"
                                style={styles.inputtext} onChangeText={this.getpassword} secureTextEntry={true} />
                            <TouchableOpacity style={styles.buttonstyle} onPress={this.signin} >
                                <Text style={styles.buttontext}>LOGIN</Text>
                            </TouchableOpacity>
                        </View>

                        {/*footer elements */}


                        <View style={styles.footer}>
                            <Text style={styles.footertext}> New User ?</Text>

                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')}>
                                <Text style={styles.signup}>Register</Text>
                            </TouchableOpacity>
                        </View>


                    </KeyboardAvoidingView>

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
        marginBottom: 10,
        marginTop: 150,
        padding: 30

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

    loginform: {

        padding: 20,
        marginTop: 20
    },

    inputtext: {
        borderWidth: 2,
        height: 50,
        paddingHorizontal: 10,
        marginBottom: 20,
        borderRadius: 20,
        borderColor: "#00bfff",
        textAlign: 'center',
        backgroundColor: "white",
        opacity: 0.8


    },
    buttonstyle: {
        backgroundColor: '#1e90ff',
        padding: 15,
        borderRadius: 20
    },

    buttontext: {
        textAlign: 'center',
        color: '#ffffff'
    },

    footer: {
        padding: 20,
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