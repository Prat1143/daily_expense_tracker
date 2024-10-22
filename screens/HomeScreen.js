/* eslint-disable prettier/prettier */
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, BackHandler, ImageBackground, ActivityIndicator, Linking, PermissionsAndroid, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native';
import { appBackColor } from '../styles/colors';
import { bagImage, bannerImage, eventsImage, kidWithBg, libraryImage, shapesImage, teddyImage, travelGearImage, trikesImage, reviewsPic, reviewsBg, featuredProduct, ratingImage, bg_1, bg_2, bg_3, our_services_bg } from '../assets/images/home';
import { deviceWidth, deviceHeight } from '../styles/size';
import Carousel from 'react-native-snap-carousel';
import CustomBottomTabBar from '../navigation/CustomBottomTabBar';
import GlobalMargin from '../components/GlobalMargin';
import VideoSlider from '../components/home/VideoSlider';
import TestimonialSlider from '../components/home/TestimonialSlider';
import BlogsSlider from '../components/home/BlogsSlider';
import ProductsSection from '../components/home/ProductsSection';
import InstaReelSlider from '../components/home/InstaReelSlider';
import AppTopBarWithLocation from '../components/AppTopBarWithLocation';
import { getRequest } from '../utils/api_call';
import { API_URL } from '../constants/constant';
import { useFocusEffect } from '@react-navigation/native';
import SideBar from '../components/SideBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BannerCarousel from '../components/home/BannerCarousel';
import OfferCarousel from '../components/home/OfferBannerSlider';
import { Rating } from 'react-native-ratings';
import Geolocation from 'react-native-geolocation-service';

const backgroundImages = [bg_1, bg_2, bg_3];

