/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-alert */
import React from 'react';
import {View, Text, Image, StyleSheet, Animated} from 'react-native';
import {Header} from '../components/index';

class DetailsOfContact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disable: false,
      name: '',
      family: '',
      image: '',
      phone: '',
      mobile: '',
      work: '',
      favoritePhone: 0,
      favoriteMobile: 0,
      favoriteWork: 0,
      key: 0,
      LetterFirstName: '',
      LetterLastName: '',
      scrollY: new Animated.Value(0),
      heightPhoto: 0,
      index: 0,
      fullName: '',
    };
  }

  UNSAFE_componentWillMount() {
    this.setState({
      key: this.props.navigation.state.params.key,
      name: this.props.navigation.state.params.name,
      family: this.props.navigation.state.params.family,
      image: this.props.navigation.state.params.image,
      phone: this.props.navigation.state.params.phone,
      mobile: this.props.navigation.state.params.mobile,
      work: this.props.navigation.state.params.work,
      favoritePhone: this.props.navigation.state.params.favoritePhone,
      favoriteMobile: this.props.navigation.state.params.favoriteMobile,
      favoriteWork: this.props.navigation.state.params.favoriteWork,
      LetterFirstName: this.props.navigation.state.params.name
        .charAt(0)
        .toUpperCase(),
      LetterLastName: this.props.navigation.state.params.family
        .charAt(0)
        .toUpperCase(),
      index: this.props.navigation.state.params.index,
      fullName: this.props.navigation.state.params.fullName,
    });
  }

  Layout = e => {
    this.setState({heightPhoto: e.nativeEvent.layout.height});
  };

  editPage = () => {
    this.props.navigation.navigate('EditContact', {
      key: this.state.key,
      name: this.state.name,
      family: this.state.family,
      image: this.state.image,
      phone: this.state.phone,
      mobile: this.state.mobile,
      work: this.state.work,
      favoritePhone: this.state.favoritePhone,
      favoriteMobile: this.state.favoriteMobile,
      favoriteWork: this.state.favoriteWork,
      letterFirstName: this.state.LetterFirstName,
      letterLastName: this.state.LetterLastName,
      index: this.state.index,
      fullName: this.state.fullName,
    });
  };

  render() {
    const {styleContainer, subject, detailsInformation} = styles;

    const interpolateTranslateY = this.state.scrollY.interpolate({
      inputRange: [0, 75],
      outputRange: [0, -50],
      extrapolate: 'clamp',
    });

    const interpolateScale = this.state.scrollY.interpolate({
      inputRange: [0, 75],
      outputRange: [1, 0.6],
      extrapolate: 'clamp',
    });

    const interpolateTranslatePhoto = this.state.scrollY.interpolate({
      inputRange: [0, 75],
      outputRange: [15, 55],
      extrapolate: 'clamp',
    });

    return (
      <View style={styleContainer}>
        <Header
          navigation={this.props.navigation}
          iconLeft="md-arrow-back"
          title=""
          displayIconRight="none"
          isplayIconLeft="flex"
          iconRight="md-add"
          disable={this.state.disable}
          nameRight="Edit"
          colorText="#fff"
          update={this.editPage}
        />

        <View style={{flex: 1, marginTop: 65}}>
          <Animated.View
            style={[
              styles.stylePhoto,
              {transform: [{translateY: interpolateTranslateY}]},
            ]}
            onLayout={e => this.Layout(e)}>
            <Animated.View
              style={[
                styles.photo,
                {
                  transform: [
                    {
                      scale: interpolateScale,
                      translateY: interpolateTranslatePhoto,
                    },
                  ],
                },
              ]}>
              <Image
                style={styles.image}
                source={{uri: this.state.image}}
                resizeMode="cover"
              />
              <Text style={styles.textUserImage}>
                {this.state.LetterFirstName}
                {this.state.LetterLastName}
              </Text>
            </Animated.View>
            <Animated.Text
              style={[
                styles.textUser,
                {transform: [{scale: interpolateScale}]},
              ]}>
              {this.state.name + '  '}
              {this.state.family}
            </Animated.Text>
          </Animated.View>
          <Animated.ScrollView
            style={[styles.styleDetails]}
            contentContainerStyle={{paddingTop: this.state.heightPhoto + 20}}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {contentOffset: {y: this.state.scrollY}},
                },
              ],
              {
                useNativeDriver: true,
              },
            )}>
            <View style={styles.information}>
              <Text style={subject}>Name</Text>
              <Text style={detailsInformation}>{this.state.name}</Text>

              <Text style={subject}>Family</Text>
              <Text style={detailsInformation}>{this.state.family}</Text>

              <Text style={subject}>Phone</Text>
              <Text style={detailsInformation}>{this.state.phone}</Text>

              <Text style={subject}>Mobile</Text>
              <Text style={detailsInformation}>{this.state.mobile}</Text>

              <Text style={subject}>Work</Text>
              <Text style={detailsInformation}>{this.state.work}</Text>
            </View>
          </Animated.ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  styleContainer: {
    flex: 1,
  },
  styleDetails: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 2,
  },
  stylePhoto: {
    width: '100%',
    position: 'absolute',
    zIndex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#EEF4E4',
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 100,
    backgroundColor: '#ccc',
    justifyContent: 'center',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 100,
    height: 100,
    borderRadius: 100,
    zIndex: 5,
  },
  textUserImage: {
    textAlign: 'center',
    fontSize: 40,
    color: '#fff',
    fontFamily: 'Ubuntu-Light',
  },
  textUser: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 25,
    color: '#000',
    fontFamily: 'Ubuntu-Light',
  },
  information: {
    flex: 1,
  },
  subject: {
    fontFamily: 'Ubuntu-Light',
    fontSize: 18,
    padding: 15,
    marginTop: 15,
  },
  detailsInformation: {
    fontFamily: 'Ubuntu-Light',
    fontSize: 15,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingLeft: 15,
    paddingTop: 0,
    paddingBottom: 20,
  },
});

export {DetailsOfContact};
