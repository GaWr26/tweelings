import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  CameraRoll,
  TouchableOpacity,
  TouchableHighlight,
  Share,
  Modal,
  Dimensions,
  AsyncStorage,
} from 'react-native';

import { MonoText } from '../components/StyledText';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import { KeepAwake, LinearGradient, Permissions } from 'expo';
import Mask from "react-native-mask";
import { View, Text, Button } from 'react-native-ui-lib';
import SetupData from '../data/data';

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
  activeColorIndex = 0;

  constructor() {
    super()
    this.state = {
      tweelingCategories: [],
      gotBearer:false,
      tweelingToShow: '',
      tweeling: '',
      author: '',
      authorImageURL: 'http://',
      myText: 'I\'m ready to get swiped!',
      gestureName: 'none',
      modalVisible: false
    }
  }


  componentDidMount() {
    this.load()
    this.props.navigation.addListener('willFocus', this.load)

    this.getBearer();
  }

  componentWillUnmount() {
    clearInterval(this._interval);
  }

  load = () => {
    //console.log("I'm visible!");
    this._retrieveData();
  }

  _retrieveData = async () => {
    console.log("loading data from storage");
    try {
      const value = await AsyncStorage.getItem('TWEELINGS');
      if (value !== null) {
        // We have data!!
        //console.log(value);
        this.setState({ tweelingCategories: value.split(",") })
        this.loadTweeling(this.state.tweelingCategories[this.state.tweelingCategories.length-1]);
      }
    } catch (error) {
      // Error retrieving data
    }
  }

  onShare = async () => {

    theMessage = "";

    if (Platform.OS === "android") {
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
    } else {
      const { width, height } = Dimensions.get('window');
      const options = {
        format: 'jpg',
        quality: 0.75,
        result: 'file',
        height,
        width,
      };
      const uri = await Expo.takeSnapshotAsync(this.refs.mainScreen, options);

      Share.share({
        message: "",
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
  }


  onSwipeUp(gestureState) {

    if (this.activeCategory < this.state.tweelingCategories.length - 1) {
      this.activeCategory++;
    } else {
      this.activeCategory = 0;
    }
    this.loadTweeling(this.state.tweelingCategories[this.activeCategory]);


    this.setState({ myText: 'You swiped up! Now showing ' + this.state.tweelingCategories[this.activeCategory].tweeling });
  }

  onSwipeDown(gestureState) {
    if (this.activeCategory > 0) {
      this.activeCategory--;
    } else {
      this.activeCategory = this.state.tweelingCategories.length - 1
    }
    this.loadTweeling(this.state.tweelingCategories[this.activeCategory]);
    this.setState({ myText: 'You swiped down! Now showing ' + this.state.tweelingCategories[this.activeCategory].tweeling });
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

  nextCategory = () => {
    if (this.activeCategory > 0) {
      this.activeCategory--;
    } else {
      this.activeCategory = this.state.tweelingCategories.length - 1
    }
    this.loadTweeling(this.state.tweelingCategories[this.activeCategory]);
  }

  getBearer = () => {
    console.log("Getting Bearer Token");

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
        console.log("Received Bearer Token"/* + responseData.access_token*/);
        //console.log("Load tweeling: " + this.state.tweelingCategories[this.activeCategory])
        //loadTweeling();
        //this.loadTweeling(this.state.tweelingCategories[this.activeCategory]);
        this.setState({ gotBearer: true});
        this._retrieveData();
      });
  };


  loadTweeling = (q) => {

    this.setState({tweelingToShow: "", tweeling: "#" + q });

    if (q != this.currentTweeling) {
      this.isInit = true;
      this.currentTweelingIndex = 0;
      var randomNumber = Math.floor(Math.random() * SetupData.length) + 0  
      this.activeColorIndex = randomNumber;
    }
    this.currentTweeling = q;
    console.log("loadTweelings: " + q)
    fetch('https://api.twitter.com/1.1/search/tweets.json?lang=en&count=50&q=' + q, {
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

    //console.log("currentindex:" + this.currentTweelingIndex + " length: " + this.tweelingsCollection.length)
    if (this.currentTweelingIndex + 1 === this.tweelingsCollection.length) {
      this.loadTweeling(this.currentTweeling);
      this.currentTweelingIndex = 0;
      return;
    }

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
    //console.log(newString);
    console.log("Displaying new tweeling")

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
    return [SetupData[this.activeColorIndex].gradient1, SetupData[this.activeColorIndex].gradient2];

  }

  textStyle = function (options) {
    return {
      marginRight: 50,
      marginLeft: 20,
      fontSize: 28,
      color: SetupData[this.activeColorIndex].textHighlight, 
      lineHeight: 34,
      textAlign: 'center'
    }
  }

  patternStyle = function (options) {
    return {
      tintColor: SetupData[this.activeColorIndex].textHighlight,
      flex: 1,
      alignSelf: 'stretch',
      height: undefined,
      width: undefined
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
        onSwipeDown={(state) => this.onSwipeDown(sutate)}
        onSwipeLeft={(state) => this.onSwipeLeft(state)}
        onSwipeRight={(state) => this.onSwipeRight(state)}
        config={config}
        style={{
          flex: 1
        }}
      >
        <View style={styles.container} ref="mainScreen">
          <LinearGradient colors={this.gradientColors()}
            style={{ position: 'absolute', width: '100%', height: '100%' }} />
          <Image style={this.patternStyle()}
            source={require('../assets/images/patterns/pattern_02.png')}
            resizeMode="stretch"
          />
          <View style={{ position: 'absolute', top: 100, left: 0 }}>

            <KeepAwake />
            <MonoText style={this.textStyle()} >
              {this.state.tweelingToShow}
            </MonoText>
          </View>

          <View style={styles.authorView}>
            <Mask shape={'circle'}>
              <Image
                style={{ width: 50, height: 50 }}
                source={{ uri: this.state.authorImageURL }}
              />
            </Mask>
            <View style={{ flex: 1, alignItems: 'flex-start', flexDirection: 'column' }}>
              <MonoText style={styles.authorText}>
                by {this.state.author}
              </MonoText>
              <MonoText style={styles.authorText}>
                {this.state.tweeling}
              </MonoText>
            </View>
            <View>
              <TouchableHighlight onPress={this.onShare} underlayColor="white">
                <Image
                  style={{ width: 30, height: 30, tintColor: 'white' }}
                  source={require('../assets/images/icons/share.png')}
                />
              </TouchableHighlight>
            </View>
          </View>

          <View style={{ position: 'absolute', top: 50, right: 10 }}>
            <Button label="Settings" size="small" onPress={() => this.props.navigation.navigate('Settings')} />
          </View>

          <View style={{ flex: 1, position: 'absolute', alignItems: 'center', justifyContent: 'center' }}>
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
        </View>

      </GestureRecognizer>
    );
  }
}

const styles = StyleSheet.create({

  container: {
    backgroundColor: '#000000',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',

  },
  patternImage: {
    position: 'absolute',

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
    lineHeight: 20,
    textAlign: 'center',
  },
  authorView: {
    flex: 1,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
  },
  shareButton: {
    marginLeft: 30,
    marginRight: 30
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
