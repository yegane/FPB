/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const {main, IconLeft, Title, TitleText, IconRight} = styles;

const HeaderTest = props => {
  return (
    <View style={main}>
      <View style={IconLeft}>
        <Icon
          name={props.iconLeft}
          size={30}
          color="#fff"
          onPress={() => this.props.navigation.goBack()}
        />
      </View>

      <View style={Title}>
        <Text style={TitleText}> {props.title} </Text>
      </View>

      <View style={IconRight}>
        <Icon
          style={{display: props.displayIcon}}
          name={props.iconRight}
          size={30}
          color="#fff"
          onPress={() => this.props.navigation.navigate('AddContact')}
        />
        <TouchableOpacity
          disabled={props.disable}
          style={{display: props.displayText}}
          onPress={() => props.update()}>
          <Text style={{fontFamily: 'Ubuntu-Light', color: props.colorText}}>
            {props.nameRight}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HeaderTest;
