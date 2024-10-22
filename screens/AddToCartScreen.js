/* eslint-disable prettier/prettier */
import { View, Text, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { appBackColor } from '../styles/colors';
import { globalMarginTop } from '../styles/size';
import { ScrollView } from 'react-native';
import AppTopBar from '../components/AppTopBar';
import { Image } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { addPlusIconWhite, arrowRightIcon, heartRedIcon, infoCircleRedIcon, minusIcon, trashIcon } from '../assets/icons';
import { girlNavyPanther } from '../assets/images/wishlist';
import GlobalMargin from '../components/GlobalMargin';
import LinearGradient from 'react-native-linear-gradient';
import { getRequest, postRequest } from '../utils/api_call';
import Spinner from 'react-native-loading-spinner-overlay';
import { getStoredUserData } from '../utils/common';
// import { API_URL } from '../../constants/constant';
import { API_URL } from '../constants/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';

let scrnWidth = Dimensions.get('window').width;
let scrnHeight = Dimensions.get('window').height;

const AddToCartScreen = ({navigation}) => {
  
  const [userCartItemData, setUserCartItemData] = useState([]);
  const [userCartData, setUserCartData] = useState([]);
  const [spinnerLoading, setSpinnerLoading] = useState(false);
  const [userId, setUserId] = useState('');
  const [isSelfPickup, setIsSelfPickup] = useState(false);
  const [selection, setSelection] = useState('pickupDropCharges');

  useEffect(()=> {
    getUserCartData();
  },[]);

  useEffect(() => {
    async function getLoggedInUserData() {
      const userData = await AsyncStorage.getItem('userData');
      const userDataObj = JSON.parse(userData);
      console.log('logged_in_userData-----------------', userDataObj?.userId);
      setUserId(userDataObj?.userId);
    };
    getLoggedInUserData();
  }, []);

  const getUserCartData = async() => {
    console.log('selection-----------------', selection);
    const userData = await getStoredUserData();
    const userCartArr = await getRequest(`/api/Toys/GetCalculatedCartPricesByUserId/${userData?.userId}/false`);
    // const userCartArr = await getRequest(`/api/Toys/GetCartByUserId/${userData?.userId}`);
    // GetCalculatedCartPricesByUserId/6c24fc18-f67a-4daa-8707-994564d1a677/false
    const resUserCartArr = await userCartArr.json();
    // console.log('resUserCartArr========',resUserCartArr?.data?.cartItems);
    console.log('resUserCartArr========',resUserCartArr?.data);
    // setUserCartData({
      //   'shipping': '20.00',
      //   'total': '3200.00',
      //   'totalDeposit': '344.00',
      //   'grandTotal': '3567.60',
      //   'gst': '3.60',
      //   'membershipId': 0,
      //   'productId': 0
      // });
    setUserCartItemData(resUserCartArr?.data?.cartItems);
    setUserCartData(resUserCartArr?.data);

    // setUserCartItemData([
    //   {
    //       'cartId': 2,
    //       "productId": 1,
    //       "productName": "Bicycle",
    //       "brandName": "Honda",
    //       "unitPrice": "3200.00",
    //       "days": "12",
    //       "subTotal": "344.00",
    //       "productImage": "/ToyImages/Toy - b8f12d21-249c-4fac-9cac-4bd0263075e5.png",
    //       "category": "simple Bike",
    //       "description": "Loream Ipsum Loream Ipsum Loream Ipsum Loream Ipsum ",
    //       "url": "/Product/Detail?Id=1&Service=1",
    //       "bookingDate": "Sep 01, 2023 - Sep 13, 2023",
    //       "serviceName": "BikeService"
    //   }
    // ]);
  }

  const handleNavigation = (screenName) => {
    navigation.navigate(screenName);
  };

  const handleIncrementQty = (item) => {
    console.log("handleIncrementQty=========", item);
  }

  const handleDecrementQty = (item) => {
    console.log("handleDecrementQty=========", item);
  }

  const handleDeleteCartItem = async(data) => {
    console.log("handleDeleteCartItem=========", data);
    const payload = {
      userId: userId,
      cartId: data?.cartId
    }
    console.log("payload=========", payload);
    const res = await postRequest('/api/Toys/DeleteCartItemByUserId', JSON.stringify(payload), 'POST');
    const resData = await res.json();
    console.log("resData=========", resData);
    if(resData?.success == true) {
      getUserCartData();
    }
  }

  const handlePickupChange = async(newValue, pickupType) => {
    setSelection(newValue ? pickupType : selection);
    console.log("pickupType===========",pickupType);
    if(pickupType == 'pickupDropCharges') {
      const userData = await getStoredUserData();
      const userCartArr = await getRequest(`/api/Toys/GetCalculatedCartPricesByUserId/${userData?.userId}/false`);
      const resUserCartArr = await userCartArr.json();
      setUserCartItemData(resUserCartArr?.data?.cartItems);
      setUserCartData(resUserCartArr?.data);
    } else {
      const userData = await getStoredUserData();
      const userCartArr = await getRequest(`/api/Toys/GetCalculatedCartPricesByUserId/${userData?.userId}/true`);
      const resUserCartArr = await userCartArr.json();
      setUserCartItemData(resUserCartArr?.data?.cartItems);
      setUserCartData(resUserCartArr?.data);
    }
  }

  const handleCheckout = () => {
    console.log("selection===========",selection);
    navigation.navigate('CartCheckoutForm',{userCartData:userCartData, selfPickup: selection=='pickupDropCharges' ? false : true});
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppTopBar navigation={navigation} title={'Add To Cart'} />
      <ScrollView style={{ flex: 1 }}>
      <GlobalMargin />
            {/* Card Section */}
            <View style={styles.cardSection} >
                    {/* Card */}
                    {userCartItemData.map((val, id)=> (
                      <View key={id} style={styles.card}>
                        <View style={styles.imgContainer}>
                            <Image source={{uri: `${API_URL}/${val?.productImage}`}} style={{width:86,  height:86, borderRadius: 16}} />
                        </View>
                        <View style={{width: '60%'}} >
                          <Text style={styles.cardTitle} >{val?.productName}</Text>
                          <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingRight: 10, marginTop:10}} >
                            <View style={{gap:10}} >
                              <View style={{flexDirection:'row', alignItems:'center', gap:4}} >
                                <Text style={styles.daysText} >{val?.days} {val?.type == "Hours" ? "Hours"  : "Day"} </Text>
                                <Text style={styles.rentText} >Rent</Text>
                              </View>
                              <Text style={styles.priceText} >₹{val?.unitPrice}</Text>
                            </View>
                            {/* <View style={styles.buttonContainer}>
                              <TouchableOpacity style={styles.minusBtn} onPress={()=>handleDecrementQty(val)}>
                                <Image source={minusIcon} style={{height:16, width:16}}  />
                              </TouchableOpacity>
                              <Text style={styles.countText} >2</Text>
                              <TouchableOpacity onPress={()=>handleIncrementQty(val)}>
                                <LinearGradient
                                  colors={['#f57223', '#ff914e']}
                                  start={{ x: 0, y: 0 }}
                                  end={{ x: 1, y: 0 }}
                                  style={styles.plusBtn}
                                >
                                  <Image source={addPlusIconWhite}  style={{height:16, width:16}}  />
                                </LinearGradient>
                              </TouchableOpacity>
                            </View> */}
                          </View>
                          <View>
                            <Text style={styles.cardBottomText} >Booking Date : {val?.bookingDate} </Text>
                          </View>
                        </View>
                        <TouchableOpacity style={styles.heartContainer} onPress={()=>handleDeleteCartItem(val)}>
                          <Image source={trashIcon} style={{width:20, height:20}} />
                        </TouchableOpacity>
                      </View>
                    ))}
                </View>
        {/* Bottom Content */}
        <View style={styles.bottomContentContainer}>
              <View style={{paddingHorizontal:10}} >
              <View style={{borderBottomColor:'#E2EBF0', borderBottomWidth:1}} >
                <View style={styles.bottomTopContent} >
                <View style={{flexDirection:'row', alignItems:'center', gap: 4}} >
                <Text style={styles.bottomTopContentStartText} >Total Rent</Text>
                </View>
                <Text style={styles.bottomTopContentEndText} >{userCartData?.total}</Text>
                </View>
              </View>

              <View style={{borderBottomWidth:1, borderColor:'#E2EBF0'}} >
                <View style={styles.bottomTopContentDesc} >
                  <View style={{flexDirection:'row', alignItems:'center', gap: 4}} >
                    <CheckBox
                      value={selection === 'pickupDropCharges'}
                      onValueChange={(newValue) => handlePickupChange(newValue, 'pickupDropCharges')}
                      tintColors={{ true: '#50BFE9', false: '#50BFE9' }} // Customize your color
                    />
                    <Text style={styles.bottomContentDescText} >Pickup/Drop Charges</Text>
                  </View>
                  <Text style={styles.bottomContentDescPrice} >₹{userCartData?.shipping}</Text>
                </View>
                <View style={styles.bottomTopContentDesc} >
                  <View style={{flexDirection:'row', alignItems:'center', gap: 4}} >
                    <CheckBox
                      value={selection === 'selfPickupDrop'}
                      onValueChange={(newValue) => handlePickupChange(newValue, 'selfPickupDrop')}
                      tintColors={{ true: '#50BFE9', false: '#50BFE9' }} // Customize your color
                    />
                    <Text style={styles.bottomContentDescText} >Self pickup/ Drop</Text>
                  </View>
                  <Text style={styles.bottomContentDescPrice} >₹0</Text>
                </View>
                <View style={styles.bottomTopContentDesc} >
                <View style={{flexDirection:'row', alignItems:'center', gap: 4}} >
                <Text style={styles.bottomContentDescText} >Discount</Text>
                </View>
                <Text style={styles.bottomContentDescPrice} >₹NA</Text>
                </View>
                <View style={styles.bottomTopContentDesc} >
                <View style={{flexDirection:'row', alignItems:'center', gap: 4}} >
                <Text style={styles.bottomContentDescText} >GST (18%)</Text>
                </View>
                <Text style={styles.bottomContentDescPrice} >₹{userCartData?.gst}</Text>
                </View>
              </View>
              <View style={[styles.bottomTopContent, {marginBottom:60}]} >
                <View style={{flexDirection:'row', alignItems:'center', gap: 4}} >
                <Text style={styles.bottomTopContentStartText} >Refundable</Text>
                </View>
                <Text style={styles.bottomTopContentEndText} >₹{userCartData?.totalDeposit}</Text>
                </View>

              </View>
              </View>
      </ScrollView>
      <View>
        <TouchableOpacity onPress={handleCheckout} style={styles?.payBtn} disabled={userCartItemData?.length > 0 ? false : true} >
          <LinearGradient
          colors={['#6BD3FB', '#50BFE9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.bottomTopContent, {borderTopLeftRadius: 20, borderTopRightRadius:20}]} >
            <View style={{flexDirection:'row', alignItems:'center', gap: 4}} >
            <Text style={styles.bottomPriceText} >₹{userCartData?.grandTotal}</Text>
            </View>
            <View style={{flexDirection:'row', alignItems:'center',gap:3}} >
            <Text style={styles.addToCartText} >Proceed to pay </Text>
            <Image source={arrowRightIcon} style={{width:20, height:20}}  />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height:'100%',
        backgroundColor: appBackColor,
    },
    contentContainer: {
      backgroundColor:'red',
      // height:500
        flex: 1,
        // paddingHorizontal: 20,
    },
    payBtn: {
      bottom:0,
      position:'absolute',
      width:'100%',
      // backgroundColor:'red',
      flex:1,
      justifyContent:'flex-end'
      // height:'100%',
    },
    cardSection: {
        marginVertical: 10,
        paddingHorizontal: 20,
    },
    card: {
        backgroundColor:'#FFF',
        borderRadius: 16,
        elevation: 2,
        shadowColor: '#171717',
        padding: 10,
        flexDirection:'row',
        gap: 10,
        marginBottom:10,
    },
    imgContainer: {
        borderRadius: 16,
        width: '30%',
    },
    cardTitle: {
        color: '#1F1F1F',
        fontFamily: 'DMSans-Medium',
        fontSize: 16,
    },
    heartContainer: {
        position:'absolute',
        top: 10,
        right: 10,
    },
    button: {
        borderWidth: 1,
        borderRadius: 60,
        width: 112,
        borderColor:'#50BFE9',
        height: 38,
        alignItems:'center',
        justifyContent:'center',
    },
    buttonText: {
        color: '#50BFE9',
        fontFamily: 'DMSans-Medium',
        fontSize: 13,
    },
    priceText: {
        color: '#50BFE9',
        fontFamily: 'DMSans-Bold',
        fontSize: 16,
    },
    daysText: {
        color: '#545454',
        fontFamily: 'DMSans-Regular',
        fontSize: 12,
    },
    rentText: {
        color: '#EB5F0A',
        fontFamily: 'DMSans-Regular',
        fontSize: 12,
    },
    buttonContainer: {
        alignItems:'center',
        flexDirection:'row',
        gap:10,
    },
    minusBtn: {
        borderWidth: 1,
        borderColor: '#A7A6A5',
        borderRadius: 100,
        height: 24,
        width: 24,
        alignItems:'center',
        justifyContent:'center',
    },
    plusBtn: {
        backgroundColor:'orange',
        borderRadius: 100,
        height: 24,
        width: 24,
        alignItems:'center',
        justifyContent:'center',
    },
    countText: {
        color: '#000',
        fontFamily: 'DMSans-Medium',
        fontSize: 14,
    },
    cardBottomText: {
        color: '#545454',
        fontFamily: 'DMSans-Regular',
        fontSize: 10,
    },

    bottomContentContainer : {
        borderTopStartRadius: 20,
        borderTopEndRadius: 20,
        backgroundColor:'#FFF',
        elevation: 2,
        shadowColor: '#171717',
        flex:1
      },
      bottomTopContent: {
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        padding: 15,
      },
      bottomTopContentDesc: {
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        paddingHorizontal: 15,
        paddingVertical: 8,
      },
      bottomTopContentStartText: {
        color:'#545454',
        fontFamily:'DMSans-Regular',
        fontSize: 15,
      },
      bottomContentDescText: {
        color:'#545454',
        fontFamily:'DMSans-Regular',
        fontSize: 16,
       },
      bottomTopContentEndText: {
        color: '#1F1F1F',
        fontSize: 20,
        fontFamily: 'DMSans-Bold'
      },
      bottomContentDescPrice: {
        color: '#454545',
        fontFamily: 'DMSans-Medium',
        fontSize: 18,
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
      }
});

export default AddToCartScreen;