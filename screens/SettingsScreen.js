import React from 'react';
import { View, TextInput, Text, Button, TagsInput, Typography,Colors } from 'react-native-ui-lib';
import Model from '../data/data';
import { StyleSheet, } from 'react-native';
import { AsyncStorage } from "react-native"

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };


    constructor() {
        super()

        this.onTagPress = this.onTagPress.bind(this);

        this.state = {
            tags: [],
        }

        this._retrieveData();
    }

    _retrieveData = async () => {
        try {
          const value = await AsyncStorage.getItem('TWEELINGS');
          if (value !== null) {
            // We have data!!
            console.log(value);
            this.setState({ tags: value.split(",")})
          }
         } catch (error) {
           // Error retrieving data
         }
      }

    onTagPress(tagIndex, markedTagIndex) {
        this.customTagsInput.markTagIndex(tagIndex === markedTagIndex ? undefined : tagIndex);
      }
    
      renderCustomTag(tag, index, shouldMarkToRemove) {
        return (
          <View style={[styles.customTag,  shouldMarkToRemove && {backgroundColor: Colors.purple50}]}>
            <Text white text30>{tag}</Text>
          </View>
        );
      }

    onChangeTags(tags){
          console.log("Change Tags: " + tags);
          this.setState({tags});        
          this.saveData(tags);
          
          
    }

    saveData= async (tags) => {
      console.log("attempting to save values: " + tags);
        try {
            await AsyncStorage.setItem('TWEELINGS', tags.toString());
          } catch (error) {
            // Error saving data
          }
    }
 
    render() {
        return (
            <View paddingT-50 paddingL-20 paddingR-20 paddingB-20>
             <Text blue50 text20>Saved tweelings</Text>
               <TagsInput 
               containerStyle={{marginBottom: 20, marginTop:20}} 
               placeholder="Add tweeling" 
               onChangeTags={(tags) => this.onChangeTags(tags)}
               inputStyle={{...Typography.text60, color: Colors.blue30}}
               renderTag={this.renderCustomTag}
               tags={this.state.tags} />
               <Button label="back"   marginB-20 onPress={() =>  this.props.navigation.navigate('Home')}/>
            </View>
        );


    }
}

const styles = StyleSheet.create({

    container: {
        backgroundColor: '#ffffff',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',

    },
    customTag: {
        backgroundColor: "#de025f",
        paddingVertical: 5,
        paddingHorizontal: 12,
        borderRadius: 3,
        marginRight: 20,
        marginBottom: 20,
      },


})

