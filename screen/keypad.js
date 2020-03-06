/* eslint-disable prettier/prettier */
/* eslint-disable no-alert */
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import SQLite from 'react-native-sqlite-storage';
import call from 'react-native-phone-call';
let db = SQLite.openDatabase({
  name: 'database',
  createFromLocation: '~database.db',
});

let args = {
  number: '',
  prompt: false,
};

class Keypad extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      PhoneNumber: '',
      name: '',
      deleteIcon: false,
    };
  }

  call = () => {
    args.number = this.state.PhoneNumber;
    call(args).catch(console.error);
  };

  deletePhoneNumber = () => {
    this.setState({
      PhoneNumber: this.state.PhoneNumber.substring(
        0,
        this.state.PhoneNumber.length - 1,
      ),
    });

      db.transaction(txn => {
        txn.executeSql(
          'SELECT name , family FROM contacts WHERE phone=? OR mobile=? OR work=?',
          [
            this.state.PhoneNumber,
            this.state.PhoneNumber,
            this.state.PhoneNumber,
          ],
          (tx, res) => {
            if (res.rows.length > 0 && this.state.PhoneNumber !== '') {
              this.setState({
                name: res.rows.item(0).name.concat(' ' + res.rows.item(0).family),
              });
            } else {
              this.setState({name: ''});
            }
          },
        );
      });
  };

  searchContact = num => {
    this.setState({
      PhoneNumber: this.state.PhoneNumber.concat(num),
      deleteIcon: true,
    });

    db.transaction(txn => {
      txn.executeSql(
        'SELECT name , family FROM contacts WHERE phone=? OR mobile=? OR work=?',
        [
          this.state.PhoneNumber,
          this.state.PhoneNumber,
          this.state.PhoneNumber,
        ],
        (tx, res) => {
          if (res.rows.length > 0) {
            this.setState({
              name: res.rows.item(0).name.concat(' ' + res.rows.item(0).family),
            });
          } else {
            this.setState({name: ''});
          }
        },
      );
    });
  };

  render() {
    const {styleMain} = styles;
    return (
      <View style={styleMain}>
        <View style={styles.topView}>
          <Text style={styles.textPhone}>{this.state.PhoneNumber}</Text>
          <Text style={styles.textName}>{this.state.name}</Text>
        </View>

        <View style={styles.middle}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => this.searchContact(1)}
            style={styles.number}>
            <Text style={styles.textNumber}>1</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => this.searchContact(2)}
            style={styles.number}>
            <Text style={styles.textNumber}>2</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => this.searchContact(3)}
            style={styles.number}>
            <Text style={styles.textNumber}>3</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => this.searchContact(4)}
            style={styles.number}>
            <Text style={styles.textNumber}>4</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => this.searchContact(5)}
            style={styles.number}>
            <Text style={styles.textNumber}>5</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => this.searchContact(6)}
            style={styles.number}>
            <Text style={styles.textNumber}>6</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => this.searchContact(7)}
            style={styles.number}>
            <Text style={styles.textNumber}>7</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => this.searchContact(8)}
            style={styles.number}>
            <Text style={styles.textNumber}>8</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => this.searchContact(9)}
            style={styles.number}>
            <Text style={styles.textNumber}>9</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => this.searchContact('*')}
            style={styles.number}>
            <Text style={styles.textNumber}>*</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => this.searchContact(0)}
            style={styles.number}>
            <Text style={styles.textNumber}>0</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => this.searchContact('#')}
            style={styles.number}>
            <Text style={styles.textNumber}>#</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottom}>
          <View style={styles.iconCall}>
            <Icon
              name="md-call"
              color="#fff"
              size={35}
              onPress={() => this.call()}
            />
          </View>
          {this.state.deleteIcon && (
            <TouchableOpacity
              onPress={() => this.deletePhoneNumber()}
              style={[styles.iconDelete]}>
              <View style={styles.triangle} />
              <Icon
                name="md-close"
                color="#000"
                size={18}
                style={{left: 3, top: 1}}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  styleMain: {
    flex: 1,
    // backgroundColor: 'red',
    alignItems: 'center',
  },
  topView: {
    width: 285,
    marginTop: 10,
    padding: 15,
    // backgroundColor: 'green',
  },
  textPhone: {
    fontFamily: 'Ubuntu-Light',
    fontSize: 18,
    textAlign: 'center',
  },
  textName: {
    fontFamily: 'Ubuntu-Light',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  middle: {
    // backgroundColor: 'yellow',
    padding: 15,
    paddingTop: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 285,
    flexWrap: 'wrap',
  },
  number: {
    width: 65,
    height: 65,
    borderRadius: 65,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    marginTop: 15,
  },
  textNumber: {
    textAlign: 'center',
    fontFamily: 'Ubuntu-Light',
    fontSize: 18,
  },
  bottom: {
    width: 285,
    // backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 15,
  },
  iconCall: {
    width: 65,
    height: 65,
    borderRadius: 65,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3D9970',
  },
  iconDelete: {
    position: 'absolute',
    right: 25,
    top: '50%',
    backgroundColor: '#ccc',
    width: 20,
    height: 21.3,
  },
  triangle: {
    width: 0,
    position: 'absolute',
    right: 20,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: 11,
    borderBottomWidth: 11,
    borderTopWidth: 11,
    borderRightColor: '#ccc',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
  },
});

export {Keypad};
