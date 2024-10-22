/* eslint-disable prettier/prettier */
import { View, Text, Image, StyleSheet, Linking } from 'react-native';
import React, { useEffect, useState } from 'react';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import { deviceHeight, deviceWidth } from '../../styles/size';
import { babyOneImage, babyTwoImage } from '../../assets/images/home';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { getRequest } from '../../utils/api_call';
import { API_URL } from '../../constants/constant';
import { insta_icon } from '../../assets/images/home';

const InstaReelSlider = () => {
  const [reelData, setReelData] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    getAllInstaPosts();
  }, []);

  const getAllInstaPosts = async() => {
    const res = await getRequest('/api/Toys/GetAllInstaPosts');
    const resData = await res.json();
    if(resData?.success == true) {
      setReelData(resData?.data);
    }
  }

  const handleInstaRedirect = (itemData) => {
    Linking.openURL(itemData?.instagramPostUrl);
  }

  // const renderReelContent = ({ item }) => (
  //   <TouchableOpacity onPress={() => handleInstaRedirect(item)} style={styles.imageContainer}>
  //     <Image source={{uri: `${API_URL}${item.instagramCoverImageUrl}`}} style={styles.reelImage} />
  //   </TouchableOpacity>
  // );

  const renderReelContent = ({ item }) => (
    <TouchableOpacity onPress={() => handleInstaRedirect(item)} style={styles.imageContainer}>
      <Image source={{uri: `${API_URL}${item.instagramCoverImageUrl}`}} style={styles.reelImage} />
      <View style={styles.overlay}>
        <View style={styles.iconBackground}>
          <Image source={insta_icon} style={styles.instagramIcon} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{display:'flex'}}>
      <Carousel
        data={reelData}
        renderItem={renderReelContent}
        sliderWidth={deviceWidth * 0.9}
        itemWidth={deviceWidth * 0.45}
        loop={true}
        onSnapToItem={(index) => setActiveSlide(index)}
        // contentContainerCustomStyle={{height: deviceHeight * 0.39}}
        autoplay={true}
        autoplayInterval={3000}
      />
      <Pagination
        dotsLength={reelData.length} // Specify the number of dots in the pagination
        activeDotIndex={activeSlide}
        containerStyle={{ backgroundColor: 'transparent' }} // Style as needed
        dotStyle={{
            width: 10,
            height: 10,
            borderRadius: 5,
            marginHorizontal: 8,
            backgroundColor: '#50BFE9' // Customize as needed
        }}
        inactiveDotStyle={{
            // Define styles for inactive dots here
            backgroundColor: 'rgba(0, 0, 0, 0.3)' // Customize as needed
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    reelImage: {
        width: deviceWidth * 0.42,
        height: deviceWidth * 0.45,
        borderRadius: 8
    },
    overlay: {
      position: 'absolute',
      width: deviceWidth * 0.42,
      height: deviceWidth * 0.45,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.2)', // Adjust transparency as needed
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8, // Match the borderRadius of reelImage
    },
    iconBackground: {
      width: 50, // Adjust size as needed
      height: 50, // Adjust size as needed
      borderRadius: 25, // Half of width/height to make it circular
      backgroundColor: 'rgba(255, 255, 255, 0.5)', // Adjust for a blurred white background
      justifyContent: 'center',
      alignItems: 'center',
    },
    instagramIcon: {
      width: 30, // Adjust size as needed
      height: 30, // Adjust size as needed
    },
});

export default InstaReelSlider;