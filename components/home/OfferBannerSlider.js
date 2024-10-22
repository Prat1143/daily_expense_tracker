import React from 'react';
import { View, Text, Image, Dimensions, StyleSheet } from 'react-native';
import Carousel , { Pagination } from 'react-native-snap-carousel';
import { deviceHeight, deviceWidth } from '../../styles/size';
import { API_URL } from '../../constants/constant';
import RenderHtml from 'react-native-render-html';
import { banner_1, banner_2, banner_3 } from '../../assets/images/home';

const { width: screenWidth } = Dimensions.get('window');

const OfferCarousel = ({ bannerData }) => {
  // const backgroundImages = [{"img": banner_1}, {"img": banner_2}, {"img": banner_3}];
  const backgroundImages = [banner_1, banner_2, banner_3];
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  // Render each item in the carousel
  const _renderItem = ({ item, index }) => {
    return (
      <View key={index} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 0 }}>
        <Image source={item} style={styles.image} resizeMode='contain' />
      </View>
    );
  };

  return (
    <Carousel
      data={backgroundImages}
      renderItem={_renderItem}
      // sliderWidth={screenWidth}
      sliderWidth={screenWidth}
      itemWidth={screenWidth}
      activeSlideAlignment={'center'}
      firstItem={0}
      loop={true}
    />
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: screenWidth
  },
  image: {
    width: screenWidth - 10, 
    // height: screenWidth - 190,
    height: 300,
    // maxHeight:'20vh',
    borderRadius: 8
  },
  text: {
    marginVertical: 0, // Example styling for text
  },
  text1: {
    position:'absolute',
    marginTop:'10px'
  }
});

export default OfferCarousel;