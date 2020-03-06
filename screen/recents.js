import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Header} from '../components/index';

class Recents extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      backgroundColor: '#fff',
    };
  }

  render() {
    const {styleMain} = styles;
    return (
      <View style={styleMain}>
        <Header
          navigation={this.props.navigation}
          title="Recents"
          iconLeft="md-arrow-back"
          displayIconLeft="none"
          nameRight="Done"
          displayIconRight="none"
          iconRight="md-add"
          colorText={this.state.backgroundColor}
          update={this.SaveContact}
          disable={this.state.disable}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  styleMain: {
    flex: 1,
  },
});

export {Recents};
