/* eslint-disable prettier/prettier */
import { View, Text } from 'react-native'
import React from 'react'
import { deviceHeight, globalViewHeight } from '../styles/size';

const GlobalMargin = () => {
  return (
    <View style={{height: deviceHeight * 0.04}} />
  );
};

export default GlobalMargin;