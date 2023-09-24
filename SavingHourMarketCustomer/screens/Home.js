import React from 'react';
import {Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

const Home = ({navigation}) => {
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Cart');
        }}>
        <Text>Cart</Text>
      </TouchableOpacity>
      <Text>Home</Text>
    </View>
  );
};

export default Home;
