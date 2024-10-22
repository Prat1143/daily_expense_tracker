/* eslint-disable prettier/prettier */
import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { reviewsBg, reviewsPic } from '../../assets/images/home';
import { deviceHeight, deviceWidth } from '../../styles/size';

const TestimonialSlider = () => {
  const data = [
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
  ];

  const renderItem = ({ item }) => {
    return (
      <View style={styles.reviewCard}>
        <Image source={item.imageUrl} style={styles.reviewBgImg} resizeMode="cover" />
        <Image source={item.additionalImage} style={styles.reviewProfilePic} />
        <View style={styles.reviewCardContentContainer}>
          <Text style={styles.reviewCardTitle1}>{item.title1}</Text>
          <Text style={styles.reviewCardTitle2}>{item.title2}</Text>
          <Text style={styles.reviewCardContent}>{item.content}</Text>
        </View>
      </View>
    );
  };

  const screenWidth = Dimensions.get('window').width;

  return (
    <Carousel
    data={data}
    renderItem={renderItem}
    sliderWidth={deviceWidth}
    itemWidth={deviceWidth}
    layout="default"
    loop={true}
    autoplay={true}
    autoplayInterval={5000}
    contentContainerCustomStyle={styles.carouselContainer}
    hasParallaxImages={true}
    />
  );
};

const styles = StyleSheet.create({
    reviewCard: {
        flex:1,
        borderRadius: 10,
        overflow: 'hidden',
        height: deviceHeight * 0.3,
        marginRight: 35,
        justifyContent:'center',
        alignItems:'center',
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
        color:'#545454',
      },
      reviewCardContent: {
        fontSize: 14,
        marginBottom: 5,
        color:'#363636',
        padding: 10,
      },
      reviewProfilePic: {
        width: deviceWidth * 0.2,
        height: deviceHeight * 0.12,
        resizeMode: 'cover',
        position:'absolute',
        top: 15,
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
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        marginTop: 50,
      },
});

export default TestimonialSlider;
