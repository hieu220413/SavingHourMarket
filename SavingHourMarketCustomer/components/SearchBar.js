/* eslint-disable prettier/prettier */
import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
} from 'react-native';
import {COLORS, FONTS} from '../constants/theme';
import {icons} from '../constants';
import {useState} from 'react';

const SearchBar = () => {
  const [text, setText] = useState();

  const handleClearText = () => {
    setText('');
  };
  return (
    <View style={style.container}>
      <View style={style.wrapperSearch}>
        <Image resizeMode="center" style={style.icon} source={icons.search} />
      </View>
      <TextInput
        style={style.input}
        placeholder="Search"
        value={text}
        onChangeText={text => {
          setText(text);
        }}
      />
      <View style={style.clear}>
        <TouchableOpacity onPress={handleClearText}>
          <Image
            resizeMode="center"
            style={style.icon}
            source={icons.clearText}></Image>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    width: '80%',
    height: 45,
    borderRadius: 40,
    paddingLeft: 10,
    marginTop: 10,
    marginLeft: 20,
    marginBottom: 10,
    flexDirection: 'row',
  },
  input: {
    fontFamily: FONTS.fontFamily,
    fontSize: 16,
    flex: 1,
    // backgroundColor: 'green',
  },
  wrapperSearch: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    flex: 0.2,
    // backgroundColor: 'red',
  },
  icon: {
    width: 20,
    height: 20,
  },
  clear: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
    // backgroundColor: 'blue',
  },
});

export default SearchBar;