const HomeScreen = ({ navigation }) => {
  const offerBannerArr = [
    {
      id: 1,
      imageUrl: reviewsBg,
      title1: 'Elida Canosa',
      title2: '5 Days ago',
      rating: '5',
      content: 'Had a great experience with ToyRent Junction. Value for money.',
      additionalImage: reviewsPic,
    },
    {
      id: 2,
      imageUrl: reviewsBg,
      title1: 'Card 2',
      title2: '5 Days ago',
      rating: '5',
      content: 'Had a great experience with ToyRent Junction. Value for money.',
      additionalImage: reviewsPic,
    },
    {
      id: 3,
      imageUrl: reviewsBg,
      title1: 'Card 3',
      title2: '5 Days ago',
      rating: '5',
      content: 'Had a great experience with ToyRent Junction. Value for money.',
      additionalImage: reviewsPic,
    },
    // Add more items as needed
  ];
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getLoggedInUserData() {
      const userData = await AsyncStorage.getItem('userData');
      console.log('userData-----------------', userData);
    };
    getLoggedInUserData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const handleBackPress = () => {
        Alert.alert(
          'Exit App',
          'Do you want to exit?',
          [
            {
              text: 'No',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'Yes',
              onPress: () => BackHandler.exitApp(),
            },
          ],
          { cancelable: false }
        );
        return true; // Prevents the default back action
      };
      const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
      return () => {
        backHandler.remove();
      };
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading && <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      </View>}
      
      <ScrollView contentContainerStyle={styles.contentContainer} >
        <GlobalMargin />
      </ScrollView>
      <CustomBottomTabBar routeName={'home'} navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appBackColor,
  },
  contentContainer: {
    // paddingHorizontal: 20,
  },
  bannerImgContainer: {
    alignItems: 'center',
  },
  bannerImgfirstText: {
    color: '#FFECE0',
    fontFamily: 'DMSans-Regular',
    fontSize: 16,
    position: 'absolute',
    top: 13,
    zIndex: 1,
  },
  bannerImgSecondText: {
    color: '#FFF',
    fontFamily: 'DMSans-Bold',
    zIndex: 1,
    fontSize: 24,
    position: 'absolute',
    top: 40,
  },
  bannerImg: {
    // width: deviceWidth * 0.92,
    // height: 200,
    width: deviceWidth,
    height: deviceHeight * 0.29,
    borderRadius: 10,
  },
  sectionContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  sectionBannersContainer: {
    marginTop: 0,
  },
  titleContainer: {
    marginVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#0C0C0C',
    fontFamily: 'DMSans-Bold',
    fontSize: 20,
    textTransform: 'capitalize',
  },
  seeAllText: {
    color: '#EB5F0A',
    fontFamily: 'DMSans-Regular',
    textDecorationLine: 'underline',
  },
  servicesCardSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    rowGap: 10,
  },
  servicesCard: {
    // width: 100,
    // height: 103,
    width: deviceWidth * 0.28,
    height: deviceHeight * 0.15,
    borderRadius: 12,
    backgroundColor: '#FFF',
    elevation: 1,
    shadowColor: '#171717',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  sercicesCardImage: {
    width: deviceWidth * 0.14,
    height: deviceWidth * 0.14,
    resizeMode: 'center',
  },
  servicesCardText: {
    color: '#1F1F1F',
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'DMSans-Semibold',
    textTransform: 'capitalize',
  },
  librarySection: {
    flexDirection: 'row',
    // gap: 5,
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    rowGap: 15,
  },
  // libraryCard: {
  //   width: deviceWidth * 0.28,
  //   height: deviceHeight * 0.15,
  //   // width: 100,
  //   // height: 99,
  //   // backgroundColor:'#FFF2EA',
  //   borderRadius: 20,
  //   alignItems:'center',
  //   justifyContent:'center',
  // },
  // libraryCardImage: {
  //   width: deviceWidth * 0.23,
  //   height: deviceWidth * 0.206,
  // },
  libraryCard: {
    width: deviceWidth * 0.28,
    height: deviceHeight * 0.15,
    borderRadius: 20,
    alignItems: 'center', // This will center the category image horizontally
    justifyContent: 'center', // This will center the category image vertically
    overflow: 'hidden', // Ensure the images don't bleed outside the border radius
  },
  libraryCardImage: {
    ...StyleSheet.absoluteFillObject, // Make the background image fill the container
    width: '100%',
    height: '100%',
  },
  categoryImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  circleShape: {
    borderRadius: 100,
    backgroundColor: '#E0F7FF',
  },
  libraryCardText: {
    color: '#1F1F1F',
    textAlign: 'center',
    fontFamily: 'DMSans-SemiBold',
    fontSize: 14,
    textTransform: 'capitalize',
    marginVertical: 7,
  },
  eventSection: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
  },
  eventCard: {
    display: 'flex',
    backgroundColor: '#FFF',
    borderRadius: 16,
    width: '100%',
    elevation: 2,
    shadowColor: '#171717',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    gap: 20,
    justifyContent: 'flex-start',
    height: 90,
  },
  eventCardImg: {
    width: 66,
    height: 66,
    marginLeft: 5,
    borderRadius: 10,
  },
  eventCardText: {
    color: '#1F1F1F',
    fontFamily: 'DMSans-SemiBold',
    fontSize: 16,
  },
  travelSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    flexWrap: 'wrap',
    rowGap: 15,
  },
  travelCard: {
    borderRadius: 30,
    width: deviceWidth * 0.4,
  },
  travelCardImg: {
    width: deviceWidth * 0.4,
    height: deviceHeight * 0.15,
    // width: 152,
    // height: 125,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    resizeMode: 'contain'
  },
  travelCardBody: {
    backgroundColor: '#FFF',
    borderBottomEndRadius: 6,
    borderBottomStartRadius: 6,
    borderTopLeftRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 20,
    marginTop: -10,
    elevation: 3,
    shadowColor: '#171717',
  },
  travelCardTitle: {
    color: '#1F1F1F',
    fontFamily: 'DMSans-Bold',
    fontSize: 13,
    textTransform: 'capitalize',
  },
  reviewCard: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
    height: deviceHeight * 0.3,
    marginRight: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff', // Default background color
    height: 200, // Adjust the height as needed
  },
  reviewCardTitle1: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1F1F1F',
  },
  reviewCardTitle2: {
    fontSize: 14,
    marginBottom: 5,
    color: '#545454',
  },
  reviewCardContent: {
    fontSize: 14,
    marginBottom: 5,
    color: '#363636',
    padding: 20,
    paddingTop: 10
  },
  reviewProfilePic: {
    width: deviceWidth * 0.2,
    height: deviceHeight * 0.12,
    resizeMode: 'contain',
    position: 'absolute',
    top: 0,
  },
  carouselContainer: {
    height: deviceHeight * 0.36,
  },
  reviewBgImg: {
    width: deviceWidth,
    height: deviceHeight * 0.3,
    position: 'absolute',
  },
  reviewCardContentContainer: {
    padding: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  featuredProductCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    padding: 12,
    elevation: 2,
    shadowColor: '#171717',
  },
  productImage: {
    width: "100%",
    height: deviceHeight * 0.22,
    borderRadius: 16,
    resizeMode: 'cover',
    // backgroundColor: 'blue',
  },
  productName: {
    fontSize: 16,
    fontFamily: 'DMSans-Semibold',
    marginTop: 10,
    color: '#1F1F1F',
  },
  productCategory: {
    fontSize: 13,
    color: '#545454',
  },
  productPrice: {
    fontSize: 18,
    fontFamily: 'DMSans-Bold',
    marginVertical: 10,
    color: '#50BFE9',
  },
  productPriceDay: {
    color: '#7C8D94',
    fontFamily: 'DMSans-Regular',
    fontSize: 14,
  },
  dropdownContainer: {
    // Styles for the dropdown container
    padding: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#DDD',
    // borderRadius: 5,
    // width:deviceWidth*0.35,
    width: 200,
    zIndex: 9999,
    position: 'absolute',
    top: deviceHeight * 0.23,
    left: deviceWidth * 0.2,
    borderRadius: 20
  },
  dropdownItem: {
    // Styles for dropdown items
    paddingVertical: 10,
    paddingHorizontal: 15,
    color: "black"
  },
  triangleShape: {
    width: 0,
    height: 0,
    position: 'absolute',
    top: -15,
    // right: 10,
    left: 10,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 14,
    borderRightWidth: 14,
    borderBottomWidth: 24,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FFF',
  },
  loader: {
    position: 'fixed',
    zIndex: 9999,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: '100%'
  },
  loaderContainer: {
    position: 'absolute',
    zIndex: 9999,
    display: 'flex',
    height: '100%',
    width: '100%'
  },
  eventCardImage: {
    // ...StyleSheet.absoluteFillObject, // Make the background image fill the container
    // width: '100%',
    // height: '100%',
    // position:'absolute',
    ...StyleSheet.absoluteFillObject,
    left: 5,
    top: 5,
    width: 80,
    height: 80,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  cardImgBackground: {
    width: deviceWidth * 0.17, // Full width
    height: deviceWidth * 0.17, // Adjust height as per your design, this height is for the background image
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor:'red'
  },
});

export default HomeScreen;