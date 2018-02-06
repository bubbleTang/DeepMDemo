/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  StatusBar,
  View,
  ImageBackground,
  Dimensions
} from 'react-native';

import Swiper from 'react-native-swiper';
import Navigator from "./react-native/Navigator";
const {width, height} = Dimensions.get('window');

export default class App extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  _renderSwiper() {
    return (
      <Swiper
        index={0}
        horizontal={false}
        loop={false}
        autoplay={false}
        bounces={false}
        removeClippedSubviews={false}
        scrollEnabled={true}
        dot={<View style={[{backgroundColor: 'white'}, styles.dot]}/>}
        activeDot={<View style={[{backgroundColor: '#BBBBBB'}, styles.dot]}/>}
        onMomentumScrollEnd={(e, state, context) => {
          console.log(e, state, context, '**********')
        }}
      >
        {
          data.map((data, index) =>
            <ImageBackground
              key={index}
              style={{height: height, width: width}}
              source={data.source}
            />
          )
        }
      </Swiper>
    )
  }

  render() {
    StatusBar.setBarStyle('light-content');
    return (
      <View style={{flex: 1}}>
        {this._renderSwiper()}
        <Navigator
        title="标题"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'pink'
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginRight: 17 / 2,
    marginTop: 25 / 2,
    marginBottom: 25 / 2,
  }
});

const data = [
  {
    source: require('./react-native/images/leaf.jpg'),
    title: '林'
  },
  {
    source: require('./react-native/images/rain.jpg'),
    title: '雨'
  },
  {
    source: require('./react-native/images/sea.jpg'),
    title: '海'
  },
  {
    source: require('./react-native/images/wind.jpg'),
    title: '风'
  },
];
