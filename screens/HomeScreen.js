import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Button,
  Text,
  TouchableOpacity,
  View,
  Share,
} from 'react-native';
import { WebBrowser } from 'expo';

import { MonoText } from '../components/StyledText';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import { Dimensions } from 'react-native';


var Buffer = require('buffer/').Buffer;

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  isInit = true

  reloadDuration = 10000;
  tweelingsCollection = {};
  currentTweelingIndex = 0;
  currentTweeling = {};
  activeCategory = 0;
  tweelingCategories = [{ tweeling: "love", colour: { gradient1: 0x662483, gradient2: 0xC188BB, gradient3: 0x662483, textHighlight: "0x6c2356" }, standard: true },
  { tweeling: "think", colour: { gradient1: 0x294697, gradient2: 0x009FE3, gradient3: 0x294697, textHighlight: "0x193890" }, standard: true },
  { tweeling: "believe", colour: { gradient1: 0x006633, gradient2: 0x3AAA35, gradient3: 0x006633, textHighlight: "0x0E3515" }, standard: true },
  { tweeling: "feel", colour: { gradient1: 0xE94E1B, gradient2: 0xF9B233, gradient3: 0xE94E1B, textHighlight: "0x781f00" }, standard: true },
  { tweeling: "wish", colour: { gradient1: 0xDEB869, gradient2: 0xFFEBA6, gradient3: 0xDEB869, textHighlight: "0xB58A3E" }, standard: true }];

  tweelingToDisplay = "";

  colors0 = { gradient1: 0x7089ce, gradient2: 0x7ae39a, gradient3: 0x7089ce, textHighlight: "0x5b80e4" };
  colors1 = { gradient1: 0xffd599, gradient2: 0x7ae39a, gradient3: 0xffd599, textHighlight: "0x508c5f" };
  colors2 = { gradient1: 0x9d967a, gradient2: 0x2e4036, gradient3: 0x9d967a, textHighlight: "0x18211b" };
  colors3 = { gradient1: 0xe4bb17, gradient2: 0x4c2075, gradient3: 0xe4bb17, textHighlight: "0xd7b560" };
  colors4 = { gradient1: 0xd317e4, gradient2: 0x4b7cec, gradient3: 0xd317e4, textHighlight: "0xffe16a" };
  colors5 = { gradient1: 0x17e4d8, gradient2: 0xf4fb8c, gradient3: 0x17e4d8, textHighlight: "0x0e7994" };
  colors6 = { gradient1: 0xe41717, gradient2: 0x8f0bf5, gradient3: 0xe41717, textHighlight: "0x0a0647" };
  colors7 = { gradient1: 0xf0ff00, gradient2: 0x2a92bd, gradient3: 0xf0ff00, textHighlight: "0x493a12" };
  colors8 = { gradient1: 0x00f8f5, gradient2: 0xbfbfbf, gradient3: 0x00f8f5, textHighlight: "0x7a84eb" };
  colors9 = { gradient1: 0x401c0f, gradient2: 0xcc7373, gradient3: 0x401c0f, textHighlight: "0xde5323" };
  colors10 = { gradient1: 0x00eca1, gradient2: 0xcc9f73, gradient3: 0x00eca1, textHighlight: "0x256b54" };
  colors11 = { gradient1: 0xbfd122, gradient2: 0x5e4fbd, gradient3: 0xbfd122, textHighlight: "0xffcc00" };
  colors12 = { gradient1: 0x00ff00, gradient2: 0xff00ae, gradient3: 0x00ff00, textHighlight: "0xfffc00" };
  colors13 = { gradient1: 0xeb73bc, gradient2: 0xe1ea79, gradient3: 0xeb73bc, textHighlight: "0xfffc00" };
  colors14 = { gradient1: 0x08be22, gradient2: 0x6978c2, gradient3: 0xe08be22, textHighlight: "0xfffc00" };
  colors15 = { gradient1: 0x08beb8, gradient2: 0xc2698f, gradient3: 0x08beb8, textHighlight: "0x6b2f25" };
  colors16 = { gradient1: 0xf1ff0b, gradient2: 0x69c2b6, gradient3: 0xf1ff0b, textHighlight: "0x25296b" };
  colors17 = { gradient1: 0xdc25d1, gradient2: 0x69c2b6, gradient3: 0xdc25d1, textHighlight: "0x25296b" };
  colors18 = { gradient1: 0xdc25d1, gradient2: 0xead100, gradient3: 0xdc25d1, textHighlight: "0x9d2ac8" };
  colors19 = { gradient1: 0xdc25d1, gradient2: 0xa0ea00, gradient3: 0xdc25d1, textHighlight: "0x2037ab" };
  colors20 = { gradient1: 0xec0000, gradient2: 0x6976f2, gradient3: 0xec0000, textHighlight: "0x500c69" };

  activeColors = {};



  constructor() {
    super()
    this.state = {
      tweelingToShow: '',
      author: '',
      authorImageURL: '',
      myText: 'I\'m ready to get swiped!',
      gestureName: 'none',
      backgroundColor: '#fff',
    }
  }

  onClick = async () => {

    const { width, height } = Dimensions.get('window');
    const options = {
      format: 'jpg',
      quality: 0.3,
      result: 'file',
      height,
      width,
    };
    const uri = await Expo.takeSnapshotAsync(this.refs.mainScreen, options);

    Share.share({
      message: "Found this on tweelin.gs",
      title: "Tweelings",
      url: uri,
      subject: "Share tweeling"
    }, {
        // Android only:
        dialogTitle: 'Share Tweeling',
        // iOS only:
        excludedActivityTypes: [

        ]
      })
  }


  onSwipeUp(gestureState) {

    if (this.activeCategory < this.tweelingCategories.length - 1) {
      this.activeCategory++;
    } else {
      this.activeCategory = 0;
    }
    this.loadTweeling(this.tweelingCategories[this.activeCategory]);


    this.setState({ myText: 'You swiped up! Now showing ' + this.tweelingCategories[this.activeCategory].tweeling });
  }

  onSwipeDown(gestureState) {
    if (this.activeCategory > 0) {
      this.activeCategory--;
    } else {
      this.activeCategory = this.tweelingCategories.length - 1
    }
    this.loadTweeling(this.tweelingCategories[this.activeCategory]);
    this.setState({ myText: 'You swiped down! Now showing ' + this.tweelingCategories[this.activeCategory].tweeling });
  }

  onSwipeLeft(gestureState) {
    this.setState({ myText: 'You swiped left!' });
    if (this.currentTweelingIndex > 0) {
      this.currentTweelingIndex--;
      this.displayTweeling();
    }
  }

  onSwipeRight(gestureState) {
    this.setState({ myText: 'You swiped right!' });
    if (this.currentTweelingIndex <= this.tweelingsCollection.length) {
      this.currentTweelingIndex++;
      this.displayTweeling();
    }


  }



  componentDidMount() {

    this.activeColors = this.colors0;
    this.getBearer();
  }

  reloadTimer = (action) => {
    if (action == "start") {
      this._interval = setInterval(() => {
        this.currentTweelingIndex++;
        this.displayTweeling();
      }, this.reloadDuration);
    } else if (action == "stop") {
      clearInterval(this._interval);
    }

  }

  componentWillUnmount() {
    clearInterval(this._interval);
  }

  nextCategory = () => {
    if (this.activeCategory > 0) {
      this.activeCategory--;
    } else {
      this.activeCategory = this.tweelingCategories.length - 1
    }
    this.loadTweeling(this.tweelingCategories[this.activeCategory]);
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
        console.log("Got Bearer: "/* + responseData.access_token*/);
        //loadTweeling();
        this.loadTweeling(this.tweelingCategories[this.activeCategory]);


      });



  };


  loadTweeling = (q) => {

    this.setState({ backgroundColor: this.tweelingCategories[this.activeCategory].colour.gradient1, tweelingToShow: "" });

    if (q != this.currentTweeling) {
      this.isInit = true;
      //tweeling.visible = false;
      //btnAuthor.visible = false;
      //tweelingArrayCollection = new ArrayCollection();
      this.currentTweelingIndex = 0;
      this.activeColors = q.colour;


      //arangeBG();
    }
    this.currentTweeling = q;
    console.log("loadTweelings: " + q.tweeling)
    fetch('https://api.twitter.com/1.1/search/tweets.json?lang=en&count=50&q=' + q.tweeling, {
      method: 'GET',
      headers: {
        'Authorization': "Bearer " + bearerToken
      }
    }).then((response) => response.json())
      .then((responseData) => {
        console.log("Tweets Loaded successfully...")

        //console.log(JSON.stringify(responseData.statuses));
        this.tweelingsCollection = responseData.statuses;

        if (this.isInit) {
          this.isInit = false;
          this.displayTweeling();
        }



      });
  };

  displayTweeling = () => {

    this.reloadTimer("stop");
    this.reloadTimer("start");

    console.log("currentindex:" + this.currentTweelingIndex + " length: " + this.tweelingsCollection.length)
    if (this.currentTweelingIndex + 1 === this.tweelingsCollection.length) {
      this.loadTweeling(this.currentTweeling);
      this.currentTweelingIndex = 0;
      return;
    }


    //console.log(this.tweelingsCollection[this.currentTweelingIndex].user.profile_image_url);

    /*for(let i = 0; i < data.length; i++){
      console.log(data[i].text);
    }*/

    var myPattern = new RegExp(this.currentTweeling.tweeling, "gi");
    var theString = this.tweelingsCollection[this.currentTweelingIndex].text.toLocaleLowerCase();
    //trace("string: " + theString)
    var newString = theString;//theString.replace(myPattern, "<Text style={{color: '" + this.activeColors.textHighlight + "'}}>" + this.currentTweeling.tweeling + " </Text>");
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



    this.setState({ tweelingToShow: newString, author: this.tweelingsCollection[this.currentTweelingIndex].user.name, authorImageURL: this.tweelingsCollection[this.currentTweelingIndex].user.profile_image_url })
  };


  mainStyle = function (options) {
    return {
      backgroundColor: this.state.backgroundColor,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    }
  }



  render() {



    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };

    return (


      <GestureRecognizer
        onSwipeUp={(state) => this.onSwipeUp(state)}
        onSwipeDown={(state) => this.onSwipeDown(state)}
        onSwipeLeft={(state) => this.onSwipeLeft(state)}
        onSwipeRight={(state) => this.onSwipeRight(state)}
        config={config}
        style={{
          flex: 1
        }}
      >
        <View ref="mainScreen" style={this.mainStyle()}>
          {this._maybeRenderDevelopmentModeWarning()}

          <Text style={styles.tweelingText}>
            {this.state.tweelingToShow}
          </Text>

          <View style={styles.authorView}>
            <Image
             style={{width: 50, height: 50}}
              source={{uri: this.state.authorImageURL}}
            />
            <Text style={styles.authorText}>
              {this.state.author}
            </Text>
          </View>

        </View>

        <View style={styles.tabBarInfoContainer}>
          <Button
            onPress={this.onClick}
            title="Share"
            color="#841584"
          />

        </View>



      </GestureRecognizer>
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
          Development mode is enabled.
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
    alignItems: 'center',
    justifyContent: 'center'

  },
  developmentModeText: {
    position: 'absolute',
    bottom: 70,
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  tweelingText: {
    marginRight: 20,
    marginLeft: 20,
    fontSize: 28,
    color: 'rgba(255,255,255, 1)',
    lineHeight: 34,
    textAlign: 'center',
  },
  authorText: {
    marginLeft:20,
    fontSize: 14,
    color: 'rgba(255,255,255, 1)',
    lineHeight: 34,
    textAlign: 'center',
  },
  authorView: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    bottom: 110,
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

});
