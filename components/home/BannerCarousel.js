import React from 'react';
import { View, Text, Image, Dimensions, StyleSheet } from 'react-native';
import Carousel , { Pagination } from 'react-native-snap-carousel';
import { deviceHeight, deviceWidth } from '../../styles/size';
import { API_URL } from '../../constants/constant';
import RenderHtml from 'react-native-render-html';

const { width: screenWidth } = Dimensions.get('window');
const screenHeight = Dimensions.get('window').height;

const BannerCarousel = ({ bannerData }) => {
  // Render each item in the carousel
  const _renderItem = ({ item, index }) => {
    // console.log("ImageUrl========",index);
    // console.log("ImageUrl========",`${API_URL}/${item.mobileBannerImageUrl}`)
    const shortHeadingSource = { html: item.shortHeading };
    const largeHeadingSource = { html: item.largeHeading };

    return (
      <View key={index} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop:15 }}>
        {/* You might need to adjust the path to the image depending on where you're hosting them */}
        <Image source={{ uri: `${API_URL}/${item.mobileBannerImageUrl}` }} style={styles.image} resizeMode='contain' />
        {/* Using `dangerouslySetInnerHTML` equivalent in React Native to render HTML content */}
        {/* <RenderHtml contentWidth={screenWidth} source={shortHeadingSource} style={styles.text1} />
        <RenderHtml contentWidth={screenWidth} source={largeHeadingSource} /> */}
        {/* {item.price && <Text style={styles.text}>{item.price}</Text>} */}
      </View>
    );
  };

  return (
    <Carousel
      data={bannerData}
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
    width: screenWidth - 60, // Adjust based on your desired padding
    // height: 200,
    // height: screenHeight * 0.246,
    height: 180,
    // maxHeight:'20vh',
    borderRadius: 8
  },
  text: {
    marginVertical: 5, // Example styling for text
  },
  text1: {
    position:'absolute',
    marginTop:'10px'
  }
});

export default BannerCarousel;