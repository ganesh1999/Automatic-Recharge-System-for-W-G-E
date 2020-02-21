import React, { Component } from 'react'
import { StyleSheet, View, ActivityIndicator, ImageBackground } from 'react-native'





class Loading extends Component {
    render() {
        return (
            <ImageBackground source={require('../assets/126388.jpg')} style={styles.container}>

                <ActivityIndicator size='large' style={styles.loading} />

            </ImageBackground>
        );
    }
}

export default Loading;
const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#e0ffff',

    },

    loading: {
        flex: 1,
        alignItems: 'center'

    }

})