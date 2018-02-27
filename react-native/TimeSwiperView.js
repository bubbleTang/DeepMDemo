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
  PanResponder,
  Animated
} from 'react-native';

import Swiper from 'react-native-swiper';
import TimeSlider from "./TimeSlider";
const {width, height} = Dimensions.get('window');
const RATIO_WIDTH = width / 375;
const RATIO_HEIGHT = height / 677;
const REMOVE_HEIGHT = 20 * RATIO_HEIGHT;

const TIME_LIST = [null, 1 * 60, 10 * 60, 15 * 60, 20 * 60, 25 * 60, 30 * 60, null];

export default class TimeSwiperView extends Component {
  constructor(props) {
    super(props);
    this._panResponder = null;
    this.startTime = null;
    this.onPressing = false;
    this.state = {
      defaultIndex: 5,
      showTimeSwiper: false,
      hideText: false,

      panResponse: true,

      animatedTimeOpacity: new Animated.Value(1)
    };
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => this.state.panResponse,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => this.state.panResponse,

      onMoveShouldSetPanResponder: (evt, gestureState) => this.state.panResponse,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => this.state.panResponse,

      onPanResponderTerminationRequest: (evt, gestureState) => this.state.panResponse,
      onShouldBlockNativeResponder: (evt, gestureState) => this.state.panResponse,

      onPanResponderGrant: (evt, gestureState) => {
        // 按下
        this.onPressing = true;
        this.startTime = new Date();

        this.timer = setInterval(() => {

          if (this.onPressing === true && (Date.parse(new Date()) - Date.parse(this.startTime) >= 2000)) {
            console.log('按下两秒');
            this.startTime = null;
            this.setState({showTimeSwiper: true, panResponse: false});
            this.timer && clearInterval(this.timer)
          }

        }, 500);
      },
      onPanResponderRelease: (evt, gestureState) => {
        // 触摸停止
        this.onPressing = false;
      }
    });
  }

  componentWillUnmount() {
    this.timer && clearInterval(this.timer)
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.showTimeSwiper !== nextState.showTimeSwiper && nextState.showTimeSwiper === true) {
      this._timeSwiper && this._timeSwiper.show();
      Animated.timing(
        this.state.animatedTimeOpacity,
        {
          toValue: 0,
          duration: 250,
        }
      ).start(() => {
        this.setState({hideText: true})
      })
    }
    return true
  }

  _renderSwiper() {
    return (
      <TimeSlider
        ref={(view) => this._timeSwiper = view}
        timeArr={TIME_LIST}
        onTimeChange={this.props.onTimeChange}
        showTimeView={() => {
          this.setState({
            hideText: false,
            showTimeSwiper: false,
            panResponse: true
          });
          Animated.timing(
            this.state.animatedTimeOpacity,
            {
              toValue: 1,
              duration: 1000,
            }
          ).start()
        }}
      />
    )
  }

  render() {
    let {time} = this.props;
    return (
      <View
        style={styles.timeView}
        {...this._panResponder.panHandlers}
      >
        {this._renderSwiper()}
        {
          this.state.hideText ? null :
            <Animated.View style={[styles.subView, {opacity: this.state.animatedTimeOpacity}]}>
              <Text style={styles.time}>
                {
                  Math.floor(time / 60)
                  + ':'
                  + (Math.floor(time % 60) < 10 ? '0' + Math.floor(time % 60) : Math.floor(time % 60))
                }
              </Text>
            </Animated.View>
        }
      </View>
    )
  }
}

TimeSwiperView.propType = {};

TimeSwiperView.defaultProps = {};

let styles = StyleSheet.create({
  timeView: {
    height: 100,
    width: width,
    position: 'absolute',
    bottom: 340 * RATIO_HEIGHT + REMOVE_HEIGHT,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center'
  },
  subView: {
    marginTop: 6,
    height: 100 - 6,
    width: width / 3,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center'
  },
  time: {
    textAlign: 'center',
    fontSize: 42 * RATIO_WIDTH,
    color: 'white',
    backgroundColor: 'transparent'
  }
});