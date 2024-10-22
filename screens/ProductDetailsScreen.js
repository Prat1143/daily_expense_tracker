/* eslint-disable prettier/prettier */
import { View, Text, StyleSheet, ScrollView, SafeAreaView, FlatList, Alert, Dimensions, ImageBackground } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { appBackColor } from '../styles/colors';
import Carousel from 'react-native-snap-carousel';
import { productDetailsBannerImage } from '../assets/images/product-details';
import { Image } from 'react-native';
import { deviceHeight, deviceWidth } from '../styles/size';
import { TouchableOpacity } from 'react-native';
import { arrowLeftIconBlack, arrowRightIcon, calendarBlueIcon, circleArrowDownIcon, circleArrowRightIcon, circleArrowUpIcon, documentBlueIcon, heartIcon, heartRedIcon, infoCircleRedIcon, locationIcon, bookIcon, hotItWorksIcon, deliveryInstructionsIcon } from '../assets/icons';
import LinearGradient from 'react-native-linear-gradient';
import { summersImg } from '../assets/images/services';
import { postRequest } from '../utils/api_call';
import { API_URL } from '../constants/constant';
import { getRequest } from '../utils/api_call';

const ProductDetailsScreen = ({navigation, route}) => {

    // console.log('ProductDetailsScreen----------------------------', route?.params?.selectedProduct?.orderedDates);
    const [productDetails, setProductDetails] = useState({});
    const [bannerImagesData, setBannerImagesData] = useState([]);
    const [similarProductsImagesData, setSimilarProductsImagesData] = useState([]);
    const [similarProductsData, setSimilarProductsData] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [bookingDate, setBookingData] = useState(0);
    const [selectedTenureData, setSelectedTenureData] = useState(null);
    const [productPackageDetails, setSetProductPackageDetails] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [bookedDates, setBookedDates] = useState([]);
    const scrollViewRef = useRef(null);
    const [bookingEndDate, setBookingEndDate] = useState(0);
    const [activeSlide, setActiveSlide] = useState(0);

    useEffect(()=> {
      // Set todays date
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];
      var formatted_Date = formatDate(today);
      setSelectedDate(formatted_Date);
      // console.log('formatted_Date-------------------------------------------', formatted_Date);
      // console.log('selectedProduct_packages-------------------------------------------', route?.params?.selectedProduct?.packages);
      // console.log('selectedProduct_packages-------------------------------------------', route?.params?.selectedProduct);

      setProductDetails(route?.params?.selectedProduct);
      setSetProductPackageDetails(route?.params?.selectedProduct?.packages);
      setSelectedTenureData(route?.params?.selectedProduct?.packages[route?.params?.selectedProduct?.packages?.length - 1]);
      // console.log('setSelectedTenureDataLength-------------------------------------------', route?.params?.selectedProduct?.packages?.length - 1);
      setActiveIndex(route?.params?.selectedProduct?.packages?.length - 1);
      
      // console.log('SelectedTenureData-------------------------------------------', route?.params?.selectedProduct?.packages[0]);
      // setBannerImagesData([`${API_URL}${route?.params?.selectedProduct?.imageUrl}`]);
    console.log('similarProducts========================================--------', route?.params?.selectedProduct?.similarProducts);
      setSimilarProductsImagesData(route?.params?.selectedProduct?.similarProducts);
      setBookedDates(route?.params?.selectedProduct?.orderedDates);
      const setBannerImagesArr = async() => {
        var imagesArr = [];
        if(route?.params?.selectedProduct?.productImagesUrl.length>0) {
          await route?.params?.selectedProduct?.productImagesUrl.map((val,idx)=>{
            let url = `${API_URL}${val}`;
            imagesArr.push({id:idx, image:url});
          });
          setBannerImagesData(imagesArr);
        }
      }
      setBannerImagesArr();
    }, [route?.params?.selectedProduct]);

    useEffect(() => {
      console.log("CHANGE====================",route?.params?.selectedProduct?.packages);
      // setSelectedTenureData(route?.params?.selectedProduct?.packages[0]);
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
      }
    }, [route?.params?.selectedProduct]);

    // const _renderItem = ({item, index}) => {
    //   return (
    //       <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    //           <Image source={{uri: item.image}} resizeMode="contain" style={{width: Dimensions.get('window').width, height: 200}} />
    //       </View>
    //   );
    // }

    const _renderItem = ({item, index}) => {
      const screenWidth = Dimensions.get('window').width;
      return (
        // Wrapper view with rounded bottom corners and overflow hidden to clip the child ImageBackground
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          width: screenWidth, // Ensure the wrapper View takes up the full width
          // height: 300, // Match the height of the ImageBackground
          borderBottomLeftRadius: 20, // Adjust the radius as needed
          borderBottomRightRadius: 20, // Adjust the radius as needed
          overflow: 'hidden', // This is crucial to make the borderRadius effect visible
        }}>
          <ImageBackground
            source={{ uri: item.image }}
            resizeMode="stretch"
            style={{
              width: screenWidth, // Ensure the ImageBackground takes up the full width of the wrapper View
              // height: 300, // This height should match the wrapper View's height
              height: deviceHeight *0.45, // This height should match the wrapper View's height
              marginTop:40,
              borderRadius:20
            }}
          >
            {/* Place any content you want on top of the background image here */}
          </ImageBackground>
        </View>
      );
    }

    const handleNavigation = (screenName) => {
      navigation.navigate(screenName);
    };

    const handleNavigationToProductDetails = async(itemData) => {
      const res = await getRequest(`/api/Toys/GetItemDetails/${itemData?.item?.id}/${itemData?.item?.serviceId}/`);
      const resData = await res.json();
      // console.log("resData----------",resData?.data);
      if(resData.success == true) {
        navigation.navigate('ProductDetails', {selectedProduct:resData?.data});
      }

      // navigation.navigate(screenName);
      // {selectedProduct:itemData?.item}
    };


    const handleNavigationToTenure = (tenureData) => {
      // console.log("ServiceId===========",route?.params?.selectedProduct?.serviceId);
      navigation.navigate('Tenure', {tenureData: selectedTenureData, productPackageDetails:productPackageDetails, activeIndex:activeIndex, bookingDate:selectedDate, serviceId:route?.params?.selectedProduct?.serviceId, productId:route?.params?.selectedProduct?.id, bookingEndDate:bookingEndDate });
    };

    // const bannerImagesData = [
    //     {
    //       id: 1,
    //       image: productDetailsBannerImage,
    //     },
    //     {
    //       id: 2,
    //       image: productDetailsBannerImage,
    //     },
    //     {
    //       id: 3,
    //       image: productDetailsBannerImage,
    //     },
    //     {
    //       id: 4,
    //       image: productDetailsBannerImage,
    //     },
    //   ];

      const goBack = () => {
        navigation.goBack();
      };

      // const renderBannerContent = ({ item }) => (
      //   <View style={styles.imageContainer}>
      //     <TouchableOpacity onPress={goBack}  style={styles.arrowIconContainer}>
      //         <Image source={arrowLeftIconBlack} style={styles.icon} />
      //     </TouchableOpacity>
      //     <TouchableOpacity  style={styles.heartIconContainer}>
      //         <Image source={heartRedIcon} style={styles.icon} />
      //     </TouchableOpacity>
      //     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      //         <Image source={{uri: item.image}} resizeMode="contain" style={{width: Dimensions.get('window').width, height: 200}} />
      //     </View>
      //     {/* <Image source={item?.image} style={styles.bannerImage} /> */}
      //   </View>
      // );

      const [isAccordionOpen1, setIsAccordionOpen1] = useState(false);
      const [isAccordionOpen2, setIsAccordionOpen2] = useState(false);
      const [isAccordionOpen3, setIsAccordionOpen3] = useState(false);
      const [isAccordionOpen4, setIsAccordionOpen4] = useState(false);

      const handleAccordionToggle = (accordion) => {
        if(accordion == 1) {
          setIsAccordionOpen1(!isAccordionOpen1);
        } else if(accordion == 2) {
          setIsAccordionOpen2(!isAccordionOpen2);
        } else if(accordion == 3) {
          setIsAccordionOpen3(!isAccordionOpen3);
        } else if(accordion == 4) {
          setIsAccordionOpen4(!isAccordionOpen4);
        }
      };

      const renderAccordionContent = (key) => (
        <View style={styles.accordionContentContainer}>
            <View style={[styles.triangleShape]} />
            <View style={styles.contentBody}>
              <Text>
                {key==1 ? productDetails?.description : key==2 ?  productDetails?.includedAndExcluded : key==3 ? productDetails?.howItWorks : key==4 ? productDetails?.deliveryInstructions : null}
              </Text>
            </View>
            {/* <View style={styles.contentBody}  >
            <Text style={styles.accordionStartText}>Contact No.</Text>
            <Text style={styles.accordionEndText}>+01 123 456 7890</Text>
            </View>
            <View style={styles.contentBody}  >
            <Text style={styles.accordionStartText}>Pickup & Drop Timing</Text>
            <Text style={styles.accordionEndText}>08:00 AM - 03:30 PM</Text>
            </View>
            <View style={styles.contentBody}  >
            <Text style={styles.accordionStartText}>Address</Text>
            <Text style={styles.accordionEndText}>123 New Street, New York</Text>
            </View>
            <View style={[styles.contentBody, styles.removeBottomBorder]}  >
            <Text style={styles.accordionStartText}>Serviceable Area</Text>
            <Text style={styles.accordionEndText}>Thane, Airoli, Vashi</Text>
            </View> */}
          </View>
      );

      const renderProductCard = (itemData) => {
        // console.log("itemData---------------",itemData)
        let url = `${API_URL}${itemData?.item?.imageUrl}`;
        return (
          <TouchableOpacity activeOpacity={0.9} onPress={() => handleNavigationToProductDetails(itemData)}  style={[styles.cardLayout]}>
           <View>
           <Image style={styles.cardImg} source={{ uri: url }} />
           {/* <Image style={styles.heart} source={heartIcon} /> */}
           </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">{itemData?.item?.productName}</Text>
              <View style={styles.descContainer} >
                 <View>
                  <Text style={itemData?.item?.price ? styles.descText : styles?.descTextWhite}>Rent</Text>
                  <Text style={itemData?.item?.price ? styles.textBlue : styles.whiteText} >₹{handlePrice(itemData?.item?.price)}</Text>
                </View>
                {/* <View>
                  <Text style={styles.descText}>{extractDays(itemData?.item?.price)} Days</Text>
                  <Text style={styles.textGrey}>₹1000</Text>
                </View> */}
                {
                  itemData?.item?.serviceId !== 2 && itemData?.item?.serviceId !== 3 && itemData?.item?.price ?
                  <View>
                    <Text style={styles.textRed}>(35% Off)</Text>
                    <Text style={styles.textRed}>Member</Text>
                  </View> : null
                }
              </View>
            </View>
          </TouchableOpacity>
        )
      };
  
  const handleTenureSelection = (tenureData, idx) =>{
    setActiveIndex(idx);
    setSelectedTenureData(tenureData);
    console.log("tenureData===========",tenureData);
  };

  const handleNavigateToCalendar = () => {
    navigation.navigate('Calendar', {
      onSelectDate: handleSelectDate,
      bookedDates:bookedDates
    });
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', options);
  }

  const convertDate = (dateString) => {
    // Parse the dateString to a Date object
    const date = new Date(dateString);
  
    // Use Intl.DateTimeFormat to format the date
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    }).format(date);
  
    return formattedDate;
  };

  const handleSelectDate = async(date) => {
    // console.log("date===================",date);
    var formattedDate = formatDate(date);
    var convertedDate = convertDate(date);
    setBookingEndDate(convertedDate);
    // console.log("formattedDate===================",formattedDate);
    // console.log("convertedDate===================",convertedDate);
    
    setSelectedDate(formattedDate);
    const payload = {
      ProductId: route?.params?.selectedProduct?.id,
      BookingStartDate: convertedDate,
      PackageId: selectedTenureData?.packageId
    }
    const res = await postRequest('/api/Toys/CompareDate', JSON.stringify(payload), 'POST');
    const resData = await res.json();
    console.log("handleSelectDate_resData=========", resData);
    if(resData?.success == true) {
      setBookingEndDate(resData?.data); 
    }
  };

  const renderPagination = () => {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'center', paddingVertical: 10 }}>
        {bannerImagesData.map((_, index) => (
          <View
            key={index}
            style={{
              height: 10,
              width: 10,
              borderRadius: 5,
              backgroundColor: activeSlide === index ? '#EB5F0A' : 'gray',
              marginHorizontal: 5,
            }}
          />
        ))}
      </View>
    );
  };

  const handlePrice = (price) => {
    try {
      // console.log("priceTextaaa================", price)
     const priceText = price.split('.')[0];
     return priceText;
    } catch (err) {
     console.log('err', err);
    }
  };

  const extractDays = (text) => {
    const regex = /(\d+)\s*Days/i;
    const match = text.match(regex);
    return match ? match[1] : null; // Returns the matched days or null if no match
  }

  return (
    <SafeAreaView style={styles.container} >
        <ScrollView  ref={scrollViewRef}>
          {/* <View style={[styles.imageContainer, {zIndex:0}]}> */}
            {/* <TouchableOpacity onPress={goBack}  style={styles.arrowIconContainer}>
                <Image source={arrowLeftIconBlack} style={styles.icon} />
            </TouchableOpacity> */}
            {/* <TouchableOpacity  style={styles.heartIconContainer}>
                <Image source={heartRedIcon} style={styles.icon} />
            </TouchableOpacity> */}
          {/* </View> */}
          {/* <Carousel
            data={imgArr}
            renderItem={renderBannerContent}
            sliderWidth={deviceWidth}
            itemWidth={deviceWidth}
            loop={true}
            contentContainerCustomStyle={{height: deviceHeight * 0.46}}
            autoplay={true}
            autoplayInterval={3000}
          /> */}
          {/* <View style={{ borderBottomEndRadius:20, borderBottomStartRadius:20 }}>
            <Carousel
              data={bannerImagesData}
              renderItem={_renderItem}
              // renderItem={renderBannerContent}
              sliderWidth={deviceWidth}
              itemWidth={deviceWidth}
              onSnapToItem={(index) => setActiveSlide(index)}
            />
            {renderPagination()}
          </View> */}

          <View style={{position: 'relative'}}> 
            <View style={{ borderBottomEndRadius:20, borderBottomStartRadius:20 }}>
              <Carousel
                data={bannerImagesData}
                renderItem={_renderItem}
                sliderWidth={deviceWidth}
                itemWidth={deviceWidth}
                onSnapToItem={(index) => setActiveSlide(index)}
              />
              {renderPagination()}
            </View>
            <View style={[styles.imageContainer, {position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1}]}>
               <TouchableOpacity onPress={goBack} style={styles.arrowIconContainer}>
                <Image source={arrowLeftIconBlack} style={styles.icon} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.topSectionContainer} >
            <View style={{width:'60%', gap:10}} >
              <Text style={styles.topTitle}  >{productDetails?.productName}</Text>
              <Text style={styles.topDay} > { selectedTenureData?.days } {selectedTenureData?.type == "Hours" ? "Hours"  : "Day"}  </Text>
              {/* <Text style={styles.topDay} > { productDetails?.mrp?.split("/")[1].trim() }</Text> */}
            </View>
            <View style={{gap:10}} >
              <Text style={styles.topDesc}  >Rent</Text>
              <Text style={styles.topPrice} > ₹{ selectedTenureData?.rent }</Text>
              {/* <Text style={styles.topPrice} > ₹{ productDetails?.mrp?.split("/")[0].trim() }</Text> */}
            </View>
          </View>

            {/* Tenure Card Section */}
            <View style={{paddingHorizontal:20}} >
              <View style={styles.tenureCard} >
                <Text style={styles.tenureTitle} >Tenure Available</Text>
                <View style={{gap:10}} >
                  <View style={styles.tenureBtnContainer}>
                    {route?.params?.selectedProduct?.packages?.map((val, idx) => (
                      <View key={idx} style={activeIndex === idx ? styles.tenureBtnAct : styles.tenureBtn}>
                        <TouchableOpacity
                          onPress={() => handleTenureSelection(val, idx)} // Set active index on press
                          style={{padding:'0px'}}
                        >
                          {activeIndex === idx ? (
                            <LinearGradient
                              colors={['#F57223', '#FE8E4B']}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                              style={styles.tenureBtnActive}
                            >
                              <Text style={styles.tenureTextAct}>{val?.days} {val?.type == "Hours" ? "Hours"  : "Day"}</Text>
                            </LinearGradient>
                          ) : (
                            <View style={styles.tenureBtnInactive}>
                              <Text style={styles.tenureText}>{val?.days} {val?.type == "Hours" ? "Hours"  : "Day"}</Text>
                            </View>
                          )}
                        </TouchableOpacity>
                      </View>
                    ))}
                    {/* {
                      route?.params?.selectedProduct?.packages?.map((val,idx)=>(
                        <View>
                          <TouchableOpacity style={styles.tenureBtn} >
                            <Text style={styles.tenureText}> 9 Month </Text>
                          </TouchableOpacity>
                        </View>
                      ))
                    } */}
                  </View>
                  
                {/* <View style={styles.tenureBtnContainer}>
                   <TouchableOpacity>
                    <LinearGradient
                        colors={['#F57223', '#FE8E4B']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.tenureBtnActive}
                      >
                      <Text style={styles.tenureTextActive}> 12 Month </Text>
                      </LinearGradient>
                   </TouchableOpacity>
                    <View style={styles.tenureBtn} >
                        <Text style={styles.tenureText}> 9 Month </Text>
                    </View>
                    <View style={styles.tenureBtn} >
                        <Text style={styles.tenureText}> 6 Month </Text>
                    </View>
                </View>

                <View style={styles.tenureBtnContainer}>
                    <View style={styles.tenureBtn} >
                        <Text style={styles.tenureText}> 3 Month </Text>
                    </View>
                    <View style={styles.tenureBtn} >
                        <Text style={styles.tenureText}> 2 Month </Text>
                    </View>
                    <View style={styles.tenureBtn} >
                        <Text style={styles.tenureText}> 1 Month </Text>
                    </View>
                </View> */}
              </View>
            </View>
            </View>
            {/* Tenure Card Section */}

            {/* Accordion Card Section */}

            <View style={styles.accordionContainer}>
              <TouchableOpacity
                  onPress={() => handleAccordionToggle(1)}
                  style={[styles.accordionHeader, { backgroundColor: isAccordionOpen1 ? '#F2F2F2' : '#FFF' }]}
              >
                <View style={styles.locationContainer}  >
                  <View style={styles.locationBox} >
                      <Image source={documentBlueIcon} style={styles.iconLocation} />
                  </View>
                  <Text style={styles.accordionCardtitle}>Product Details</Text>
                </View>
                <Image
                  source={isAccordionOpen1 ? circleArrowUpIcon : circleArrowRightIcon}
                  style={[styles.expandIcon]}
                />
              </TouchableOpacity>
              {isAccordionOpen1 && renderAccordionContent(1)}
            </View>

            <View style={styles.accordionContainer}>
              <TouchableOpacity
                  onPress={() => handleAccordionToggle(2)}
                  style={[styles.accordionHeader, { backgroundColor: isAccordionOpen2 ? '#F2F2F2' : '#FFF' }]}
              >
                <View style={styles.locationContainer}  >
                  <View style={styles.locationBox} >
                      <Image source={bookIcon} style={styles.iconLocation} />
                  </View>
                  <Text style={styles.accordionCardtitle}>Instructions</Text>
                </View>
                <Image
                  source={isAccordionOpen2 ? circleArrowUpIcon : circleArrowRightIcon}
                  style={[styles.expandIcon]}
                />
              </TouchableOpacity>
              {isAccordionOpen2 && renderAccordionContent(2)}
            </View>

            {/* How it Works */}
            <View style={styles.accordionContainer}>
              <TouchableOpacity
                  onPress={() => handleAccordionToggle(3)}
                  style={[styles.accordionHeader, { backgroundColor: isAccordionOpen3 ? '#F2F2F2' : '#FFF' }]}
              >
                <View style={styles.locationContainer}  >
                  <View style={styles.locationBox} >
                      <Image source={hotItWorksIcon} style={styles.iconLocation} />
                  </View>
                  <Text style={styles.accordionCardtitle}>How it Works</Text>
                </View>
                <Image
                  source={isAccordionOpen3 ? circleArrowUpIcon : circleArrowRightIcon}
                  style={[styles.expandIcon]}
                />
              </TouchableOpacity>
              {isAccordionOpen3 && renderAccordionContent(3)}
            </View>

            {/* Delivery Instructions */}
            <View style={styles.accordionContainer}>
              <TouchableOpacity
                  onPress={() => handleAccordionToggle(4)}
                  style={[styles.accordionHeader, { backgroundColor: isAccordionOpen4 ? '#F2F2F2' : '#FFF' }]}
              >
                <View style={styles.locationContainer}  >
                  <View style={styles.locationBox} >
                      <Image source={deliveryInstructionsIcon} style={styles.iconLocation} />
                  </View>
                  <Text style={styles.accordionCardtitle}>Delivery Instructions</Text>
                </View>
                <Image
                  source={isAccordionOpen4 ? circleArrowUpIcon : circleArrowRightIcon}
                  style={[styles.expandIcon]}
                />
              </TouchableOpacity>
              {isAccordionOpen4 && renderAccordionContent(4)}
            </View>

            {/* Product Card Carousel Section */}

            <View style={styles.titleContainer} >
              <Text style={styles.title} >You May Also Like</Text>
              {/* <TouchableOpacity onPress={() => navigation.navigate('Products', {serviceId: route?.params?.selectedProduct?.serviceId, categoryId: null, 
                productDataArr:similarProductsImagesData})}> */}
              <TouchableOpacity onPress={() => navigation.navigate('Products', {serviceId: route?.params?.selectedProduct?.serviceId, categoryId: route?.params?.selectedProduct?.categoryId})}>
                  <Text style={styles.seeAllText} >See all</Text>
              </TouchableOpacity>
            </View>
            
            <View style={{marginLeft:20}} >
              <FlatList
                data={similarProductsImagesData}
                renderItem={(itemData)=>renderProductCard(itemData)}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            </View>

            <View style={{paddingHorizontal:20}} >

            <View style={[styles.bookingDateCard]}>
              <Text style={styles.bookingStartText} >Rent For</Text>
              <View style={{flexDirection:'row', alignItems:'center', gap:3}}  >
              <View style={[styles.tenureBtn, {borderColor:'#EB5F0A'}]} >
                  <Text style={[styles.tenureText, {color:'#EB5F0A'}]}> { selectedTenureData?.days } {selectedTenureData?.type == "Hours" ? "Hours"  : "Day"} </Text>
              </View>
              </View>
            </View>

            <View style={[styles.bookingDateCard, {marginVertical: 20, flexDirection:'column', alignItems:'flex-start'}]}>
              <Text style={styles.bookingStartText} >Booking Date</Text>
              <TouchableOpacity onPress={()=> handleNavigateToCalendar()} style={{flexDirection:'row', alignItems:'center', gap:3}}  >
                <Image source={calendarBlueIcon} style={{width:22, height:22}} />
                <Text style={styles.bookingEndText} >{selectedDate} {bookingEndDate!='' && `- ${bookingEndDate}`}</Text>
              </TouchableOpacity>
            </View>
            </View>

            <View style={styles.bottomContentContainer}>
              <View style={styles.bottomTopContent} >
                <View style={{flexDirection:'row', alignItems:'center', gap: 4}} >
                <Text style={styles.bottomTopContentStartText} >Refundable Deposit</Text>
                <Image source={infoCircleRedIcon} style={{width: 18, height: 18}} />
                </View>
                <Text style={styles.bottomTopContentEndText} >₹{ selectedTenureData?.deposit }</Text>
              </View>
              {/* <TouchableOpacity  onPress={() => handleNavigation('AddToCart')}  > */}
              <TouchableOpacity  onPress={() => handleNavigationToTenure(selectedTenureData)}  >
              <LinearGradient
               colors={['#6BD3FB', '#50BFE9']}
               start={{ x: 0, y: 0 }}
               end={{ x: 1, y: 0 }}
               style={[styles.bottomTopContent, {borderTopLeftRadius: 20, borderTopRightRadius:20}]} >
                <View style={{flexDirection:'row', alignItems:'center', gap: 4}} >
                  <Text style={styles.bottomPriceText} >₹{ selectedTenureData?.rent }<Text style={styles.monthText} >/Day</Text></Text>
                </View>
                <View style={{flexDirection:'row', alignItems:'center',gap:3}} >
                  <Text style={styles.addToCartText} > Confirm Tenure </Text>
                  <Image source={arrowRightIcon} style={{width:20, height:20}}  />
                </View>
              </LinearGradient>
              </TouchableOpacity>
            </View>

        </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: appBackColor,
    },
    contentContainer: {
        paddingHorizontal: 20,
    },
    bannerImage: {
        width: deviceWidth,
        height: deviceHeight * 0.45,
        resizeMode:'cover',
    },
    imageContainer: {
      position:"relative",
      height:deviceHeight*0.15,
    },
    arrowIconContainer: {
        width: 42,
        height: 42,
        backgroundColor: '#FFF',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#171717',
        position:'absolute',
        zIndex: 11,
        top: 60,
        left: 20,
      },
      heartIconContainer: {
        width: 42,
        height: 42,
        backgroundColor: '#FFF',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#171717',
        position:'absolute',
        zIndex: 11,
        top: 60,
        right: 20,
      },
      icon: {
        width: 20,
        height: 20,
      },
      topSectionContainer: {
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        padding: 13,
        paddingHorizontal: 20,
      },
      topTitle: {
        color: '#1F1F1F',
        fontSize: 18,
        fontFamily: 'DMSans-Medium',
      },
      topDay: {
        color: '#545454',
        fontFamily: 'DMSans-Regular',
        fontSize: 16,
      },
      topDesc: {
        color: '#696969',
        fontFamily: 'DMSans-Regular',
        fontSize: 14,
        textAlign:'right',
      },
      topPrice: {
        color: '#50BFE9',
        fontFamily: 'DMSans-Bold',
        fontSize: 24,
      },
      tenureCard: {
        backgroundColor:'#FFF',
        elevation: 1,
        shadowColor: '#171717',
        padding: 10,
        borderRadius: 16,
        marginVertical:10,
        display:'flex',
      },
      tenureTitle: {
        color: '#1F1F1F',
        fontFamily: 'DMSans-Medium',
        fontSize: 16,
        marginVertical: 10,
      },
      tenureBtnContainer: {
        flexDirection:'row',
        alignItems:'center',
        // justifyContent:'space-between',
        gap:10,
        flexWrap:'wrap'
      },
      tenureBtnActive: {
        backgroundColor: '#F57223',
        borderRadius: 12,
        padding: 15,
      },
      tenureTextActive: {
        color: '#FFF',
        fontFamily: 'DMSans-Bold',
        fontSize: 13,
      },
      tenureBtn: {
        borderWidth: 1,
        borderColor:'#F3EAE4',
        borderRadius: 12,
        padding: 15,
        width:deviceWidth * 0.24
      },
      tenureBtnAct: {
        borderWidth: 1,
        borderColor:'#F3EAE4',
        borderRadius: 12,
        // padding: 15,
        width:deviceWidth * 0.24,
        color:"#FFFFFF"
      },
      tenureText: {
        color: '#454545',
        fontFamily: 'DMSans-Bold',
        fontSize: 13,
        textAlign:'center'
      },
      tenureTextAct: {
        color: '#ffffff',
        fontFamily: 'DMSans-Bold',
        fontSize: 13,
        textAlign:'center'
      },
      accordionContainer: {
        marginVertical: 5,
        paddingHorizontal: 20,
      },
      accordionHeader: {
        // Styles for the header of the accordion
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        paddingVertical: 10,
        borderRadius: 15,
        elevation: 2,
        shadowColor: '#0C0C0C',
        padding: 10,
      },
      expandIcon: {
        width: 24,
        height: 24,
      },
      accordionContentContainer: {
        // Styles for the content of the accordion
        paddingVertical: 10,
        padding: 10,
        backgroundColor: '#FFF',
        borderRadius:16,
        elevation: 2,
        shadowColor: '#0C0C0C',
        marginTop: 6,
      },
      contentBody: {
        flexDirection:'row',
        justifyContent:'space-between',
        // borderBottomColor: '#E2EBF0',
        // borderBottomWidth: 1,
        paddingVertical: 14,
      },
      removeBottomBorder: {
        borderBottomWidth: 0,
      },
      accordionStartText: {
        color: '#545454',
        fontFamily:'DMSans-Regular',
      },
      accordionEndText: {
        color: '#1F1F1F',
        fontFamily: 'DMSans-SemiBold',
      },
      accordionText: {
        color:'#1F1F1F',
      },
      locationContainer: {
        flexDirection:'row',
        alignItems:'center',
        gap: 15,
      },
      accordionCardtitle: {
        marginVertical: 10,
        color: '#1F1F1F',
        fontFamily:'DMSans-Bold',
        fontSize: 16,
      },
      locationBox: {
        backgroundColor: '#F3F9FC',
        width: 48,
        height: 48,
        borderRadius: 15,
        alignItems:'center',
        justifyContent:'center',
      },
      iconLocation: {
        width: 22,
        height: 22,
      },
      triangleShape: {
        width: 0,
        height: 0,
        position:'absolute',
        top: -15,
        right: 10,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 14,
        borderRightWidth: 14,
        borderBottomWidth: 24,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#FFF',
      },

      titleContainer: {
        marginVertical: 15,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        paddingHorizontal: 20,
      },
      title: {
        color: '#0C0C0C',
        fontFamily: 'DMSans-Bold',
        fontSize: 20,
        textTransform: 'capitalize',
      },
      seeAllText: {
        color: '#EB5F0A',
        fontFamily:'DMSans-Regular',
        textDecorationLine:'underline',
      },
      productCardSection: {
        flexDirection:'row',
        justifyContent:'space-between',
        flexWrap:'wrap',
        gap: 0,
        marginVertical: 20,
      },


      // Product Card styles
      cardImg: {
        width: 155,
        height: 140,
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
      },
      heart: {
        width: 20,
        height: 20,
        position: 'absolute',
        right: 15,
        top: 10,
      },
      cardBody: {
        gap: 10,
        backgroundColor: '#FFF',
        borderBottomEndRadius: 6,
        borderBottomStartRadius: 6,
        borderTopLeftRadius: 16,
        paddingHorizontal: 10,
        paddingVertical:10,
        marginTop: -10,
        elevation: 2,
        shadowColor: '#171717',
      },
      cardLayout: {
        marginBottom: 13,
        borderRadius: 30,
        marginRight: 10,
      },
      cardTitle: {
        color: '#1F1F1F',
        fontFamily: 'DMSans-Bold',
        fontSize: 13,
        textTransform:'capitalize',
        maxWidth: deviceWidth * 0.30,
      },
      cardDesc: {
        color: '#1F1F1F',
        fontFamily: 'DMSans-Regular',
        fontSize: 13,
      },
      descContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      descText: {
        color: '#545454',
        fontSize: 10,
        fontFamily: 'DMSans-Rehular',
      },
      textBlue: {
        color: '#50BFE9',
        fontSize: 12,
        fontFamily: 'DMSans-Bold',
      },
      textGrey: {
        color: '#A5A5A5',
        fontSize: 12,
        fontFamily: 'DMSans-Regular',
        textDecorationLine: 'line-through',
      },
      textRed: {
        color: '#EB5F0A',
        fontSize: 10,
      },
      bottmBtnContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        gap: 15,
        paddingHorizontal: 20,
      },
      bottomBtn: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E5EFF2',
        width: 152,
        height: 44,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'center',
        gap:2,
        elevation: 2,
        shadowColor: '#171717',
      },
      btnText: {
        color:'#454545',
        alignItems:'center',
        fontFamily: 'DMSans-Semibold',
        fontSize: 16,
        justifyContent:'center',
      },
      bottomIcon: {
        width: 20,
        height: 20,
      },

      // Bottom Section
      bookingDateCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        elevation: 2,
        shadowColor: '#171717',
        padding: 15,
        rowGap: 10,
        marginVertical: 5,
      },
      bookingStartText: {
        color: '#545454',
        fontFamily: 'DMSans-Regular',
        fontSize: 15,
      },
      bookingEndText: {
        color: '#1F1F1F',
        fontFamily: 'DMSans-Medium',
        fontSize: 14,
      },
      bottomContentContainer : {
        borderTopStartRadius: 20,
        borderTopEndRadius: 20,
        backgroundColor:'#FFF',
        elevation: 2,
        shadowColor: '#171717',
      },
      bottomTopContent: {
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        padding: 15,
      },
      bottomTopContentStartText: {
        color:'#545454',
        fontFamily:'DMSans-Regular',
        fontSize: 15,
      },
      bottomTopContentEndText: {
        color: '#1F1F1F',
        fontSize: 18,
        fontFamily: 'DMSans-Bold',
      },
      bottomPriceText: {
        color:'#FFF',
        fontFamily:'DMSans-Bold',
        fontSize:22,
      },
      monthText: {
        color: '#DAF5FF',
        fontFamily: 'DMSans-Regular',
        fontSize: 16,
      },
      addToCartText: {
        color: '#FFF',
        fontFamily: 'DMSans-Medium',
        fontSize: 18,
      },
      whiteText: {
        color:'#ffffff',
        fontSize: 12,
        fontFamily: 'DMSans-Bold',
      },
      descTextWhite: {
        color: '#ffffff',
        fontSize: 10,
        fontFamily: 'DMSans-Rehular',
      }
    
});

export default ProductDetailsScreen;