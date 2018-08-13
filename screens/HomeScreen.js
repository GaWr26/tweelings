import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  CameraRoll,
  Button,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  View,
  Share,
  Modal,
} from 'react-native';

import { MonoText } from '../components/StyledText';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import { Dimensions } from 'react-native';
import { KeepAwake } from 'expo';
import { Constants, takeSnapshotAsync } from 'expo';
import { Permissions } from 'expo';
import { LinearGradient } from 'expo';
import SvgUri from 'react-native-svg-uri';


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
  tweelingCategories = [{ tweeling: "love", colour: { gradient1: 0xfbab7e, gradient2: 0xf7ce68, textHighlight: "#de025f" }, standard: true },
  { tweeling: "think", colour: { gradient1: 0x294697, gradient2: 0x009FE3, gradient3: 0x294697, textHighlight: "0x193890" }, standard: true },
  { tweeling: "believe", colour: { gradient1: 0x006633, gradient2: 0x3AAA35, gradient3: 0x006633, textHighlight: "0x0E3515" }, standard: true },
  { tweeling: "feel", colour: { gradient1: 0xE94E1B, gradient2: 0xF9B233, gradient3: 0xE94E1B, textHighlight: "0x781f00" }, standard: true },
  { tweeling: "wish", colour: { gradient1: 0xDEB869, gradient2: 0xFFEBA6, gradient3: 0xDEB869, textHighlight: "0xB58A3E" }, standard: true }];

  tweelingToDisplay = "";



  activeColors = {};



  constructor() {
    super()
    this.state = {
      tweelingToShow: '',
      author: '',
      authorImageURL: 'http://',
      myText: 'I\'m ready to get swiped!',
      gestureName: 'none',
      backgroundColor: '#fff',
      modalVisible: false,
    }
  }

  onShare = async () => {

    const { width, height } = Dimensions.get('window');
    const options = {
      format: 'jpg',
      quality: 0.75,
      result: 'file',
      height,
      width,
    };
    const uri = await Expo.takeSnapshotAsync(this.refs.mainScreen, options);


    theMessage = "Found this on tweelin.gs";

    if (Platform.OS === "android") {
      theMessage = "Found this on tweelin.gs: " + this.state.tweelingToShow;
    }

    Share.share({
      message: theMessage,
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

  onSave = async () => {

    const { status_roll } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    const { width, height } = Dimensions.get('window');
    const options = {
      format: 'jpg',
      quality: 0.75,
      result: 'file',
      height,
      width,
    };
    const uri = await Expo.takeSnapshotAsync(this.refs.mainScreen, options);

    let saveResult = await CameraRoll.saveToCameraRoll(uri, 'photo');
    this.setState({ modalVisible: true });
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
      //backgroundColor: this.state.backgroundColor,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    }
  }
  gradientColors = function (options) {
    return ['#f7ce68', '#fbab7e'];

  }

  textStyle = function (options) {
    return {
      marginRight: 20,
      marginLeft: 20,
      fontSize: 28,
      color: this.tweelingCategories[this.activeCategory].colour.textHighlight,
      lineHeight: 34,
      textAlign: 'center'
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
        <View>

          <LinearGradient ref="gradient" colors={this.gradientColors()}
            style={{ height: '100%' }}>
            <SvgUri width="100" height="100" source={require('../assets/images/patterns/homer-simpson.svg')} />


            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {
                  alert('Modal has been closed.');
                }}>
                <View style={styles.modalBottom}>
                  <View style={styles.modalBottomContent}>
                    <Text>Tweeling saved to your camera roll!</Text>

                    <TouchableHighlight
                      onPress={() => {
                        this.setState({ modalVisible: false });
                      }}>
                      <Text>Thanks!</Text>
                    </TouchableHighlight>
                  </View>
                </View>
              </Modal>
            </View>



            <View ref="mainScreen" style={this.mainStyle()}>

              <KeepAwake />
              {this._maybeRenderDevelopmentModeWarning()}

              <Text style={this.textStyle()}>
                {this.state.tweelingToShow}
              </Text>

              <View style={styles.authorView}>
                <Image
                  style={{ width: 50, height: 50 }}
                  source={{ uri: this.state.authorImageURL }}
                />
                <Text style={styles.authorText}>
                  {this.state.author}
                </Text>
              </View>

            </View>

            <View style={styles.tabBarInfoContainer}>
              <Button style={styles.shareButton}
                onPress={this.onShare}
                title="Share"
                color="#841584"
              />
              <Button style={styles.shareButton}
                onPress={this.onSave}
                title="Save"
                color="#841584"
              />
            </View>
          </LinearGradient>


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
    top: 50,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  authorText: {
    marginLeft: 20,
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
  shareButton: {
    marginLeft: 30,
    marginRight: 30,
  },
  tabBarInfoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 20,
  },
  modalBottom: {
    position: 'absolute',
    height: 200,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
  },
  modalBottomContent: {
    flex: 1,
    height: 100,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    position: 'absolute',
    bottom: 50,
    left: 50,
    right: 50,
  },


});
