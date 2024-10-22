/* eslint-disable prettier/prettier */
import { View, Text, Image, StyleSheet, Touchable } from 'react-native';
import React from 'react';
import { deviceHeight, deviceWidth } from '../../styles/size';
import { featuredProduct } from '../../assets/images/home';
import Carousel from 'react-native-snap-carousel';
import { API_URL } from '../../constants/constant';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { getRequest, postRequest } from '../../utils/api_call';

const ProductsSection = ({productsData, navigation, setLoading}) => {
    // console.log("ProductsSection=============", productsData[0]);
    // const featuredProducts = [
    //     {
    //       id: 1,
    //       image: featuredProduct,
    //       name: 'Portable Cozy Playzone',
    //       category: 'Category 1',
    //       price: '$19.99',
    //     },
    //     {
    //       id: 2,
    //       image: featuredProduct,
    //       name: 'Whisper Rider ||',
    //       category: 'Category 2',
    //       price: '$29.99',
    //     },
    //     // Add more products as needed
    //   ];


  const renderFeaturedProduct = ({ item }) => (
    <TouchableOpacity onPress={()=>{
        setLoading(true);
        navigateToProductDetails(item);
      }} 
      style={styles.featuredProductCard}
    >
      <Image source={{uri: `${API_URL}/${item?.imageUrl}`}} style={styles.productImage} />
      <Text style={styles.productName}>{item.productName}</Text>
      {/* <Text style={styles.productCategory}>{item.category}</Text> */}
      <Text style={styles.productPrice}>{item.mrp}
        {/* <Text style={styles.productPriceDay} > /1 Days </Text>   */}
      </Text>
    </TouchableOpacity>
  );

  const navigateToProductDetails = async(item) => {
    console.log("item===============",item);
    console.log("serviceId===============",item?.serviceId);
    const res = await getRequest(`/api/Toys/GetItemDetails/${item?.id}/${item?.serviceId}/`);
    const resData = await res.json();

    if(resData.success == true) {
      setLoading(false);
      navigation.navigate('ProductDetails', {selectedProduct:resData?.data});
    }
  }

  return (
    <Carousel
    // data={featuredProducts}
    data={productsData}
    renderItem={renderFeaturedProduct}
    sliderWidth={deviceWidth * 0.9}
    itemWidth={deviceWidth - 90}
    loop={true}
    contentContainerCustomStyle={{height: deviceHeight * 0.39}}
    autoplay={true}
    autoplayInterval={3000}
  />
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
        width: "100%",
        height: deviceHeight * 0.22,
        borderRadius:16,
        resizeMode: 'cover',
        // backgroundColor: 'blue',
      },
      productName: {
        fontSize: 16,
        fontFamily:'DMSans-Semibold',
        marginTop: 10,
        color:'#1F1F1F',
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
});

export default ProductsSection;