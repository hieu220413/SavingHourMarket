/* eslint-disable prettier/prettier */
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import React, { useRef, useEffect } from 'react';
import { COLORS, FONTS } from '../constants/theme';
import * as Animatable from 'react-native-animatable';

const TabIcon = (props) => {
  const { icon, display, accessibilityState, onPress } = props;
  const focused = accessibilityState.selected;
  const imageWidth = Dimensions.get('window').width * 0.055;
  const imageHeight = Dimensions.get('window').height * 0.05;
  const viewRef = useRef(null);
  const circleRef = useRef(null);
  const textRef = useRef(null);

  const animate1 = { 0: { scale: .5, translateY: 7 }, .92: { translateY: -18 }, 1: { scale: 1.2, translateY: -12 } }
  const animate2 = { 0: { scale: 1.2, translateY: -24 }, 1: { scale: 1, translateY: 7 } }

  const circle1 = { 0: { scale: 0 }, 0.3: { scale: .9 }, 0.5: { scale: .2 }, 0.8: { scale: .7 }, 1: { scale: 1 } }
  const circle2 = { 0: { scale: 1 }, 1: { scale: 0 } }
  useEffect(() => {
    if (focused) {
      viewRef.current.animate(animate1);
      circleRef.current.animate(circle1);
      textRef.current.transitionTo({ scale: 1 });
    } else {
      viewRef.current.animate(animate2);
      circleRef.current.animate(circle2);
      textRef.current.transitionTo({ scale: 0 });
    }
  }, [focused])

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={styles.container}>
      <Animatable.View
        ref={viewRef}
        duration={450}
        style={styles.container}>
        <View 
        style={{
          width:imageWidth*1.9,
          height:imageHeight+imageHeight*0.01,
          borderRadius: 100,
          borderWidth: 4,
          borderColor: COLORS.tabBackground,
          backgroundColor: focused ? COLORS.primary: COLORS.tabBackground,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Animatable.View
            ref={circleRef}
            style={styles.circle} />
          <Image
            source={icon}
            resizeMode="contain"
            style={{
              width: imageWidth,
              height: imageHeight,
              tintColor: focused ? '#fff' : COLORS.tabIcon,
            }}
          />
        </View>
        <Animatable.Text
          ref={textRef}
          style={styles.text}>
          {display}
        </Animatable.Text>
      </Animatable.View>
    </TouchableOpacity>

  );
};

export default TabIcon;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    height: 70,
    position: 'absolute',
    bottom: 16,
    right: 16,
    left: 16,
    borderRadius: 16,
  },

  circle: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 75,
  },
  text: {
    fontSize: 9,
    textAlign: 'center',
    color: COLORS.primary,
  }
})
