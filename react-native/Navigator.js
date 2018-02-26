'use strict';

import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  Platform,
  StatusBar,
  TouchableOpacity,
  InteractionManager,
  Dimensions,
  StyleSheet,
  AsyncStorage,
  NativeModules
} from 'react-native';

const {ToolManager} = NativeModules;


const {width, height} = Dimensions.get('window');
const RATIO_WIDTH = width / 375;
const isIphoneX = Platform.OS === 'ios' ? ToolManager.isIphoneX === 'true' : false;

export default class Navigator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mute: false
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {

    })
  }

  render() {
    return (
      <View style={styles.main}>
        <TouchableOpacity
          style={styles.item}
        >
          <Image style={styles.itemSource} source={require('./images/list.png')}/>
        </TouchableOpacity>
        <View style={styles.titleView}>
          <Text style={styles.title}>
            {this.props.title}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.item}
          onPress={() => {
            this.setState({mute: !this.state.mute});
            this.props.onMuteChange(!this.state.mute);
          }}
        >
          {
            this.state.mute ? <Image style={styles.itemSource} source={require('./images/mute.png')}/> :
              <Image style={styles.itemSource} source={require('./images/sound.png')}/>
          }
        </TouchableOpacity>
      </View>
    )
  }
}

Navigator.propType = {};

Navigator.defaultProps = {
  title: ''
};

let styles = StyleSheet.create({
  main: {
    paddingTop: Platform.OS === 'ios' ? (isIphoneX ? 44 : 20) : 0,
    height: Platform.OS === 'ios' ? (isIphoneX ? 88 : 64) : 56,
    width: width,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  item: {
    width: 70,
    height: Platform.OS === 'ios' ? 64 : 56,
    alignItems: 'center',
    justifyContent: 'center'
  },
  itemSource: {
    height: 24,
    width: 24,
    resizeMode: 'stretch'
  },
  titleView: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 17,
    color: 'white'
  }
});