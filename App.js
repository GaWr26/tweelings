import React from 'react';
import { Platform, StyleSheet, Text, View, Button, StatusBar } from 'react-native';
var Buffer = require('buffer/').Buffer;
import { AppLoading, Asset, Font } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import RootNavigation from './navigation/RootNavigation';
//import Auth0 from 'react-native-auth0';


export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };


  _getBearer = () => {
    console.log("loading tweeling");

    var details = {
      'grant_type': 'client_credentials'
    };

    var formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    var key = "fsnepoPAnEmzSC6Lq1h21eFyg";
    var secret = "HMWLBrCwOR0TZBpGzPT4OI5LQaumbKjRKVn8dtrmKeeLLmCpXj";
    var base64 = require('base-64');
    var credentials = encodeURIComponent(key) + ":" + encodeURIComponent(secret);
    var encoded = new Buffer(credentials).toString('base64');
    console.log("Created encoded credentials: " + encoded);
    fetch('https://api.twitter.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Authorization': 'Basic ' + encoded
      },
      body: formBody
    }).then((response) => response.json())
      .then((responseData) => {
        bearerToken = responseData.access_token;
        console.log("Got Bearer: " + responseData.access_token);
        _loadTweet();

      })
      .catch((error) => {
        console.error(error);
        Alert.alert('Alert Title failure' + JSON.stringify(error))
      });

    _loadTweet = () => {
      console.log("start load tweet");

      fetch('https://api.twitter.com/1.1/search/tweets.json?q=love', {
        method: 'GET',
        headers: {
          'Authorization': "Bearer " + bearerToken
        }
      }).then((response) => response.json())
        .then((responseData) => {
          console.log(JSON.stringify(responseData));
        })
        .catch((error) => {
          console.error(error);
          Alert.alert('Alert Title failure' + JSON.stringify(error))
        });
    };
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
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <RootNavigation />
        </View>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
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

    console.log("finished loading");

    this.setState({ isLoadingComplete: true });

    this._getBearer();
  };


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
