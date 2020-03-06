/* eslint-disable prettier/prettier */
/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
} from 'react-native';
import {Header} from '../components/header';
import SQLite from 'react-native-sqlite-storage';
import Icon from 'react-native-vector-icons/Ionicons';

let db = SQLite.openDatabase({
  name: 'database',
  createFromLocation: '~database.db',
});

function renderImage(img) {
  const localImage = './user.png';
  return img !== null ? (
    <Image source={{uri: img}} style={styles.imageContact} resizeMode="cover" />
  ) : (
    <Image
      source={require(localImage)}
      style={styles.imageContact}
      resizeMode="cover"
    />
  );
}

class Favorites extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      disable: false,
      detailsOfFavorite: [],
      nameNumberFavorite: [],
      animatedValue: new Animated.Value(0),
      animatedRemove: new Animated.Value(-35),
      nameRight: 'Edit',
      iconLeft: 'md-add',
      displayIconLeft: 'flex',
      title: 'Favorite',
      update: this.editFavorite,
      itemDatabase: 0,
    };
  }

  doneFavorite = () => {
    this.setState({title: 'Favorite', nameRight: 'Edit', displayIconLeft: 'flex', update: this.editFavorite });
    Animated.parallel([
      Animated.timing(this.state.animatedValue , {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
        easing: Easing.quad,
      }),
      Animated.spring(this.state.animatedRemove , {
        toValue: -35,
        duration: 100,
        useNativeDriver: true,
        easing: Easing.quad,
      }),
    ]).start();
  };

  editFavorite = () => {
    this.setState({title: '', nameRight: 'Done', displayIconLeft: 'none', update: this.doneFavorite });
    Animated.parallel([
      Animated.timing(this.state.animatedValue , {
        toValue: 30,
        duration: 100,
        useNativeDriver: true,
        easing: Easing.quad,
      }),
      Animated.spring(this.state.animatedRemove , {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
        easing: Easing.quad,
      }),
    ]).start();
  };

  deleteFavorite = (idDatabase , indexArray) => {
    let name = '';
    const query = 'UPDATE contacts set favorite';
    name = query.concat(this.state.nameNumberFavorite[indexArray]).concat('=? WHERE id=?');
    db.transaction( txn => {
      txn.executeSql(name,[0,idDatabase],(tx,res)=>{
        this.setState({detailsOfFavorite:[],nameNumberFavorite:[],isLoading:true});
      });
      txn.executeSql(
        'SELECT * FROM contacts WHERE favoritePhone=? OR favoriteMobile=? OR favoriteWork=? ORDER BY fullName',
        [1, 1, 1],
        (tx,res) => {
          for (let i = 0; i < res.rows.length; i++) {
            if (res.rows.item(i).favoritePhone === 1) {
              this.state.detailsOfFavorite.push(res.rows.item(i));
              this.state.nameNumberFavorite.push('Phone');
            }
            if (res.rows.item(i).favoriteMobile === 1) {
              this.state.detailsOfFavorite.push(res.rows.item(i));
              this.state.nameNumberFavorite.push('Mobile');
            }
            if (res.rows.item(i).favoriteWork === 1) {
              this.state.detailsOfFavorite.push(res.rows.item(i));
              this.state.nameNumberFavorite.push('Work');
            }
          }
          this.setState({isLoading:false , animatedValue: new Animated.Value(30) , animatedRemove: new Animated.Value(10) });
        },
      );
    });
  };

  renderTextFavorite = (index) => {
    return <Text style={styles.favoriteText}>{this.state.nameNumberFavorite[index]}</Text>;
  };

  initialize = () => {
    this.setState({detailsOfFavorite: [],nameNumberFavorite:[]});
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * FROM contacts WHERE favoritePhone=? OR favoriteMobile=? OR favoriteWork=? ORDER BY fullName',
        [1, 1, 1],
        (tx, res) => {
          for (let i = 0; i < res.rows.length; i++) {
            if (res.rows.item(i).favoritePhone === 1) {
              this.state.detailsOfFavorite.push(res.rows.item(i));
              this.state.nameNumberFavorite.push('Phone');
            }
            if (res.rows.item(i).favoriteMobile === 1) {
              this.state.detailsOfFavorite.push(res.rows.item(i));
              this.state.nameNumberFavorite.push('Mobile');
            }
            if (res.rows.item(i).favoriteWork === 1) {
              this.state.detailsOfFavorite.push(res.rows.item(i));
              this.state.nameNumberFavorite.push('Work');
            }
          }
          this.setState({isLoading:false});
        },
      );
    });
  };

  UNSAFE_componentWillMount = () => {
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      this.initialize();
    });
  };

  componentWillUnMount = () => {
    this.focusListener.remove();
  };

  render() {

    const {styleMain} = styles;


    if (this.state.isLoading === true){
      return (
        <View style={styleMain}>
          <Header
            navigation={this.props.navigation}
            iconLeft={this.state.iconLeft}
            title={this.state.title}
            displayIconRight="none"
            displayIconLeft={this.state.displayIconLeft}
            iconRight="md-add"
            disable={this.state.disable}
            nameRight={this.state.nameRight}
            colorText="#fff"
            update={this.state.update}
          />
        </View>
      );
    } else {
      return (
        <View style={styleMain}>
          <Header
            navigation={this.props.navigation}
            iconLeft={this.state.iconLeft}
            title={this.state.title}
            displayIconRight="none"
            displayIconLeft={this.state.displayIconLeft}
            iconRight="md-add"
            disable={this.state.disable}
            nameRight={this.state.nameRight}
            colorText="#fff"
            update={this.state.update}
          />
          <View style={{flex: 1, marginTop: 65}}>
            <Animated.FlatList
              data={this.state.detailsOfFavorite}
              renderItem={({item, index}) => (
                <View style={{flex:1}}>
                <Animated.View style={{position:'absolute',zIndex:5,top:20,transform:[{translateX:this.state.animatedRemove}]}}>
                    <Icon name="ios-remove-circle" size={25} color="#FF5733" onPress={() =>this.deleteFavorite(item.id , index)} />
                </Animated.View>
                <TouchableOpacity
                  activeOpacity={1}
                  style={{
                    borderBottomColor: '#ccc',
                    borderBottomWidth: 1,
                    marginVertical: 4,
                    marginHorizontal: 12,
                    paddingVertical: 10,
                    flexDirection: 'row',
                    transform:[{translateX:this.state.animatedValue}],
                  }}>
                  <View style={{justifyContent: 'center'}}>
                    {renderImage(item.image)}
                  </View>
                  <View style={{justifyContent: 'space-between'}}>
                    <Text style={{fontFamily: 'Ubuntu-Light', fontSize: 15}}>
                      {item.name + ' '}
                      {item.family}
                    </Text>
                    {this.renderTextFavorite(index)}
                  </View>
                </TouchableOpacity>
                </View>
              )}
              keyExtractor={(item , index) => index.toString()}
            />
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  styleMain: {
    flex: 1,
  },
  imageContact: {
    width: 40,
    height: 40,
    borderRadius: 40,
    justifyContent: 'center',
    marginRight: 10,
  },
  favoriteText: {
    fontFamily: 'Ubuntu-Light',
    fontSize: 10,
  },
});

export {Favorites};
