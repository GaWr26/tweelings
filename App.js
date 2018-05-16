import React from 'react';
import { Platform, StyleSheet, Text, View, Button, StatusBar } from 'react-native';
//var Buffer = require('buffer/').Buffer;
import { AppLoading, Asset, Font } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import RootNavigation from './navigation/RootNavigation';

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  /*
  onLoadTweeling() {

    console.log("loading tweeling");
    var key = "D5wS96KeGuVUTbseP5ez6Evwb";
    var secret = "YTBDDKDjRfaa1QAIRdD4KusMkwBQp4pRVX5maz2QfEjLAq5Ihs";


    var base64 = require('base-64');

    var credentials = encodeURIComponent(key) + ":" + encodeURIComponent(secret);
    var encoded = new Buffer(credentials).toString('base64');
    console.log(encoded);

    fetch('https://api.twitter.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Authorization': 'Basic ' + encoded
      },
      body: {
        'grant_type': 'client_credentials'
      },
    }).then((response) => console.log(response))

    console.log("tweeling loaded")
  }
*/
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
  this.setState({ isLoadingComplete: true });
};
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: '#fff',
},
});
