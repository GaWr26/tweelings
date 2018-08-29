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
            this.setState({ tags: value.split(" ")})
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
            <Text white>{tag.label}</Text>
          </View>
        );
      }

    onCreateTag(tag){
          console.log("created Tag: " + tag);
          //console.log("all tags: " + this.state.tags.split(",") + " " + tag);
        
          
          
    }

    saveData= async () => {
        try {
            await AsyncStorage.setItem('TWEELINGS', this.state.tags.split(",") + " " + tag);
            this._retrieveData();
          } catch (error) {
            // Error saving data
          }
    }

    render() {
        return (
            <View style={styles.container} ref="mainScreen">
               <TagsInput 
               onCreateTag={value =>this.onCreateTag(value)}
               containerStyle={{marginBottom: 20}} 
               placeholder="Enter tweelings" 
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
        marginRight: 10,
        marginBottom: 10,
      },

})

