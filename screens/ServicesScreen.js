/* eslint-disable prettier/prettier */
import { View, Text, SafeAreaView, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react';
import { appBackColor } from '../styles/colors';
import AppTopBar from '../components/AppTopBar';
import { arrowIcon } from '../assets/images/services';
import CustomBottomTabBar from '../navigation/CustomBottomTabBar';
import GlobalMargin from '../components/GlobalMargin';
import AppTopBarWithLocation from '../components/AppTopBarWithLocation';
import { getRequest } from '../utils/api_call';
import { API_URL } from '../constants/constant';
import { deviceHeight, deviceWidth } from '../styles/size';
import { bagImage } from '../assets/images/home';

const ServicesScreen = ({navigation, route}) => {


  console.log('route------------------------------------', route?.params?.serviceId);


  const [services, setServices] = useState([]);



  const getServices = async () => {
    try {
      // const res = await getRequest('/api/Toys/GetCategoriesByService/2');
      const res = await getRequest('/api/Toys/GetServices');
      const resData = await res.json();
      console.log('getServicesData---------------------------------------', resData?.data[0]);
      setServices(resData?.data);
    } catch (err) {
      console.log('err', err);
    }
  };

  const handleNavigateToCategories =  (serviceId) => {
    navigation.navigate('Categories', {serviceId: serviceId});
  };


  useEffect(() => {
    getServices();
  }, [route?.params?.serviceId]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: appBackColor }} >
      <AppTopBarWithLocation showService={true} navigation={navigation} title={'Services'} />
      <ScrollView  contentContainerStyle={styles.container} >
        <GlobalMargin />
      <Text style={styles.title} >Services</Text>
      <View style={styles.cardSection} >
        {services?.map((item, id) => (
        <TouchableOpacity onPress={() => handleNavigateToCategories(item?.id)} key={id} style={[styles.cardLayout, (id + 1) % 2  === 0 && {marginTop:20}]}>
            <Image style={styles.cardImg} source={{uri: `${API_URL}${item?.coverImageUrl}`}} />
            <Image style={styles.arrowIcon} source={arrowIcon} />
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>{item?.servicesName?.substr(0, 17)}</Text>
            {/* <Text style={styles.cardDesc}>{item?.description?.substr(0, 17) + '...'}</Text> */}
          </View>

        </TouchableOpacity>))}
      </View>

      </ScrollView>
      <CustomBottomTabBar routeName={'services'} navigation={navigation} />
    </SafeAreaView>
  )
}

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
  },
  cardImg: {
    width: deviceWidth * 0.43,
    height: deviceWidth * 0.39,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FFF',
    resizeMode:'contain',
  },
  cardBody: {
    gap: 10,
    marginTop: 10,
  },
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
  arrowIcon: {
    position:'absolute',
    width: deviceWidth*0.12,
    height: deviceHeight*0.12,
    right:0,
    top:-20
  }
});


export default ServicesScreen;