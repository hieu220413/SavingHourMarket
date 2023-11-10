import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {BarChart, LineChart, PieChart} from 'react-native-gifted-charts';

const Chart = () => {
  const data = [
    {value: 15, label: 'Jan'},
    {value: 30, label: 'Feb'},
    {value: 23, label: 'Mar'},
    {value: 40, label: 'Apr'},
    {value: 16, label: 'May'},
    {value: 20, label: 'Jun'},
    {value: 90, label: 'Jul'},
    {value: 12, label: 'Aug'},
    {value: 37, label: 'Sep'},
    {value: 67, label: 'Oct'},
    {value: 29, label: 'Nov'},
    {value: 41, label: 'Dec'},
  ];
  return (
    <View style={{flex: 1}}>
      <BarChart
        data={data}
        spacing={10}
        barWidth={20}
        frontColor='red'
      />
    </View>
  );
};

export default Chart;

const styles = StyleSheet.create({});
