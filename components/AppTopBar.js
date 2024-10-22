/* eslint-disable prettier/prettier */
import { View, Text, TouchableOpacity, StyleSheet, Image, Linking } from 'react-native';
import React from 'react';
import { arrowLeftIconBlack, callIconBlack } from '../assets/icons';
import { StatusBar } from 'react-native';
import { topBarBgImg } from '../assets/images/topbar';
import { deviceHeight, deviceWidth } from '../styles/size';
import DeliveryLocationModal from './DeliveryLocationModal';

const AppTopBar = ({ title, navigation }) => {
  const [deliveryModalVisible, setDeliveryModalVisible] = React.useState(false);


  const openDeliveryModal = () => {
    setDeliveryModalVisible(true);
  };

  const closeDeliveryModal = () => {
    setDeliveryModalVisible(false);
  };
  const goBack = () => {
    navigation.goBack();
  };

  const handleCall = () => {
    const url = `tel:8983900282`; // Replace 1234567890 with the phone number you want to call
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          console.log('Can\'t handle url: ' + url);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  }

  return (
    <View style={styles.container}>
      <Image source={topBarBgImg}  style={styles.bgImg} />
    <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
   <View style={styles.contentContainer} >
   <View style={styles.iconWithTextContainer}>
      <TouchableOpacity onPress={goBack} style={styles.iconContainer}>
        <Image source={arrowLeftIconBlack} style={styles.icon} />
      </TouchableOpacity>

      <TouchableOpacity onPress={openDeliveryModal} >
      <Text style={styles.title}>{title} </Text>
      </TouchableOpacity>
    </View>

    <TouchableOpacity onPress={handleCall} style={styles.iconContainer}>
      <Image source={callIconBlack} style={styles.icon} />
    </TouchableOpacity>
   </View>
   <DeliveryLocationModal closeModal={closeDeliveryModal} visible={deliveryModalVisible} />
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: deviceHeight * 0.145,
  },
  bgImg: {
    height: deviceHeight * 0.18,
    width: deviceWidth,
    position:'absolute',
    top: 0,
    zIndex: 10,
   },

  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    width:'100%',
    zIndex: 11,
    marginTop: 30,
  },
  iconWithTextContainer: {
    flexDirection:'row',
    alignItems: 'center',
    gap: 15,
  },
  iconContainer: {
    width: 42,
    height: 42,
    backgroundColor: '#FFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#171717',
  },
  icon: {
    width: 20,
    height: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: 'DMSans-Bold',
    color: '#0C0C0C',
    textTransform: 'capitalize',
  },
});

export default AppTopBar;
