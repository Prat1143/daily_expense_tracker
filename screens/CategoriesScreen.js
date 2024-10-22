/* eslint-disable prettier/prettier */
import { View, Text, SafeAreaView, ScrollView, StyleSheet, Image, TouchableOpacity, ImageBackground } from 'react-native'
import React, { useEffect, useState } from 'react';
import { appBackColor } from '../styles/colors';
import AppTopBar from '../components/AppTopBar';
import { summersImg } from '../assets/images/services';
import CustomBottomTabBar from '../navigation/CustomBottomTabBar';
import GlobalMargin from '../components/GlobalMargin';
import AppTopBarWithLocation from '../components/AppTopBarWithLocation';
import { getRequest } from '../utils/api_call';
import { API_URL } from '../constants/constant';
import { bg_1, bg_2, bg_3 } from '../assets/images/home';
import { arrowIcon } from '../assets/images/services';
import { deviceHeight, deviceWidth } from '../styles/size';

const CategoriesScreen = ({navigation, route}) => {
  console.log('route--------', route?.params?.serviceId);
  const [categoriesData, setCategoriesData] = useState([]);
  const backgroundImages = [bg_1, bg_2, bg_3];

  const getCategoriesByService = async (serviceId) => {
    try {
      const res = await getRequest(`/api/Toys/GetCategoriesByService/${serviceId}`);
      const resData = await res.json();
      console.log('getCategoriesByServiceData------', res.status, resData);
      setCategoriesData(resData?.data);
    } catch (err) {
      console.log('err', err);
    }
  };

  const navigateToProducts =  (serviceId, categoryId) => {
    navigation.navigate('Products', {serviceId: serviceId, categoryId: categoryId});
  };

  useEffect(() => {
    if (route?.params?.serviceId) {
      getCategoriesByService(route?.params?.serviceId);
    }
  }, [route?.params?.serviceId]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: appBackColor, }} >
      <AppTopBarWithLocation showService={true} navigation={navigation} title={'Services'} />
      <ScrollView  contentContainerStyle={styles.container} >
        <GlobalMargin />
      <Text style={styles.title} >Categories</Text>
      <View style={styles.cardSection} >
        {categoriesData?.map((item, id) => (
          // <TouchableOpacity onPress={() => navigateToProducts(item?.selectedServiceId, item?.id)} key={id} style={[styles.cardLayout, (id + 1) % 2  === 0 && {marginTop:20}]}>
          <TouchableOpacity onPress={() => navigateToProducts(item?.selectedServiceId, item?.id)} key={id} style={[styles.cardLayout, (id + 1) % 2  === 0 && {marginTop:20}]}>
            <View style={ styles.serviceCardImg }>
              <Image style={styles.cardImg} source={{uri: `${API_URL}${item?.categoryImageUrl}`}} />
              <Image style={styles.arrowIcon} source={arrowIcon} />
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{item?.categoryName?.substr(0, 17)}</Text>
              <Text style={styles.cardDesc}>{item?.description?.substr(0, 20)}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* {categoriesData.map((item, id) => (
          <TouchableOpacity 
            onPress={() => navigateToProducts(item.selectedServiceId, item.id)} 
            key={id} 
            style={[styles.cardLayout, (id + 1) % 2 === 0 && { marginTop: 20 }]}
          >
            <ImageBackground 
              source={backgroundImages[id % backgroundImages.length]} 
              style={styles.cardImgBackground}
              resizeMode='contain'
            >
              <Image style={styles.cardImg} source={{uri: `${API_URL}${item?.categoryImageUrl}`}} />
            </ImageBackground>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{item?.categoryName?.substr(0, 17)}</Text>
              <Text style={styles.cardDesc}>{item?.description?.substr(0, 20)}</Text>
            </View>
          </TouchableOpacity>
        ))} */}

        {/* {categoriesData.map((item, id) => (
          <TouchableOpacity 
            onPress={() => navigateToProducts(item.selectedServiceId, item.id)} 
            key={id} 
            style={[styles.cardLayout, (id + 1) % 2 === 0 && { marginTop: 20 }]}
          >
            <View style={styles.cardContainer}>
              <ImageBackground 
                source={backgroundImages[id % backgroundImages.length]} 
                style={styles.cardImgBackground}
                resizeMode='cover' // Change to 'cover' for a full background fill
              >
                <Image style={styles.cardImg} source={{uri: `${API_URL}${item?.categoryImageUrl}`}} />
              </ImageBackground>
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{item?.categoryName?.substr(0, 17)}</Text>
                <Text style={styles.cardDesc}>{item?.description?.substr(0, 20)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))} */}
      </View>

      </ScrollView>
      <CustomBottomTabBar routeName={'services'} navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: '#F9FDFF',
  },
  title: {
    color: '#0C0C0C',
    fontFamily: 'DMSans-Bold',
    fontSize: 24,
    fontStyle: 'normal',
  },
  cardSection: {
    flexDirection:'row',
    justifyContent:'space-between',
    flexWrap:'wrap',
    gap: 0,
    marginVertical: 20,
    marginBottom:80
  },
  // cardImg: {
  //   width: deviceWidth * 0.38,
  //   height: deviceWidth * 0.35,
  //   borderRadius: 16,
  //   // borderWidth: 1.5,
  //   // borderColor: '#FFF',
  //   resizeMode:'contain',
  // },
  // cardBody: {
  //   gap: 10,
  //   marginTop: 10,
  // },
  cardTitle: {
    color: '#1F1F1F',
    fontFamily: 'DMSans-Medium',
    textTransform:'capitalize',
    fontSize: 17,
  },
  cardDesc: {
    color: '#545454',
    fontFamily: 'DMSans-Regular',
    fontSize: 13,
  },
  // cardLayout: {
  //   width: deviceWidth * 0.40,
  //   height: deviceWidth * 0.40,
  //   borderRadius: 16,
  //   overflow: 'hidden',
  //   marginBottom: 20,
  // },
  // cardImgBackground: {
  //   flex: 1, // Fill the container
  //   justifyContent: 'center', // Center the children vertically
  //   alignItems: 'center', // Center the children horizontally
  //   width: deviceWidth * 0.40,
  //   height: deviceWidth * 0.40,
  // },
  // cardImg: {
  //   width: deviceWidth * 0.25, // Make the category image smaller than the card
  //   height: deviceWidth * 0.25, // Adjust height accordingly
  //   resizeMode: 'contain', // Ensure the image fits within these dimensions
  // },
  // cardBody: {
  //   // gap: 10,
  //   marginTop: 10,
  //   alignItems: 'center',
  // },


  cardLayout: {
    width: deviceWidth * 0.40, // Adjust width as per your design
    marginBottom: 20, // Keep consistent margin
    borderRadius: 16, // Apply border radius to the container
    overflow: 'hidden', // Hide overflow content
  },
  cardContainer: {
    borderRadius: 16, // Apply the same borderRadius here for consistency
  },
  cardImgBackground: {
    width: '100%', // Full width
    height: deviceWidth * 0.40, // Adjust height as per your design, this height is for the background image
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImg: {
    width: deviceWidth * 0.35, // Smaller than the card for the category image
    height: deviceWidth * 0.35, // Adjust height accordingly
    resizeMode: 'contain',
  },
  cardBody: {
    marginTop: 10, // Adjust spacing as needed
    alignItems: 'center', // Center content
  },
  arrowIcon: {
    position:'absolute',
    width: deviceWidth*0.12,
    height: deviceHeight*0.12,
    right:0,
    top:-20
  },
  cardLayout:{
    
  },
  serviceCardImg: {
    backgroundColor:'red',
    // width:deviceWidth*.42,
    // height:deviceWidth*.4,
    display:'flex',
    alignItems:'center',
    // backgroundColor:'red',
    backgroundColor:'#ffffff',
    padding:10,
    borderRadius:8,
  }
});


export default CategoriesScreen;