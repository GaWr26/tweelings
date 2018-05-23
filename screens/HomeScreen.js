import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebBrowser } from 'expo';

import { MonoText } from '../components/StyledText';
var Buffer = require('buffer/').Buffer;

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  tweelingsCollection = {};
  currentTweelingIndex = 0;
  currentTweeling = {};
  activeCategory = 0;
  tweelingCategories = [{ tweeling: "love", colour: { gradient1: 0x662483, gradient2: 0xC188BB, gradient3: 0x662483, textHighlight: "0x6c2356" }, standard: true }, { tweeling: "think", colour: { gradient1: 0x294697, gradient2: 0x009FE3, gradient3: 0x294697, textHighlight: "0x193890" }, standard: true }, { tweeling: "believe", colour: { gradient1: 0x006633, gradient2: 0x3AAA35, gradient3: 0x006633, textHighlight: "0x0E3515" }, standard: true }, { tweeling: "feel", colour: { gradient1: 0xE94E1B, gradient2: 0xF9B233, gradient3: 0xE94E1B, textHighlight: "0x781f00" }, standard: true }, { tweeling: "wish", colour: { gradient1: 0xDEB869, gradient2: 0xFFEBA6, gradient3: 0xDEB869, textHighlight: "0xB58A3E" }, standard: true }];
  tweelingToDisplay = "";

  constructor() {
    super()
    this.state = {
      tweelingToShow: ''
    }
  }

  componentDidMount() {

    this._interval = setInterval(() => {
      this.currentTweelingIndex++;
      displayTweeling();
    }, 7000);

    this.getBearer();
  }

  componentWillUnmount() {
    clearInterval(this._interval);
  }

  getBearer = () => {
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
        loadTweet();

      });

    loadTweet = () => {
      console.log("start load tweet");

      fetch('https://api.twitter.com/1.1/search/tweets.json?q=' + this.tweelingCategories[this.activeCategory].tweeling, {
        method: 'GET',
        headers: {
          'Authorization': "Bearer " + bearerToken
        }
      }).then((response) => response.json())
        .then((responseData) => {
          console.log("Tweets Loaded successfully...")
          this.tweelingsCollection = responseData.statuses;
          //console.log(JSON.stringify(responseData.statuses));
          displayTweeling();

        });
    };

    displayTweeling = () => {
      var data = this.tweelingsCollection;
      var index = this.currentTweelingIndex;
      var author = data[index].user.name;
      //console.log(data[index].user.name

      /*for(let i = 0; i < data.length; i++){
        console.log(data[i].text);
      }*/

      var myPattern = new RegExp(this.currentTweeling.tweeling, "gi");
      var theString = this.tweelingsCollection[this.currentTweelingIndex].text.toLocaleLowerCase();
      //trace("string: " + theString)
      var newString = theString; //theString.replace(myPattern, "<span color='" + activeColors.textHighlight + "' fontWeight='bold' fontFamily='azoft'>" + currentTweeling.tweeling + "</span>");
      // pattern to replace <3
      myPattern = new RegExp("<3", "gi");
      newString = newString.replace(myPattern, "♥");
      myPattern = new RegExp("< 3", "gi");
      newString = newString.replace(myPattern, "♥");
      // pattern to remove rt					
      myPattern = new RegExp("RT @([a-zA-Z0-9_]{1,20}[:]?)", "gi");
      newString = newString.replace(myPattern, "");
      // pattern to remove @somebody in the beginning				
      myPattern = new RegExp("(^@([a-zA-Z0-9_]{1,20}[:]?))", "gi");
      newString = newString.replace(myPattern, "");
      // pattern to remove @ and #				
      myPattern = new RegExp("([\@\#])", "gi");
      newString = newString.replace(myPattern, "");

      if (newString.charAt(0) == " ") {
        newString = newString.substr(1, newString.length);
      }


      // remove urls
      myPattern = new RegExp(/((?:[a-z][a-z]+))(:)(\/)((?:\/[\w\.\-]+)+)( )/gi);
      newString = newString.replace(myPattern, "");
      myPattern = new RegExp(/((?:[a-z][a-z]+))(:)(\/)((?:\/[\w\.\-]+)+)/gi);
      newString = newString.replace(myPattern, "");
      //trace("string: " + newString)

      // remove initial space
      if (newString.charAt(0) == " ") {
        newString = newString.substr(1, newString.length);
      }
      console.log(newString);

      this.setState({tweelingToShow: newString})

      


    };
  };


  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <Image
              source={
                __DEV__
                  ? require('../assets/images/robot-dev.png')
                  : require('../assets/images/robot-prod.png')
              }
              style={styles.welcomeImage}
            />
          </View>

          <View style={styles.getStartedContainer}>
            {this._maybeRenderDevelopmentModeWarning()}



            <Text style={styles.getStartedText}>
              Tweeling: {this.state.tweelingToShow}
            </Text>
          </View>


        </ScrollView>

        <View style={styles.tabBarInfoContainer}>
          <Text style={styles.tabBarInfoText}>Info Container</Text>
        </View>
      </View>
    );
  }

  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled, tweelings will be slower but you can use useful development
          tools. {learnMoreButton}
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
          Tweelings is in production mode, the app will run at full speed.
        </Text>
      );
    }
  }

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https:/www.bavaerials.de'
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
