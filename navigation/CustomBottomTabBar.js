/* eslint-disable prettier/prettier */
import { View, Text, Image, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { bottomBarBg } from '../assets/images/bottombar';
import { deviceHeight, deviceWidth } from '../styles/size';
import { AccountIcon, BottomHomeIcon, CartIcon, MenuActiveIcon, MenuIcon, ServicesActiveIcon, ServicesIcon } from '../assets/images/bottombar/icons';
import LinearGradient from 'react-native-linear-gradient';
import SideBar from '../components/SideBar';

const CustomBottomTabBar = ({navigation, route, routeName}) => {

  const handleNavigation = (goTo) => {
    if (goTo) {
      navigation.navigate(goTo);
    }
  };

  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };


  return (
    <View style={{paddingHorizontal: 20, height:deviceHeight * 0.066 }} >
      <ImageBackground source={bottomBarBg} style={styles.bottomBarImg}  />
      <TouchableOpacity onPress={() => handleNavigation('home')} style={styles.circleIconContainer}  >
        <LinearGradient
          colors={['#6BD3FB', '#50BFE9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.circleIcon}
          >
            <Image source={BottomHomeIcon} style={{width:25, height:25}}  />
        </LinearGradient>
      </TouchableOpacity>
      <View style={{flexDirection:'row', gap:25, alignItems:'center', justifyContent:'center', height: deviceHeight * 0.05}} >
        {/* <TouchableOpacity onPress={() => toggleSidebar()} style={styles.iconContainer} > */}
        <TouchableOpacity onPress={() => handleNavigation('MenuScreen')} style={styles.iconContainer} >
          <Image source={routeName === 'menu' ? MenuActiveIcon : MenuIcon} style={styles.iconStyle} />
          <Text style={routeName === 'menu' ? styles.iconLabelActive : styles.iconLabel} > Menu </Text>
        </TouchableOpacity>
        <TouchableOpacity  onPress={() => handleNavigation('Services')} style={[styles.iconContainer, {marginTop:4}]} >
          <Image source={routeName === 'services' ? ServicesActiveIcon : ServicesIcon} style={[styles.iconStyle, {height:20}]} />
          <Text style={routeName === 'services' ? styles.iconLabelActive : styles.iconLabel} > Services </Text>
        </TouchableOpacity>
        <TouchableOpacity  onPress={() => handleNavigation('home')} style={styles.iconContainer} >
          <Image  source={MenuIcon} style={[styles.iconStyle, {opacity:0}]} />
          <Text style={routeName === 'home' ? styles.iconLabelActive: styles.iconLabel} > Home </Text>
        </TouchableOpacity>
        <TouchableOpacity  onPress={() => handleNavigation('Account')} style={styles.iconContainer} >
          <Image source={AccountIcon} style={styles.iconStyle} />
          <Text style={styles.iconLabel} > Account </Text>
        </TouchableOpacity>
        <TouchableOpacity  onPress={() => handleNavigation('AddToCart')} style={styles.iconContainer} >
          <Image source={CartIcon} style={styles.iconStyle} />
          <Text style={styles.iconLabel} > Cart </Text>
        </TouchableOpacity>
      </View>
      <SideBar navigation={navigation} isVisible={sidebarVisible} onClose={toggleSidebar} />
    </View>
  )
}

const styles = StyleSheet.create({
  bottomBarImg: {
    width: deviceWidth,
    height: deviceHeight * 0.15,
    position: 'absolute',
    bottom: 0,
  },
  iconStyle: {
    width: 24,
    height: 24,
  },
  iconContainer: {
    // flexDirection:'row',
    flexDirection:'column',
    alignItems:'center',
    gap:4,
  },
  iconLabel: {
    color: '#777D7F',
    fontSize: 12,
    fontFamily: 'DMSans-Light',
  },
  iconLabelActive: {
    color: 'rgba(255, 161, 103, 1), rgba(235, 95, 10, 1)',
    fontSize: 12,
    fontFamily: 'DMSans-Medium',
  },
  circleIcon: {
    alignItems:'center',
    borderRadius:100,
    justifyContent:'center',
    padding: 20,
  },
  circleIconContainer: {
    position:'absolute',
    top: -78,
    // right: deviceWidth * 0.44,
    right: deviceWidth * 0.41,
  }
})

export default CustomBottomTabBar;