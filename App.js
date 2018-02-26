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
  Dimensions,
  NativeModules,
  Vibration,
  NativeEventEmitter
} from 'react-native';

import Swiper from 'react-native-swiper';
import Navigator from "./react-native/Navigator";
const {width, height} = Dimensions.get('window');
import SplashScreen from "rn-splash-screen";
let CoreMotionManager = NativeModules.CoreMotionManager;
let Sound = require('react-native-sound');

const RATIO_HEIGHT = height / 677;
const RATIO_WIDTH = width / 375;
const REMOVE_HEIGHT = 20 * RATIO_HEIGHT;

export default class App extends Component<{}> {
  constructor(props) {
    super(props);
    this.faceStateDown = null;
    this.whoosh = null;
    this.srcName = null;
    this.state = {
      index: 0,
      time: 25 * 60,
      faceStateDown: this.faceStateDown
    };
  }

  componentWillMount() {
    if (Platform.OS === 'ios') {
      CoreMotionManager.startHandling();
      const coreMotionManagerModuleEvent = new NativeEventEmitter(CoreMotionManager);
      coreMotionManagerModuleEvent.addListener('FaceDown', (notification) => {
        if (this.faceStateDown === true) return;
        Vibration.vibrate([0, 1], false);
        this.faceStateDown = true;
        this.setState({faceStateDown: true});
        this._playMusic(data[this.state.index].music);
        this._cutDown();
      });
      coreMotionManagerModuleEvent.addListener('FaceUp', () => {
        if (this.faceStateDown === false) return;
        if (this.faceStateDown !== null) Vibration.vibrate([0, 1], false);
        this.faceStateDown = false;
        this.setState({faceStateDown: false});
        if (this.whoosh) this.whoosh.pause();
        this._stopCutDown()
      })

    }
  }

  componentDidMount() {
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);
  }

  _cutDown() {
    this.timer = setInterval(() =>  {
      this.setState({time: this.state.time - 1})
    }, 1000)
  }

  _stopCutDown() {
    this.timer && clearInterval(this.timer)
  }

  _playMusic(src) {

    if (this.srcName !== src) {

      this.srcName = src;
      this.whoosh && this.whoosh.release();

      this.whoosh = new Sound(this.srcName, Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log('音频加载失败', error);
          return;
        }
        console.log('duration in seconds: ' + this.whoosh.getDuration() + 'number of channels: ' + this.whoosh.getNumberOfChannels());
        this.whoosh.play((success) => {
          if (success) {
            console.log('播放成功');
          } else {
            console.log('播放错误');
            this.whoosh.reset();
          }
        });
      });

      return;
    }

    if (this.whoosh) {
      this.whoosh.play((success) => {
        if (success) {
          console.log('播放成功');
        } else {
          console.log('播放错误');
          this.whoosh.reset();
        }
      });
      return;
    }

    this.whoosh && this.whoosh.release();

    this.whoosh = new Sound(src, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('音频加载失败', error);
        return;
      }
      console.log('duration in seconds: ' + this.whoosh.getDuration() + 'number of channels: ' + this.whoosh.getNumberOfChannels());
      this.whoosh.play((success) => {
        if (success) {
          console.log('播放成功');
        } else {
          console.log('播放错误');
          this.whoosh.reset();
        }
      });
    });
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
        scrollEnabled={this.state.faceStateDown !== true}
        dot={<View style={[{backgroundColor: 'white'}, styles.dot]}/>}
        activeDot={<View style={[{backgroundColor: '#BBBBBB'}, styles.dot]}/>}
        onMomentumScrollEnd={(evt) => {
          let contentOffsetY = evt.nativeEvent.contentOffset.y;
          this.setState({index: contentOffsetY / height, time: 25 * 60});
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
          {Math.floor(this.state.time / 60) + ' : ' + (Math.floor(this.state.time % 60) < 10 ? '0' + Math.floor(this.state.time % 60) : Math.floor(this.state.time % 60))}
        </Text>
        <Text style={styles.alert}>
          {'翻转手机开始计时'}
        </Text>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {

            if (this.state.faceStateDown === true) return;

            this.setState({time: 25 * 60});
            this.whoosh && this.whoosh.release();
            this.srcName = null;
          }}
          activeOpacity={0.7}
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
    bottom: 200 * RATIO_HEIGHT + REMOVE_HEIGHT
  }
});

const data = [
  {
    source: require('./react-native/images/leaf.jpg'),
    title: '林',
    music: 'forest.mp3'
  },
  {
    source: require('./react-native/images/rain.png'),
    title: '雨',
    music: 'rain.wav'
  },
  {
    source: require('./react-native/images/sea.jpg'),
    title: '海',
    music: 'sea.wav'
  },
  {
    source: require('./react-native/images/wind.jpg'),
    title: '风',
    music: 'wind.mp3'
  },
];
