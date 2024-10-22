/* eslint-disable prettier/prettier */
import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Animated, Easing, ImageBackground, Image } from 'react-native';
import { deviceHeight, deviceWidth } from '../styles/size';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the icon library you're using
import { appBackColor } from '../styles/colors';
// import sidebar_background from '../assets/images/sidebar/sidebar_background.jpg';
import {sidebar_background} from '../assets/images/sidebar';
import { appLogo } from '../assets/images/logo';


const SideBar = ({ isVisible, onClose, navigation }) => {
  const sidebarPosition = new Animated.Value(-300); // Initial position outside the left edge of the screen

  const slideInSidebar = () => {
    Animated.timing(sidebarPosition, {
      toValue: 0, // Slide the sidebar to the left edge of the screen
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const slideOutSidebar = () => {
    Animated.timing(sidebarPosition, {
      toValue: -300, // Slide the sidebar back outside the left edge of the screen
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(onClose); // Close the modal after animation completes
  };

  React.useEffect(() => {
    if (isVisible) {
      slideInSidebar();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  const handleNavigation = (goTo) => {
    if (goTo) {
      navigation.navigate(goTo);
    }
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={isVisible}
      onRequestClose={slideOutSidebar}
    >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalBackground} onPress={slideOutSidebar} />
          <Animated.View style={[styles.sidebar, { transform: [{ translateX: sidebarPosition }] }]}>
            <ImageBackground
              source={sidebar_background}
              style={styles.sidebarContainer}
              resizeMode="cover"
            >
              <Image source={appLogo}  style={styles.appLogo} />
              <TouchableOpacity style={styles.closeButton} onPress={slideOutSidebar}>
                <Icon name="times" size={20} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {slideOutSidebar(); navigation.navigate('home')}}  style={styles.menuItem}>
                <Text style={styles.menuText}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {slideOutSidebar(); navigation.navigate('Services');}} style={styles.menuItem}>
                <Text style={styles.menuText}>Services</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {slideOutSidebar(); navigation.navigate('HowItWork')}} style={styles.menuItem}>
                <Text style={styles.menuText}>How It Works</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {slideOutSidebar(); navigation.navigate('Membership')}} style={styles.menuItem}>
                <Text style={styles.menuText}>Membership Plan</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {slideOutSidebar(); navigation.navigate('ContactUs')}} style={styles.menuItem}>
                <Text style={styles.menuText}>Contact us</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {slideOutSidebar(); navigation.navigate('BecameFranchise')}} style={styles.menuItem}>
                <Text style={styles.menuText}>Become a Franchise</Text>
              </TouchableOpacity>
            </ImageBackground>
          </Animated.View>
        {/* </ImageBackground> */}
        </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',

  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    backgroundColor: appBackColor,
    width: '80%',
    height: '100%',
    paddingVertical: 20,
    paddingHorizontal: 10,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  menuText: {
    // color: 'black',
    fontSize: 16,
    color: '#1F1F1F',
    fontFamily: 'DMSans-Bold',
  },
  sidebarContainer: {
    height: deviceHeight*0.9
  },
  appLogo: {
    width: deviceWidth*0.5,
    objectFit:'contain',
    height: deviceHeight*0.2,
  }
});

export default SideBar;
