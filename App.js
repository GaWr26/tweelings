import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import OAuthManager from 'react-native-oauth';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    
  }
  onLoadTweeling() {
    


    console.log("loading tweeling");

    
    const config = {
      twitter: {
        consumer_key: 'Fh3UggPKxv2IDhTJOmLNfA',
        consumer_secret: 'r9vQopzMJP8xxLXa0MtFMlh9JNAPhvc180Q3RgX4U'
      }
    }
    // Create the manager
    const manager = new OAuthManager('App')
    // configure the manager
    manager.configure(config);

    manager.authorize('twitter')
      .then(resp => console.warn(resp))
      .catch(err => console.warn(err));



    console.log("tweeling loaded")

  }

  

  render() {
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <Text>Changes you make will automatically reload.</Text>
        <Text>Shake your phone to open the developer menu.</Text>
        <Button
          onPress={this.onLoadTweeling}
          title="Load Tweeling"
          color="#841584"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
