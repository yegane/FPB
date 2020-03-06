/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Text} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';

import {
  Contacts,
  Favorites,
  Keypad,
  Recents,
  Voicemail,
  AddContact,
  DetailsOfContact,
  EditContact,
} from '../components/index.js';

const TabBottomNavigator = createBottomTabNavigator(
  {
    Favorites: {
      screen: Favorites,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => (
          <Icon name="ios-star" color={tintColor} size={25} />
        ),
        tabBarLabel: (
          <Text
            style={{
              fontFamily: 'Ubuntu-Light',
              fontSize: 12,
              textAlign: 'center',
            }}>
            Favorites
          </Text>
        ),
      },
    },
    Recents: {
      screen: Recents,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => (
          <Icon name="ios-time" color={tintColor} size={25} />
        ),
        tabBarLabel: (
          <Text
            style={{
              fontFamily: 'Ubuntu-Light',
              fontSize: 12,
              textAlign: 'center',
            }}>
            Recents
          </Text>
        ),
      },
    },
    Contacts: {
      screen: Contacts,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => (
          <Icon name="ios-contact" color={tintColor} size={25} />
        ),
        tabBarLabel: (
          <Text
            style={{
              fontFamily: 'Ubuntu-Light',
              fontSize: 12,
              textAlign: 'center',
            }}>
            Contacts
          </Text>
        ),
      },
    },
    Keypad: {
      screen: Keypad,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => (
          <Icon name="ios-keypad" color={tintColor} size={25} />
        ),
        tabBarLabel: (
          <Text
            style={{
              fontFamily: 'Ubuntu-Light',
              fontSize: 12,
              textAlign: 'center',
            }}>
            Keypad
          </Text>
        ),
      },
    },
    Voicemail: {
      screen: Voicemail,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => (
          <Icon name="ios-recording" color={tintColor} size={25} />
        ),
        tabBarLabel: (
          <Text
            style={{
              fontFamily: 'Ubuntu-Light',
              fontSize: 12,
              textAlign: 'center',
            }}>
            Voicemail
          </Text>
        ),
      },
    },
  },
  {
    initialRouteName: 'Contacts',
  },
);

const AppStackNavigator = createStackNavigator(
  {
    Contacts: {
      screen: TabBottomNavigator,
    },
    AddContact: {
      screen: AddContact,
    },
    DetailsOfContact: {
      screen: DetailsOfContact,
    },
    EditContact: {
      screen: EditContact,
    },
  },
  {
    headerMode: 'none',
  },
);

const AppContainers = createAppContainer(AppStackNavigator);

export default AppContainers;
