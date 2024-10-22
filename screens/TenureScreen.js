/* eslint-disable prettier/prettier */
import { View, Text, SafeAreaView, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { appBackColor } from '../styles/colors';
import AppTopBar from '../components/AppTopBar';
import { arrowRightIcon, calendarBlueIcon, infoCircleRedIcon } from '../assets/icons';
import CustomButton from '../components/CustomButton';
import LinearGradient from 'react-native-linear-gradient';
import { deviceWidth, globalMarginTop } from '../styles/size';
import GlobalMargin from '../components/GlobalMargin';
import { getRequest, postRequest } from '../utils/api_call';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const TenureScreen = ({navigation, route}) => {
  // console.log("activeIndex------------",route?.params?.activeIndex);
  // console.log("productPackageDetails------------",route?.params?.productPackageDetails);
  // console.log("serviceId------------",route?.params?.serviceId);
  // console.log("productId------------",route?.params?.productId);
  
  const [cardData, setCardData] = useState([{},{}]);
  const [actIndex, setActIndex] = useState(0);
  const [userId, setUserId] = useState('');
  const [packagesArr, setPackagesArr] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(0);
  const [membershipSubscriptions, setMembershipSubscriptions] = useState([]);
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [perMonthPrice, setPerMonthPrice] = useState(0);
  const [selectedTenure, setSelectedTenure] = useState(null);
  
  useEffect(() => {
    async function getLoggedInUserData() {
      const userData = await AsyncStorage.getItem('userData');
      const userDataObj = JSON.parse(userData);
      setUserId(userDataObj?.userId);
    };
    getLoggedInUserData();
  }, []);

  useEffect(() => {
    async function getPackageData() {
      const res = await getRequest(`/api/Toys/GetProductPackages/${route?.params?.productId}/${route?.params?.serviceId}`);
      const resData = await res.json();
      if(resData?.success == true) {
        setSelectedTenure(resData?.data[route?.params?.activeIndex]);
        setPackagesArr(resData?.data);
      }
    };
    getPackageData();
    getUserMembershipData();
  }, []);

  const getUserMembershipData = async() => {
    const userData = await AsyncStorage.getItem('userData');
      const userDataObj = JSON.parse(userData);
      setUserId(userDataObj?.userId);

      const res1 = await getRequest(`/api/Toys/UserIsInMembership/${userDataObj?.userId}`);
      const resData1 = await res1.json();

      if(resData1.data) {
        const res = await getRequest(`/api/Toys/GetSubscriptions/${userDataObj?.userId}`);
        const resData = await res.json();
        setIsPremiumUser(true);
        setMembershipSubscriptions(resData?.data);
        if(resData?.data?.length > 0) {
          const res2 = await getRequest(`/api/Toys/GetProductPackages/${route?.params?.productId}/${route?.params?.serviceId}`);
          const resData2 = await res2.json();
          if(resData2?.success == true) {
            if(resData2?.data[route?.params?.activeIndex]?.includeMembership) {
              const membershipObject = resData2?.data[route?.params?.activeIndex]?.membershipPricing.find(item => item.membershipID === resData?.data[resData?.data?.length - 1]?.membershipId);
              setPerMonthPrice(membershipObject?.discountedPrice);
            } else {
              setPerMonthPrice(route?.params?.productPackageDetails[route?.params?.activeIndex]?.rent);
            }
          }
          setSelectedPackage(resData?.data[resData?.data?.length - 1]?.membershipId);
        }
      } else {
        setIsPremiumUser(false);
        console.log("permonth--------------",actIndex);
        console.log("permonth--------------",route?.params?.productPackageDetails);
        setPerMonthPrice(route?.params?.productPackageDetails[route?.params?.activeIndex]?.rent);
      }
      
  }

  useEffect(()=>{
    setActIndex(route?.params?.activeIndex);
    // setPerMonthPrice(route?.params?.productPackageDetails[route?.params?.activeIndex]?.rent);
  },[route?.params?.activeIndex]);

  // const handleTenureSelection = (idx) => {
  //   setActIndex(idx);
  // }

  const handleMembershipRedirection = () => {
    navigation.navigate('Membership');
  }

  const getBookingFormatted = (startDate) => {
    const parts = startDate.split(' '); 
    const dayWithLeadingZero = parts[0].padStart(2, '0');
    const formattedDate = `${parts[1]} ${dayWithLeadingZero}, ${parts[2]}`;
    return formattedDate;
  };

  const getBookingFormattedEndDate = (startDate, days) => {
    const parts = startDate.split(' '); // Split the string into [day, month, year]

  // Create an object that maps month names to their numerical representation (0-based index)
  const months = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };

  const dateObject = new Date(parts[2], months[parts[1]], parseInt(parts[0]));

  dateObject.setDate(dateObject.getDate() + parseInt(days));

  const newDay = dateObject.getDate().toString().padStart(2, '0'); // Ensure two digits
  const newMonthIndex = dateObject.getMonth();
  const newYear = dateObject.getFullYear();

  const newMonthName = Object.keys(months).find(key => months[key] === newMonthIndex);

  const formattedDate = `${newMonthName} ${newDay}, ${newYear}`;

  return formattedDate;
}

  const handleAddToCart = async() => {
    console.log("handleAddToCart================");
    const bookingEndDate = await getBookingFormattedEndDate(route?.params?.bookingDate, route?.params?.productPackageDetails[actIndex]?.days);
    const bookingDateObj = await getBookingFormatted(route?.params?.bookingDate);
    
    const data = {
      'id':route?.params?.productId,
      'bookingDate':bookingDateObj,
      'bookingEndDate':bookingEndDate,
      'packageId':route?.params?.productPackageDetails[actIndex]?.packageId,
      'membershipId':selectedPackage,
      'userId':userId,
      'ServiceUseMemberships':isPremiumUser,
    };
    
    const res = await postRequest('/api/Toys/AddItemsToCart', JSON.stringify(data), 'POST');
    const resData = await res.json();
    console.log("handleAddToCart_resData================",resData);
    navigation.navigate('AddToCart');
  }

  let membershipDisplayed = false;

  const handleMembershipSelection = (packVal) => {
    if(isPremiumUser && selectedTenure?.includeMembership) {
      const membershipObject = packagesArr[actIndex]?.membershipPricing?.find(item => item.membershipID === packVal?.membershipId);
      setPerMonthPrice(membershipObject?.discountedPrice);
    }
    
    setSelectedPackage(packVal?.membershipId);
  }

  const handleSelectTenure = (idx, val) => {
    console.log("val---------------",val);
    setSelectedTenure(val);
    if(val?.includeMembership == true && isPremiumUser) {
      const membershipObject = val?.membershipPricing.find(item => item.membershipID === selectedPackage);
      setPerMonthPrice(membershipObject?.discountedPrice);
    } else {
      setPerMonthPrice(route?.params?.productPackageDetails[idx]?.rent);
    }
    setActIndex(idx);
  }
  
  return (
    <SafeAreaView  style={{ flex: 1, backgroundColor: appBackColor }} >
      <AppTopBar navigation={navigation} title={'Tenure'} />
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} >
          <GlobalMargin />
          <View style={{paddingHorizontal:20}} >
              {
                packagesArr?.map((val, idx)=> {
                  const shouldDisplayMembershipCard = val?.includeMembership && !membershipDisplayed;
                  if (shouldDisplayMembershipCard) {
                    membershipDisplayed = true;
                  }
                // route?.params?.productPackageDetails?.map((val, idx)=> {
                  // console.log("val=============",val);
                  return (
                    <View key={idx}>
                      {/* {shouldDisplayMembershipCard && isPremiumUser && (
                        <View style={styles.horizontalCard} >
                          <Text>Select Package</Text>
                          <Picker
                            selectedValue={selectedPackage}
                            onValueChange={(itemValue) => setSelectedPackage(itemValue)}
                          >
                            <Picker.Item label="Select Membership" disabled value={0} />
                            {
                              membershipSubscriptions.map((packVal,idx) => (
                                <Picker.Item label={packVal?.membershipName} value={packVal?.membershipId} />
                              ))
                              }
                          </Picker>
                        </View>
                      )} */}

                      {shouldDisplayMembershipCard && isPremiumUser && (
                        <View style={styles.horizontalCard} >
                          <Text>Active membership</Text>
                          <View style={styles.activeMembershipCardContainer}>
                            {
                              membershipSubscriptions.map((packVal,idx) => (
                                <TouchableOpacity key={packVal.membershipId} onPress={()=>handleMembershipSelection(packVal)} style={[
                                  styles.activeMembershipCard,
                                  selectedPackage === packVal.membershipId && styles.selectedMembershipCard, // Apply selected style conditionally
                                ]}>
                                  <Text style={packVal?.membershipId === selectedPackage ? styles.activeMembershipCardTextSelected : null}>{packVal?.membershipName}</Text>
                                </TouchableOpacity>
                              ))
                            }
                          </View>
                        </View>
                      )}

                      { 
                        val?.includeMembership == true ?
                        <View key={idx} style={styles.horizontalCard} >
                        <View style={styles.horizontalCardTopSection} >
                          <View style={{flexDirection:'row', alignItems:'center', gap:10}} >
                            <View style={styles.calendarBox}>
                              <Image source={calendarBlueIcon} style={{width:22, height:22}} />
                            </View>
                            <Text style={styles.cardTopStartText} >{val?.days} {val?.type == "Hours" ? "Hours"  : "Day"}</Text>
                          </View>

                          <View style={{flexDirection:'row', alignItems:'center', gap:4}} >
                            <Text style={styles.cardTopEndText}>₹{val?.rent}</Text>
                            <Image source={infoCircleRedIcon} style={{width:18, height:18}} />
                          </View>
                        </View>
                        
                        {val?.includeMembership == true &&
                          <View style={{ marginBottom:10 }}>
                            {val?.membershipPricing?.map((priceData, index) => {
                              return (
                                <View key={index} style={styles.cardBody}>
                                  <View style={styles.cardBodyStartTextContainer}>
                                    <Text style={styles.cardBodyStartText} >{priceData?.membershipName}</Text>
                                  </View>
                                  <View style={{ width:deviceWidth*0.3, display:'flex', alignItems:'center' }}>
                                    <View style={styles.cardBodyMiddleTextContainer} >
                                        <Text style={styles.cardBodyMiddleText} >-{priceData?.discountedPercent}%</Text>
                                    </View>
                                  </View>
                                  <View style={styles.cardBodyEndTextContainer}>
                                    <Text style={styles.cardBodyEndText} >₹{priceData?.discountedPrice}</Text>
                                  </View>
                                </View>
                              );
                            })}
                          </View>
                        }

                        {
                          actIndex === idx ?
                          <CustomButton title={'Selected'} /> :
                          <View style={styles.buttonContainer} >
                            <TouchableOpacity onPress={() => handleSelectTenure(idx, val)} style={styles.button}  >
                              <Text style={[styles.buttonText]}>Select Tenure</Text>
                              {/* <Text style={[styles.buttonText]} onPress={()=>setActIndex(idx)}>Select Tenure</Text> */}
                            </TouchableOpacity>
                          </View> 
                        }

                        {
                          val?.includeMembership == true &&
                          <TouchableOpacity onPress={handleMembershipRedirection}>
                            <Text style={{ textAlign:'center', textDecorationLine: 'underline' }}>Membership Plan Details</Text>
                          </TouchableOpacity> 
                        }
                        </View> :
                        
                        <View key={idx} style={styles.horizontalCard} >
                        <View style={styles.horizontalCardTopSection} >
                          <View style={{flexDirection:'row', alignItems:'center', gap:10}} >
                            <View style={styles.calendarBox}>
                              <Image source={calendarBlueIcon} style={{width:22, height:22}} />
                            </View>
                            <Text style={styles.cardTopStartText} >{val?.days} {val?.type == "Hours" ? "Hours"  : "Day"}</Text>
                          </View>

                          <View style={{flexDirection:'row', alignItems:'center', gap:4}} >
                            <Text style={styles.cardTopEndText}>₹{val?.rent}</Text>
                            <Image source={infoCircleRedIcon} style={{width:18, height:18}} />
                          </View>
                        </View>
                        
                        {val?.includeMembership == true &&
                          <View style={{ marginBottom:10 }}>
                            {val?.membershipPricing?.map((priceData, index) => {
                              return (
                                <View key={index} style={styles.cardBody}>
                                  <View style={styles.cardBodyStartTextContainer}>
                                    <Text style={styles.cardBodyStartText} >{priceData?.membershipName}</Text>
                                  </View>
                                  <View style={{ width:deviceWidth*0.3, display:'flex', alignItems:'center' }}>
                                    <View style={styles.cardBodyMiddleTextContainer} >
                                        <Text style={styles.cardBodyMiddleText} >-{priceData?.discountedPercent}%</Text>
                                    </View>
                                  </View>
                                  <View style={styles.cardBodyEndTextContainer}>
                                    <Text style={styles.cardBodyEndText} >₹{priceData?.discountedPrice}</Text>
                                  </View>
                                </View>
                              );
                            })}
                          </View>
                        }

                        {
                          actIndex === idx ?
                          <CustomButton title={'Selected'} /> :
                          <View style={styles.buttonContainer} >
                            <TouchableOpacity style={styles.button} onPress={() => handleSelectTenure(idx, val)} >
                              <Text style={[styles.buttonText]}>Select Tenure</Text>
                              {/* <Text style={[styles.buttonText]} onPress={()=>setActIndex(idx)}>Select Tenure</Text> */}
                            </TouchableOpacity>
                          </View> 
                        }

                        {
                          val?.includeMembership == true &&
                          <TouchableOpacity onPress={handleMembershipRedirection}>
                            <Text style={{ textAlign:'center', textDecorationLine: 'underline' }}>Membership Plan Details</Text>
                          </TouchableOpacity> 
                        }
                        </View>
                      }


                    </View>
                  )
                })
              }

              {/* Card one */}
              {/* {cardData.map((_, id) => (
                  <View key={id} style={styles.horizontalCard} >
                    <View style={styles.horizontalCardTopSection} >
                      <View style={{flexDirection:'row', alignItems:'center', gap:10}} >
                      <View style={styles.calendarBox}>
                          <Image source={calendarBlueIcon} style={{width:22, height:22}} />
                      </View>
                      <Text style={styles.cardTopStartText} >1 Days</Text>
                      </View>
                      <View style={{flexDirection:'row', alignItems:'center', gap:4}} >
                        <Text style={styles.cardTopEndText}>₹1049</Text>
                        <Image source={infoCircleRedIcon} style={{width:18, height:18}} />
                      </View>
                    </View>
                    {id === 0 ? 
                      <CustomButton title={'Selected'} /> : 
                      <View style={styles.buttonContainer} >
                        <TouchableOpacity style={styles.button}  >
                          <Text style={[styles.buttonText]}>Select Tenure</Text>
                        </TouchableOpacity>
                      </View> 
                    }
              </View>
              ))} */}

              {/* Card Square */}
              {/* {[1, 2].map((_, index) => (
                <View key={index} style={styles.horizontalCard} >
                <View style={[styles.horizontalCardTopSection, styles.bottomBorder, {paddingBottom: 10}]} >
                    <View style={{flexDirection:'row', alignItems:'center', gap:10}} >
                    <View style={styles.calendarBox}>
                        <Image source={calendarBlueIcon} style={{width:22, height:22}} />
                    </View>
                    <Text style={styles.cardTopStartText} >1 Days</Text>
                    </View>
                    <View style={{flexDirection:'row', alignItems:'center', gap:4}} >
                    <Text style={styles.cardTopEndText}>₹1049</Text>
                    <Image source={infoCircleRedIcon} style={{width:18, height:18}} />
                    </View>
                </View>
                {[1, 2, 3, 4].map((_, id) => (
                  <View key={id} style={styles.cardBody}>
                  <Text style={styles.cardBodyStartText} >Silver</Text>
                  <View style={styles.cardBodyMiddleTextContainer} >
                      <Text style={styles.cardBodyMiddleText} >-20%</Text>
                  </View>
                  <Text style={styles.cardBodyEndText} >₹80</Text>
              </View>
                ))}
                <View style={[styles.buttonContainer, {marginVertical: 5}]} >
                <TouchableOpacity style={styles.button}  >
                    <Text style={[styles.buttonText]}>Select Tenure</Text>
                </TouchableOpacity>
                </View>
                <View style={styles.cardBottomTextContainer} >
                  <Text style={styles.cardBottomText}  >Membership Plan Details</Text>
                </View>
            </View>
              ))} */}

              {/* Booking Date UI */}
              <View style={[styles.bookingDateCard, {marginVertical: 20, flexDirection:'column', alignItems:'flex-start'}]}>
                <Text style={styles.bookingStartText} >Booking Date</Text>
                <View style={{flexDirection:'row', alignItems:'center', gap:3}}  >
                  <Image source={calendarBlueIcon} style={{width:22, height:22}} />
                  <Text style={styles.bookingEndText} >{route?.params?.bookingDate} {route?.params?.bookingEndDate!='' && `- ${route?.params?.bookingEndDate}`}</Text>
                </View>
              </View>

          </View>
              {/* Bottom Content */}
              <View style={styles.bottomContentContainer}>
                <View style={styles.bottomTopContent} >
                  <View style={{flexDirection:'row', alignItems:'center', gap: 4}} >
                  <Text style={styles.bottomTopContentStartText} >Refundable Deposit</Text>
                  <Image source={infoCircleRedIcon} style={{width: 18, height: 18}} />
                  </View>
                  <Text style={styles.bottomTopContentEndText} >₹{route?.params?.productPackageDetails[actIndex]?.deposit}</Text>
                </View>
                
              </View>
        </ScrollView>

        <View style={styles.bottomContentContainer}>
          <TouchableOpacity style={styles.addToCartBtn}>
            <LinearGradient
            colors={['#6BD3FB', '#50BFE9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.bottomTopContent, {borderTopLeftRadius: 20, borderTopRightRadius:20}]} >
              <View style={{flexDirection:'row', alignItems:'center', gap: 4}} >
              <Text style={styles.bottomPriceText} >₹{perMonthPrice}<Text style={styles.monthText} >/Month</Text></Text>
              {/* <Text style={styles.bottomPriceText} >₹{route?.params?.productPackageDetails[actIndex]?.rent}<Text style={styles.monthText} >/Month</Text></Text> */}
              </View>
              <View style={{flexDirection:'row', alignItems:'center',gap:3}} >
                {/* <TouchableOpacity > */}
                <TouchableOpacity onPress={handleAddToCart}>
                  <Text style={styles.addToCartText} >Add to cart </Text>
                </TouchableOpacity>
              <Image source={arrowRightIcon} style={{width:20, height:20}}  />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    // paddingHorizontal: 20,
    backgroundColor: appBackColor,
    // marginTop: globalMarginTop,
  },
  horizontalCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#171717',
    padding: 15,
    rowGap: 10,
    marginVertical: 5,
  },
  horizontalCardTopSection: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
  },
  calendarBox: {
    backgroundColor: '#F3F9FC',
    width: 48,
    height: 48,
    borderRadius: 15,
    alignItems:'center',
    justifyContent:'center',
  },
  cardTopStartText: {
    color: '#545454',
    fontFamily: 'DMSans-Regular',
    fontSize: 18,
  },
  cardTopEndText: {
    color: '#1F1F1F',
    fontFamily: 'DMSans-Bold',
    fontSize: 22,
  },
  bottomBorder: {
    borderBottomColor: '#E2EBF0',
    borderBottomWidth: 1,
  },
  cardBody: {
    flexDirection:'row',
    alignItems:'center',
    // justifyContent:'space-between',
    borderBottomColor: '#E2EBF0',
    borderBottomWidth: 1,
    paddingBottom: 10,
    width:'100%'
  },
  cardBodyStartText: {
    color: '#545454',
    fontSize: 14,
    fontFamily:'DMSans-Regular',
  },
  cardBodyStartTextContainer: {
    width: deviceWidth*0.3,
    // backgroundColor:'red'

  },
  cardBodyMiddleTextContainer: {
    width: deviceWidth*0.15,
    height: 28,
    borderRadius: 10,
    backgroundColor:'#FFF4EE',
    alignItems:'center',
    justifyContent:'center',
  },
  cardBodyMiddleText: {
    color: '#EB5F0A',
    fontFamily: 'DMSans-Medium',
    textTransform:'capitalize',
    fontSize: 12,
  },
  cardBodyEndText: {
    color: '#1F1F1F',
    fontFamily: 'DMSans-Bold',
    fontSize: 14,
    width:'100%',
    textAlign:'center'
  },
  cardBodyEndTextContainer: {
    width:deviceWidth*0.3,
    display:'flex',
    justifyContent:'center',
    alignItems:'center'
  },
  buttonContainer: {
    alignItems:'center',
  },
  button: {
    borderRadius: 60,
    width: '85%',
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign:'center',
    borderWidth:1,
    borderColor:'#50BFE9',
  },
  buttonText: {
    color: '#50BFE9',
    fontSize: 16,
    fontFamily: 'DMSans-Bold',
  },
  cardBottomTextContainer: {
    alignItems:'center',
  },
  cardBottomText: {
    color: '#626668',
    fontFamily: 'DMSans-Regular',
    fontSize: 16,
    textDecorationLine:'underline',
  },
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
    fontFamily: 'DMSans-Bold'
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
  activeMembershipCardContainer: {
    display:'flex',
    justifyContent:'space-between',
    flexDirection:'row'
  },
  activeMembershipCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#171717',
    padding: 10,
    rowGap: 10,
    marginVertical: 5,
  },
  selectedMembershipCard: {
    backgroundColor: '#EB5F0A',
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#171717',
    padding: 10,
    rowGap: 10,
    marginVertical: 5,
  },
  activeMembershipCardTextSelected: {
    color:'#ffffff'
  }
});


export default TenureScreen;

// const formattedDate = startDate.replace(
    //   /(\d+)\s+([A-Za-z]+)\s+(\d+)/, 
    //   (match, day, month, year) => {
    //     const newDay = parseInt(day) + parseInt(daysToAdd); 
    //     return `${newDay.toString().padStart(2, '0')} ${month} ${year}`; // Format with padding
    //   }
    // );
    // return formattedDate;