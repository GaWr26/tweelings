import React from 'react';
import { View, TextInput, Text, Button, TagsInput } from 'react-native-ui-lib';
import Model from '../data/data';
import { createStackNavigator } from 'react-navigation';
import { StyleSheet, } from 'react-native';
import { AsyncStorage } from "react-native"

export default class SettingsScreen extends React.Component {



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
          <View style={[styles.customTag, shouldMarkToRemove && {backgroundColor: '#00ff00'}]}>
            <Text white >{tag.label}</Text>
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
            <View top paddingT-50>
               <TagsInput 
               containerStyle={{marginBottom: 20}} 
               placeholder="Add tweeling" 
               onChangeTags={(tags) => this.onChangeTags(tags)}
               tags={this.state.tags} />
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
        backgroundColor: "#ff0000",
        paddingVertical: 2,
        paddingHorizontal: 8,
        borderRadius: 3,
        marginRight: 20,
        marginBottom: 20,
      },

})

