/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Touchable, useWindowDimensions } from 'react-native';
import { deviceHeight, deviceWidth } from '../../styles/size';
import { featuredProduct } from '../../assets/images/home';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import { calendarBlueIcon } from '../../assets/icons';
import { getRequest } from '../../utils/api_call';
import { API_URL } from '../../constants/constant';
import RenderHtml from 'react-native-render-html';
import { TouchableOpacity } from 'react-native-gesture-handler';

function stripHtml(html) {
  return html.replace(/<\/?[^>]+(>|$)/g, "");
}

const BlogsSlider = ({ navigation }) => {
  const [blogsArr, setBlogsArr] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const { width } = useWindowDimensions();

  const truncateHtml = (htmlContent) => {
    const textContent = stripHtml(htmlContent);
    const maxLength = 50; // Max length of text content
    if (textContent.length <= maxLength) return { html: htmlContent }; // Return full content if within limit

    // Truncate and add ellipsis
    const truncatedText = textContent.substring(0, maxLength) + '...';
    return { html: `<p>${truncatedText}</p>` }; // You might want to handle HTML tags better
  };
  

  useEffect(() => {
    getAllBlogs();
  }, []);
  const getAllBlogs = async() => {
    const res = await getRequest('/api/Toys/GetAllBlogs');
    const resData = await res.json();
    setBlogsArr(resData?.data);
    // console.log("resData-------------",resData?.data[0]);
  }

  const handleBlogNavigation = (blogData) => {
    // console.log("blogData-------------",blogData);
    navigation.navigate('BlogDetails', {blogData});
  }

  const featuredProducts = [
    {
      id: 1,
      image: featuredProduct,
      date: '12 August, 2022 | 04:32 Am',
      title: 'How to engage kids at home?',
      desc: 'Toy rental for birthday party celebrating your kids birthday?',
    },
    {
      id: 2,
      image: featuredProduct,
      date: '12 August, 2022 | 04:32 Am',
      title: 'How to engage kids at home?',
      desc: 'Toy rental for birthday party celebrating your kids birthday?',
    },
  ];

  const renderFeaturedProduct = ({ item }) => {
    return (
      <View style={styles.featuredProductCard}>
        <TouchableOpacity onPress={() => handleBlogNavigation(item)}>
          <Image source={{uri: `${API_URL}${item.blogCoverImageUrl}`}} style={styles.productImage} />
          <View style={styles.dateContainer} >
            <Image source={calendarBlueIcon} style={{width:18, height:18}} />
            <Text style={styles.blogDate}>{item?.date}</Text>
          </View>
          <Text style={styles.blogTitle}>{item?.blogTitle}</Text>

          <RenderHtml
            contentWidth={width}
            source={truncateHtml(item.description)}
          />
        </TouchableOpacity>
        {/* <RenderHtml contentWidth={deviceWidth*0.8} source={largeHeadingSource} /> */}
        {/* <Text style={styles.blogDesc}>{item.description} </Text> */}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, marginBottom:40 }}>
      <Carousel
        data={blogsArr}
        renderItem={renderFeaturedProduct}
        sliderWidth={deviceWidth * 0.9}
        itemWidth={deviceWidth - 40}
        loop={true}
        autoplay={true}
        onSnapToItem={(index) => setActiveSlide(index)}
        contentContainerCustomStyle={{height: deviceHeight * 0.44}}
        autoplayInterval={3000}
      />
      {/* <Pagination
        dotsLength={blogsArr.length} // Specify the number of dots in the pagination
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
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
    featuredProductCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        overflow: 'hidden',
        display:'flex',
        justifyContent:'center',
        padding: 12,
        elevation: 2,
        shadowColor: '#171717',
      },
      productImage: {
        width: '100%',
        height: deviceHeight * 0.22,
        borderRadius:16,
        resizeMode: 'contain',
      },
      blogDate: {
        fontSize: 13,
        fontFamily:'DMSans-Regular',
        color:'#737373',
      },
      blogTitle: {
        fontSize: 16,
        color: '#1F1F1F',
        fontFamily: 'DMSans-Bold',
      },
      blogDesc: {
        fontSize: 14,
        fontFamily: 'DMSans-Regular',
        marginVertical: 10,
        color: '#545454',
      },
      dateContainer: {
        flexDirection: 'row',
        alignItems:'center',
        gap: 6,
        marginVertical: 10,
      }
});

export default BlogsSlider;