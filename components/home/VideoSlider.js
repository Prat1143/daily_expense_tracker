/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { deviceWidth } from '../../styles/size'; // Assuming deviceWidth is correctly imported
import VideoPlayer from 'react-native-video-controls';
import YoutubePlayer from 'react-native-youtube-iframe';

const VideoSlider = () => {
  const videos = [
    { id: 1, title: 'Video 1', source: 'https://youtu.be/jGToEZuNF90?si=Kb-iJhH1DoDDqWSw' },
    // { id: 2, title: 'Video 2', source: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
  ];

  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.slide}>
        <TouchableOpacity
          onPress={() => setSelectedVideoIndex(index)}
          style={styles.videoContainer}
        >
          <YoutubePlayer
            height={300}
            play={false}
            videoId={'jGToEZuNF90'}
            // You can also include other props to customize the player
          />
          {/* <VideoPlayer
            // source={{uri: 'https://youtu.be/jGToEZuNF90?si=Kb-iJhH1DoDDqWSw'}}
            source={require('../../assets/videos/toyrent_junction_how_it_works..mp4')} 
            // navigator={data.navigator}
            paused
            disableVolume
            disableBack
            style={{ borderRadius:10 }}
          /> */}
        </TouchableOpacity> 
      </View>
    );
  };

  return (
    <View style={{ flex: 1, marginTop:20 }}>
      <Text style={styles.heading} > How it Work </Text>
      <Carousel
        data={videos}
        renderItem={renderItem}
        sliderWidth={deviceWidth}
        itemWidth={deviceWidth}
        onSnapToItem={(index) => setSelectedVideoIndex(index)}
      />

      {/* Radio Buttons */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
        {videos.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setSelectedVideoIndex(index)}
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: selectedVideoIndex === index ? '#B7EBFD' : '#66D2FB',
              marginHorizontal: 5,
            }}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'red',
  },
  videoContainer: {
    width: deviceWidth * 0.9, // Set the video container width to device width
    height: deviceWidth * 0.5625, // Assuming 16:9 aspect ratio (adjust as needed)
    // paddingHorizontal: 10,
    // marginRight: 40,
  },
  heading: {
    color: '#0C0C0C',
    fontFamily: 'DMSans-Bold',
    fontSize: 20,
    marginVertical: 10,
  },
});

export default VideoSlider;
