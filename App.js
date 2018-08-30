import React from 'react';
import { Platform, StyleSheet, Text, View, Button, StatusBar } from 'react-native';
import { AppLoading, Asset, Font } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './screens/HomeScreen';
import { createStackNavigator } from 'react-navigation';
import SettingsScreen from './screens/SettingsScreen';
import { AsyncStorage } from "react-native"

export default class App extends React.Component {

  state = {
    isLoadingComplete: false,
  };




  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          <RootStack />

        </View>
      );
    }
  }

  _loadResourcesAsync = async () => {
    this._retrieveData();
    return Promise.all([
      Asset.loadAsync([
        /*require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),*/
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {

    console.log("finished initial loading");
    this.setState({ isLoadingComplete: true });

  };

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('TWEELINGS');
      if (value !== null) {
        // We have data!!
        console.log(value);
        //await AsyncStorage.setItem('TWEELINGS', "love,think,believe,wish,feel");
      }else{
        console.log("No Local Data. Creating...");
        this._createInitData();
      }
     } catch (error) {
       // Error retrieving data
     }
  }

  _createInitData = async () => {
    try {
      await AsyncStorage.setItem('TWEELINGS', "'love,think,believe,wish,feel'");
    } catch (error) {
      // Error saving data
    }
  }
}


const RootStack = createStackNavigator(
  {
    Home: HomeScreen,
    Settings: SettingsScreen,
  },
  {
    initialRouteName: 'Home',
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
