import React, { Component } from 'react';
import { StyleSheet, View, BackHandler } from 'react-native';
import Login from './screens/Login';
import Register from './screens/Register';
import Balance from './screens/Balance';
import Userprofile from './screens/Userprofile';
import Loading from './screens/Loading';
import Usage from './screens/Usage'

import { createBottomTabNavigator } from 'react-navigation-tabs'

import { createSwitchNavigator, createAppContainer } from 'react-navigation';


import firebase from 'react-native-firebase';

import Icon from 'react-native-vector-icons/FontAwesome'




export class App extends Component {
  constructor(props) {
    super(props)
  }
  render() {

  }
}


const DashboardTabNavigator = createBottomTabNavigator({
  Balance: {
    screen: Balance,
    navigationOptions: {
      tabBarLabel: 'Balance',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="rupee" color={tintColor} size={25} />
      )
    }
  },
  Userprofile: {
    screen: Userprofile,
    navigationOptions: {
      tabBarLabel: 'Profile',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="user" color={tintColor} size={25} />
      )
    }
  },
  Usage: {
    screen: Usage,
    navigationOptions: {
      tabBarLabel: 'Usage',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="history" color={tintColor} size={25} />
      )
    }
  }
});


export default createAppContainer(createSwitchNavigator(
  {
    Login: Login,
    Register: Register,
    Loading: Loading,
    Balance: {
      screen: DashboardTabNavigator
    },
  },
  {
    initialRouteName: 'Login',
  }
));

const styles = StyleSheet.create({

});