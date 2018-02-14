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
  TouchableOpacity,
  ImageBackground,
  Dimensions
} from 'react-native';

import Swiper from 'react-native-swiper';
import Navigator from "./react-native/Navigator";
const {width, height} = Dimensions.get('window');
import SplashScreen from "rn-splash-screen";

const RATIO_HEIGHT = height / 677;
const RATIO_WIDTH = width / 375;
const REMOVE_HEIGHT = 20 * RATIO_HEIGHT;

export default class App extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      time: '25:00'
    };
  }

  componentDidMount() {
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
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
        onMomentumScrollEnd={(evt) => {
          let contentOffsetY = evt.nativeEvent.contentOffset.y;
          this.setState({index: contentOffsetY / height})
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
      <View style={{height: height, width: width}}>
        {this._renderSwiper()}
        <Navigator title={data[this.state.index].title}/>

        <Text style={styles.time}>
          {this.state.time}
        </Text>
        <Text style={styles.alert}>
          {'翻转手机开始计时'}
        </Text>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
          }}
        >
          <Text>
            {'重置'}
          </Text>
        </TouchableOpacity>
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
  },
  time: {
    height: 80,
    position: 'absolute',
    bottom: 349 * RATIO_HEIGHT + REMOVE_HEIGHT,
    width: width - 120 * RATIO_WIDTH,
    left: 60 * RATIO_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 55,
    color: 'white',
    backgroundColor: 'transparent'
  },
  alert: {
    fontSize: 20,
    color: 'white',
    position: 'absolute',
    width: width - 180,
    left: 90,
    bottom: 300 * RATIO_HEIGHT + REMOVE_HEIGHT,
    backgroundColor: 'transparent',
    textAlign: 'center'
  },
  btn: {
    height: 75,
    width: 75,
    borderRadius: 75 / 2,
    backgroundColor: '#ffffff50',
    alignItems: 'center',
    justifyContent: 'center',
    position: "absolute",
    left: (width - 75) / 2,
    bottom: 200 * RATIO_HEIGHT +  REMOVE_HEIGHT
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
