/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

class Header extends React.Component {
  render() {
    const {main, IconLeft, IconRight, Title, TitleText} = styles;
    const displayIconLeft = this.props.displayIconLeft;
    const displayIconRight = this.props.displayIconRight;
    const displayText = this.props.displayText;
    const colorText = this.props.colorText;
    const disable = this.props.disable;

    return (
      <View style={main}>
        <View style={IconLeft}>
          <Icon
            style={{display: displayIconLeft}}
            name={this.props.iconLeft}
            size={25}
            color="#fff"
            onPress={() => this.props.navigation.goBack()}
          />
        </View>

        <View style={Title}>
          <Text style={TitleText}> {this.props.title} </Text>
        </View>

        <View style={IconRight}>
          <Icon
            style={{display: displayIconRight}}
            name={this.props.iconRight}
            size={25}
            color="#fff"
            onPress={() => this.props.navigation.navigate('AddContact')}
          />
          <TouchableOpacity
            disabled={disable}
            style={{display: displayText}}
            onPress={() => this.props.update()}>
            <Text style={{fontFamily: 'Ubuntu-Light', color: colorText}}>
              {this.props.nameRight}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    width: '100%',
    position: 'absolute',
    height: 65,
    zIndex: 4,
    flexDirection: 'row',
    backgroundColor: '#3D9970',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  IconLeft: {
    width: '30%',
  },
  IconRight: {
    width: '28%',
    alignItems: 'flex-end',
  },
  Title: {
    width: '33.33%',
    alignItems: 'center',
  },
  TitleText: {
    fontSize: 17,
    color: '#fff',
    fontFamily: 'Ubuntu-Light',
  },
});

export {Header};
