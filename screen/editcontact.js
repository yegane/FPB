/* eslint-disable prettier/prettier */
/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Header} from '../components/header';
import ImagePicker from 'react-native-image-picker';
import SQLite from 'react-native-sqlite-storage';
import Icon from 'react-native-vector-icons/Ionicons';

class EditContact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disable: false,
      id: 0,
      name: '',
      family: '',
      phone: '',
      mobile: '',
      work: '',
      favoritePhone: 0,
      favoriteMobile: 0,
      favoriteWork: 0,
      image: '',
      letterFirstName: '',
      letterLastName: '',
      height: 0,
      scrollY: new Animated.Value(0),
      index: 0,
      fullName: '',
    };
  }

  UNSAFE_componentWillMount() {
    this.setState({
      id: this.props.navigation.state.params.key,
      name: this.props.navigation.state.params.name,
      family: this.props.navigation.state.params.family,
      image: this.props.navigation.state.params.image,
      phone: this.props.navigation.state.params.phone,
      mobile: this.props.navigation.state.params.mobile,
      work: this.props.navigation.state.params.work,
      favoritePhone: this.props.navigation.state.params.favoritePhone,
      favoriteMobile: this.props.navigation.state.params.favoriteMobile,
      favoriteWork: this.props.navigation.state.params.favoriteWork,
      letterFirstName: this.props.navigation.state.params.letterFirstName,
      letterLastName: this.props.navigation.state.params.letterLastName,
      index: this.props.navigation.state.params.index,
      fullName: this.props.navigation.state.params.fullName,
    });
  }

  favoritePhone = (value , flag) => {
    return value === 0 ? <Icon onPress={() => this.changeFavorite(flag)}  name="ios-star-outline" size={25} color="#FF5733" style={styles.styleFavorite} /> : <Icon onPress={() => this.changeFavorite(flag)} name="ios-star" size={25} color="#FF5733" style={styles.styleFavorite} />;
  };

  changeFavorite = (flag) => {
    if (flag === 'phone'){
      if (this.state.phone !== ''){
        this.state.favoritePhone === 0 ? this.setState({favoritePhone : 1}) : this.setState({favoritePhone : 0});
      } else {
        alert('Please fill your phone.');
      }
    }
    else if (flag === 'mobile'){
      if (this.state.mobile !== ''){
        this.state.favoriteMobile === 0 ? this.setState({favoriteMobile : 1}) : this.setState({favoriteMobile : 0});
      } else {
        alert('Please fill your mobile.');
      }
    }
    else if (flag === 'work'){
      if (this.state.work !== ''){
        this.state.favoriteWork === 0 ? this.setState({favoriteWork : 1}) : this.setState({favoriteWork : 0});
      } else {
        alert('Please fill your work.');
      }
    }
  };

  phoneConcat = (value) => {
    this.setState({phone:value});
    if (value === ''){
      this.setState({favoritePhone : 0});
    }
  };

  mobileConcat = (value) => {
    this.setState({mobile:value});
    if (value === ''){
      this.setState({favoriteMobile : 0});
    }
  };

  workConcat = (value) => {
    this.setState({work:value});
    if (value === ''){
      this.setState({favoriteWork : 0});
    }
  };

  layout = e => {
    this.setState({height: e.nativeEvent.layout.height});
  };

  showAlert = () => {
    Alert.alert('Delete image', 'Are you sure for delete image ?', [
      {text: 'Ok', onPress: () => this.setState({image: null})},
      {text: 'Cancel'},
    ]);
  };

  alertDeleteContact = () =>{
    Alert.alert('Delete contact' , 'Are you sure for delete contact ? ', [
    {text : 'Ok' , onPress: () => this.deleteContact()},
    {text : 'Cancel'},
    ]);
  }

  deleteContact = () => {
    let db = SQLite.openDatabase({name : 'database' , createFromLocation : '~database.db'});
    db.transaction( txn => {
      txn.executeSql('DELETE FROM contacts WHERE id=?',[this.state.id], (tx , res) =>{
        global.initialize = true;
        this.props.navigation.navigate('Contacts' , {index : this.state.index});
      });
    });
  }

  selectImage = async () => {
    let options = null;
    if (this.state.image !== null) {
      options = {
        title: 'Select image',
        customButtons: [{name: 'delete', title: 'delete image ...'}],
      };
    } else {
      options = {
        title: 'Select image',
      };
    }
    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton === 'delete') {
        this.showAlert();
      } else {
        this.setState({
          image: response.uri,
        });
      }
    });
  };

  editInformation = () => {
    if ( (this.state.name !== '' || this.state.family !== '') && (this.state.phone !== '' || this.state.mobile !== '' || this.state.work !== '' ) ) {
      let db = SQLite.openDatabase({
        name: 'database',
        createFromLocation: '~database.db',
      });
      db.transaction(txn => {
        txn.executeSql(
          'UPDATE contacts SET name=? , family=? , phone=? , mobile=? , work=? , favoritePhone=? , favoriteMobile=? , favoriteWork=? , image=? , fullName=? WHERE id=? ',
          [
            this.state.name,
            this.state.family,
            this.state.phone,
            this.state.mobile,
            this.state.work,
            this.state.favoritePhone,
            this.state.favoriteMobile,
            this.state.favoriteWork,
            this.state.image,
            this.state.fullName,
            this.state.id,
          ],
          (tx, res) => {
            global.initialize = true;
            this.props.navigation.navigate('Contacts');
          },
        );
      });
    } else {
      alert('Please insert name or family and phone');
    }
  };

  render() {
    const {
      styleEditContent,
      stylePhoto,
      photo,
      styleImage,
      textUserImage,
      textUser,
      styleDetails,
      subject,
      textInput,
      deleteButton,
      styleDeleteButton,
      textInputPhone,
    } = styles;

    const interpolateTranslatePhoto = this.state.scrollY.interpolate({
      inputRange: [0, 75],
      outputRange: [0, -55],
      extrapolate: 'clamp',
    });

    const interpolateTranslateY = this.state.scrollY.interpolate({
      inputRange: [0, 75],
      outputRange: [15, 40],
      extrapolate: 'clamp',
    });

    const interpolateScale = this.state.scrollY.interpolate({
      inputRange: [0, 75],
      outputRange: [1, 0.6],
      extrapolate: 'clamp',
    });

    return (
      <View style={{flex: 1}}>
        <Header
          navigation={this.props.navigation}
          iconLeft="md-arrow-back"
          title=""
          displayIconRight="none"
          displayIconLeft="flex"
          iconRight="md-add"
          disable={this.state.disable}
          nameRight="Save"
          colorText="#fff"
          update={this.editInformation}
        />

        <View style={styleEditContent}>
          <Animated.View
            onLayout={e => this.layout(e)}
            style={[
              stylePhoto,
              {transform: [{translateY: interpolateTranslatePhoto}]},
            ]}>
            <Animated.View
              style={[
                photo,
                {
                  transform: [
                    {
                      translateY: interpolateTranslateY,
                      scale: interpolateScale,
                    },
                  ],
                },
              ]}>
              <Image
                source={{uri: this.state.image}}
                resizeMode="cover"
                style={styleImage}
              />
              <Text style={textUserImage}>
                {this.state.letterFirstName}
                {this.state.letterLastName}
              </Text>
            </Animated.View>
            <TouchableOpacity onPress={() => this.selectImage()}>
              <Animated.Text
                style={[textUser, {transform: [{scale: interpolateScale}]}]}>
                Edit photo
              </Animated.Text>
            </TouchableOpacity>
          </Animated.View>
          <Animated.ScrollView
            style={styleDetails}
            contentContainerStyle={{paddingTop: this.state.height + 15}}
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
            <View>
              <Text style={subject}>Name</Text>
              <TextInput
                placeholder="Name"
                value={this.state.name}
                onChangeText={value =>
                  this.setState({
                    name: value,
                    letterFirstName: value.charAt(0).toUpperCase(),
                    fullName: value.toUpperCase().replace(/\s+/g,'').concat(this.state.family.toUpperCase().replace(/\s+/g,'')),
                  })
                }
                style={textInput}
              />
              <Text style={subject}>Family</Text>
              <TextInput
                placeholder="Family"
                value={this.state.family}
                onChangeText={value =>
                  this.setState({
                    family: value,
                    letterLastName: value.charAt(0).toUpperCase(),
                    fullName: this.state.name.toUpperCase().replace(/\s+/g,'').concat(value.toUpperCase().replace(/\s+/g,'')),
                  })
                }
                style={textInput}
              />
              <Text style={subject}>Phone</Text>
              <View style={{width:'90%',flexDirection:'row',alignSelf:'center',justifyContent:'space-between'}}>
              <TextInput
                placeholder="Phone"
                value={this.state.phone.toString()}
                onChangeText={value => this.phoneConcat(value)}
                style={textInputPhone}
                keyboardType="numeric"
              />
              {this.favoritePhone(this.state.favoritePhone , 'phone')}
              </View>

              <Text style={subject}>Mobile</Text>
              <View style={{width:'90%',flexDirection:'row',alignSelf:'center',justifyContent:'space-between'}}>
              <TextInput
                placeholder="Mobile"
                value={this.state.mobile.toString()}
                onChangeText={value => this.mobileConcat(value)}
                style={textInputPhone}
                keyboardType="numeric"
              />
              {this.favoritePhone(this.state.favoriteMobile , 'mobile')}
              </View>

              <Text style={subject}>Work</Text>
              <View style={{width:'90%',flexDirection:'row',alignSelf:'center',justifyContent:'space-between'}}>
              <TextInput
                placeholder="Work"
                value={this.state.work.toString()}
                onChangeText={value => this.workConcat(value)}
                style={textInputPhone}
                keyboardType="numeric"
              />
              {this.favoritePhone(this.state.favoriteWork , 'work')}
              </View>

              <TouchableOpacity activeOpacity={1} style={deleteButton} onPress={()=> this.alertDeleteContact()}>
                <Text style={styleDeleteButton}>Delete contact</Text>
              </TouchableOpacity>
            </View>
          </Animated.ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  styleEditContent: {
    flex: 1,
    marginTop: 65,
  },
  stylePhoto: {
    width: '100%',
    position: 'absolute',
    zIndex: 3,
    paddingBottom: 15,
    alignItems: 'center',
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
  styleImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
    position: 'absolute',
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
  styleDetails: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 2,
  },
  subject: {
    fontFamily: 'Ubuntu-Light',
    fontSize: 18,
    padding: 15,
  },
  textInput: {
    paddingLeft: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: '90%',
    alignSelf: 'center',
    fontFamily: 'Ubuntu-Light',
    fontSize: 15,
  },
  textInputPhone: {
    paddingLeft: '5%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    justifyContent:'flex-start',
    width: '90%',
    fontFamily: 'Ubuntu-Light',
    fontSize: 15,
  },
  styleFavorite: {
    alignSelf: 'center',
  },
  deleteButton: {
    borderRadius: 3,
    backgroundColor: 'red',
    padding: 15,
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
    alignSelf: 'center',
  },
  styleDeleteButton: {
    color: '#fff',
    fontFamily: 'Ubuntu-Light',
    fontSize: 15,
  },
});

export {EditContact};
