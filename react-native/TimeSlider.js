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
  ScrollView,
  Animated
} from 'react-native';

const {width, height} = Dimensions.get('window');
const RATIO_WIDTH = width / 375;
const SUB_WIDTH = width / 3;

export default class TimeSlider extends Component {
  constructor(props) {
    super(props);
    this._scrollView = null;
    this.state = {
      arrIndex: 5,
      animatedOpacity: new Animated.Value(0),
      onResponse: false
    };
  }

  componentDidMount() {
    this._scrollView && this._scrollView.scrollTo({x: 4 * SUB_WIDTH, y: 0, animated: false});
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
  }

  show() {
    Animated.timing(
      this.state.animatedOpacity,
      {
        toValue: 1,
        duration: 250,
      }
    ).start()
  }

  hide()  {
    this.props.showTimeView();
    Animated.timing(
      this.state.animatedOpacity,
      {
        toValue: 0,
        duration: 1000,
      }
    ).start()
  }

  render() {
    let {timeArr} = this.props;
    return (
      <Animated.View style={[styles.container, {opacity: this.state.animatedOpacity}]}>
        <ScrollView
          ref={(view) => this._scrollView = view}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          onResponderGrant={() => this.timer && clearTimeout(this.timer)}
          onScrollEndDrag={(evt) => {
            let contentX = evt.nativeEvent.contentOffset.x;
            if (contentX < SUB_WIDTH / 2) {
              this.setState({arrIndex: 1});
              this._scrollView && this._scrollView.scrollTo({x: 0, y: 0, animated: true});
              this.props.onTimeChange(timeArr[1])

            } else if (contentX > timeArr.length * SUB_WIDTH - width - SUB_WIDTH / 2) {
              this.setState({arrIndex: 6});
              this._scrollView && this._scrollView.scrollToEnd();
              this.props.onTimeChange(timeArr[6]);

            } else {
              let index = Math.round(contentX / SUB_WIDTH);
              this.setState({arrIndex: index + 1});
              this._scrollView && this._scrollView.scrollTo({x: SUB_WIDTH * index, y: 0, animated: true});

              this.props.onTimeChange(timeArr[index + 1])

            }

            this.timer = setTimeout(() => {
              console.log('三秒钟没有操作回复原装');
              this.hide()
            }, 2000)
          }}
        >
          {
            timeArr.map((data, index) =>
              <View style={styles.subView} key={index}>
                <Text
                  style={[styles.time, {fontSize: this.state.arrIndex == index ? 42 * RATIO_WIDTH : 30 * RATIO_WIDTH}]}>
                  {
                    data ?
                      Math.floor(data / 60)
                      + ':'
                      + (Math.floor(data % 60) < 10 ? '0' + Math.floor(data % 60) : Math.floor(data % 60))
                      : ''
                  }
                </Text>
              </View>
            )
          }
        </ScrollView>
      </Animated.View>
    )
  }
}

TimeSlider.propType = {};

TimeSlider.defaultProps = {};

let styles = StyleSheet.create({
  container: {
    height: 100,
    width: width,
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#00000030',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 3,
    borderBottomWidth: 3,
    borderTopColor: 'rgb(180, 180, 180)',
    borderBottomColor: 'rgb(180, 180, 180)'
  },
  subView: {
    height: 100,
    width: width / 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  time: {
    textAlign: 'center',
    color: 'white',
    backgroundColor: 'transparent'
  }
});