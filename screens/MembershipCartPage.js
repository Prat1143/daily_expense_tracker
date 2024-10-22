/* eslint-disable prettier/prettier */
import { View, Text, StyleSheet, SafeAreaView, Dimensions, TextInput } from 'react-native';
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
import { crownBlueIcon, heartBlueIcon, starBlueIcon } from '../assets/icons';
import RazorpayCheckout from 'react-native-razorpay';
import CheckBox from '@react-native-community/checkbox';

let scrnWidth = Dimensions.get('window').width;
let scrnHeight = Dimensions.get('window').height;

const MembershipCartPage = ({navigation, route}) => {
  
  const [userCartItemData, setUserCartItemData] = useState([]);
  const [userCartData, setUserCartData] = useState([]);
  const [spinnerLoading, setSpinnerLoading] = useState(false);
  const [userId, setUserId] = useState('');
  const [userDetails, setUserDetails] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [isMember, setIsMember] = useState(false);
  const [acceptTnC, setAcceptTnC] = useState(false);
  const [acceptTnCError, setAcceptTnCError] = useState(false);

//   const {membershipDetails} = route?.params;

  useEffect(()=> {
    console.log("membershipDetails===========================---------",route?.params?.membershipDetails);
  },[]);

  useEffect(() => {
    async function getLoggedInUserData() {
        const userData = await AsyncStorage.getItem('userData');
        const userDataObj = JSON.parse(userData);
        console.log('logged_in_userData-----------------', userDataObj?.userId);
        createMembershipOrder(userDataObj?.userId);
        // const res = await getRequest(`/api/Toys/CreateMembershipOrder/${route?.params?.membershipDetails?.id}/${userDataObj?.userId}`);
        // const resData = await res.json();
        // console.log('CreateMembershipOrder-------', resData?.data);
    
    //   setUserId(userDataObj?.userId);
    };
    getLoggedInUserData();
  }, []);

    const createMembershipOrder = async(user_id) => {
        console.log("user_id==========",user_id);
        const res = await getRequest(`/api/Toys/CreateMembershipOrder?MembershipId=${route?.params?.membershipDetails?.id}&UserId=${user_id}`);
        const resData = await res.json();
        if(resData?.success == true) {
            const target_state = resData?.data?.states.find(state => state.id === resData?.data?.stateId);
            const target_city = resData?.data?.cities.find(city => city.id === resData?.data?.cityId);
            setState(target_state?.stateName);
            setCity(target_city?.cityName);
            console.log('target_state=================-------', resData?.data?.userAlreadyMember);
            setUserDetails(resData?.data);
            setIsMember(resData?.data?.userAlreadyMember)
        }
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

    handleChangeAddress = (val) => {
        setAddress(val);
        setUserDetails((currentDetails) => {
            return {
              ...currentDetails,
              address: val
            };
        });
    }

    const handleProceedToPay = async() => {
        console.log("acceptTnC=========",acceptTnC);

        if(acceptTnC == false) {
            setAcceptTnCError(true);
            return false;
        }
        console.log("handleProceedToPay=========",userDetails?.address);
        const res = await postRequest('/api/Toys/ConfigureRazorPayMembership', JSON.stringify(userDetails), 'POST');
        const resData = await res.json();
        console.log("handleProceedToPay_resData====------------=======",resData.data?.success);
        if(resData.data) {
            var options = {
                description: 'Membership Purchase',
                image: 'https://toyrentjunction.com/Images/logo/logo%20148%20by%2048.png',
                currency: 'INR',
                key: resData.data?.razorpayKey, 
                // key: 'rzp_test_6aOguOVuPB9j5j', 
                amount: resData.data?.totalAmount, // Amount is in the smallest currency unit (e.g., paise for INR)
                // amount: item.totalAmount * 100, // Amount is in the smallest currency unit (e.g., paise for INR)
                name: `${resData.data?.firstName} ${resData.data?.lastName}`,
                prefill: {
                    email: resData.data?.email,
                    contact: resData.data?.contact,
                    name: `${resData.data?.firstName} ${resData.data?.lastName}`
                },
                theme: {color: '#53a20e'}
            };

            RazorpayCheckout.open(options).then(async(data) => {
                // Handle success
                console.log(`Success------------------: ${data}`);
                console.log('dataaaaaaaaa--------------------',data);
                console.log(`Success: ${data.razorpay_payment_id}`);
    
                const rz_data = {
                    "Id": 0,
                    "MembershipId" : resData.data?.membershipId,
                    "TotalAmountPaid": resData.data?.totalAmount / 100,
                    "TransactionId": resData.data?.transactionId,
                    "RzpPaymentId": data.razorpay_payment_id,
                    "RzpOrderId": data.razorpay_payment_id,
                    "RzpSignatureId": data.razorpay_payment_id,
                    "UserId": resData.data?.userId
                }
    
                const resp = await postRequest('/api/Toys/CompletePayment', JSON.stringify(rz_data), 'POST');
                const respData = await resp.json();

                console.log("FINAL---------------",respData);

                if(respData?.success == true) {
                    navigation.navigate('MySubscription');
                }
    
                // alert(`Success: Payment ID: ${data.razorpay_payment_id}`);
            }).catch((error) => {
                // Handle error
                console.log(`Error: ${error.code} | ${error.description}`);
                // alert(`Error: ${error.description}`);
            });
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <AppTopBar navigation={navigation} title={'Membership Checkout'} />
            <ScrollView style={{ flex: 1, marginTop:30 }}>
                <GlobalMargin />
                {/* Form */}
                {userDetails && <View style={[styles.card, {padding:20}]}>
                    <Text style={{ fontWeight:'bold', color:'black' }}>Contact Details</Text>
                    <View style={styles?.formContainer}>
                        <View style={styles.formRowContainer}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>First Name</Text>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        value={userDetails?.firstName}
                                        style={styles.input} 
                                    />
                                </View>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Last Name</Text>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        value={userDetails?.lastName}
                                        style={styles.input} 
                                    />
                                </View>
                            </View>
                        </View>

                        {/* 2nd Row */}
                        {/* <View style={styles.formRowContainer}> */}
                            <View style={[styles.inputContainer, { width:'100%' }]}>
                                <Text style={styles.label}>Email</Text>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        value={userDetails?.email}
                                        style={styles.input} 
                                    />
                                </View>
                            {/* </View> */}

                            <View style={[styles.inputContainer, , { width:'100%' }]}>
                                <Text style={styles.label}>Contact</Text>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        value={userDetails?.contact}
                                        style={styles.input} 
                                    />
                                </View>
                            </View>
                        </View>

                        {/* 3rd Row */}
                        <View style={styles.formRowContainer}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>State</Text>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        value={state}
                                        style={styles.input} 
                                    />
                                </View>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>City</Text>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        value={city}
                                        style={styles.input} 
                                    />
                                </View>
                            </View>
                        </View>

                        {/* 4th Row */}
                        <View style={[styles.inputContainer, {width:'100%'}]}>
                            <Text style={styles.label}>Address</Text>
                            <TextInput
                                onChangeText={(e)=>handleChangeAddress(e)}
                                value={address}
                                multiline={true}
                                numberOfLines={5}
                                placeholderTextColor={'#828282'}
                                placeholder="Write your full address..."
                                style={[styles.input, styles.textArea]}
                            />
                        </View>
                    </View>
                </View>}

                <View style={[styles.card, {flexDirection:'row'}]}>
                    <View style={styles.imgContainer}>
                        <Image source={crownBlueIcon} style={{width:86,  height:86, borderRadius: 16}} />
                    </View>
                    <View style={{width: '60%', display:'flex', justifyContent:'center'}} >
                        <Text style={styles.cardTitle} >{route?.params?.membershipDetails?.libraryMembershipName} Membership</Text>
                    </View>
                    {/* <TouchableOpacity style={styles.heartContainer} onPress={()=>handleDeleteCartItem(val)}>
                        <Image source={trashIcon} style={{width:20, height:20}} />
                    </TouchableOpacity> */}
                </View>
                <View style={styles.bottomContentContainer}>
                    <View style={{paddingHorizontal:10}} >
                        <View style={{borderBottomWidth:1, borderColor:'#E2EBF0', paddingVertical:10}} >
                            <View style={styles.bottomTopContentDesc} >
                                <View style={{flexDirection:'row', alignItems:'center', gap: 4}} >
                                    <Text style={styles.bottomContentDescText} >Registration Fee</Text>
                                </View>
                                <Text style={styles.bottomContentDescPrice} >₹{userDetails?.registrationFee}</Text>
                            </View>
                            <View style={styles.bottomTopContentDesc} >
                                <View style={{flexDirection:'row', alignItems:'center', gap: 4}} >
                                    <Text style={styles.bottomContentDescText} >Rent Charge</Text>
                                </View>
                                <Text style={styles.bottomContentDescPrice} >₹{userDetails?.rentRecharge}</Text>
                            </View>
                            <View style={styles.bottomTopContentDesc} >
                                <View style={{flexDirection:'row', alignItems:'center', gap: 4}} >
                                    <Text style={styles.bottomContentDescText} >Pick up/delivery</Text>
                                </View>
                                <Text style={styles.bottomContentDescPrice} >₹{userDetails?.deliverCharges}</Text>
                            </View>
                            <View style={styles.bottomTopContentDesc} >
                                <View style={{flexDirection:'row', alignItems:'center', gap: 4}} >
                                    <Text style={styles.bottomContentDescText} >GST (18%)</Text>
                                </View>
                                <Text style={styles.bottomContentDescPrice} >₹{userDetails?.gst}</Text>
                            </View>
                            <View style={styles.bottomTopContentDesc} >
                                <View style={{flexDirection:'row', alignItems:'center', gap: 4}} >
                                    <Text style={styles.bottomContentDescText} >Security deposit</Text>
                                </View>
                                <Text style={[
                                    styles.bottomContentDescPrice,
                                    isMember && { textDecorationLine: 'line-through' }
                                ]} >₹{userDetails?.securityDeposit}</Text>
                            </View>
                        </View>
                        <View style={[styles.bottomTopContent, {borderBottomWidth:1, borderColor:'#E2EBF0', }]} >
                            <View style={{flexDirection:'row', alignItems:'center', gap: 4}} >
                                <Text style={styles.bottomTopContentStartText} >Total Amount</Text>
                            </View>
                            <Text style={styles.bottomTopContentEndText} >₹{userDetails?.totalAmount}</Text>
                        </View>

                        <View style={styles.bottomTopContent, {flexDirection:'column', paddingVertical:10 }} >
                            <View style={{flexDirection:'row', alignItems:'center', gap: 4}} >
                                <CheckBox
                                    value={acceptTnC}
                                    onValueChange={()=>setAcceptTnC(!acceptTnC)}
                                    tintColors={{ true: '#50BFE9', false: '#50BFE9' }} // Customize your color
                                />
                                <Text style={styles.bottomTopContentStartText} >I agree with the terms and conditions.</Text>
                            </View>
                            {acceptTnCError && <Text style={styles.error} >Please accept the terms and conditions.</Text>}
                        </View>
                    </View>
                </View>
            </ScrollView>
            <View>
                <TouchableOpacity style={styles?.payBtn} onPress={handleProceedToPay} >
                    <LinearGradient
                        colors={['#6BD3FB', '#50BFE9']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.bottomTopContent, {borderTopLeftRadius: 20, borderTopRightRadius:20}]} 
                    >
                        <View style={{flexDirection:'row', alignItems:'center', gap: 4}} >
                            <Text style={styles.bottomPriceText} >₹{route?.params?.membershipDetails?.totalAmount}</Text>
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
    formContainer:{
        display:'flex',
        flexDirection:'column',
        width:'100%',
    },
    formRowContainer: {
        width:'100%',
        justifyContent:'flex-start',
        alignItems:'flex-start',
        flexDirection:'row',
        gap:5
    },
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
        margin:20,
        display:'flex',
        flexDirection:'column'
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
        borderRadius: 20,
        // borderTopStartRadius: 20,
        // borderTopEndRadius: 20,
        backgroundColor:'#FFF',
        elevation: 2,
        shadowColor: '#171717',
        flex:1,
        marginHorizontal:20,
        marginBottom:80
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
    },
    inputContainer: {
        marginTop: 20,
        width:'48%'
    },
    label: {
        fontFamily: 'DMSans-Regular',
        color: '#6F6F6F',
        fontSize: 14,
        marginBottom: 10,
        marginLeft: 4,
    },
    input: {
        paddingLeft: 15,
        height: 50,
        borderRadius: 16,
        paddingRight: 15,
        fontFamily: 'DMSans-SemiBold',
        backgroundColor: '#FFFFFF',
        color: '#6F6F6F',
        elevation: 1,
        shadowColor: '#171717',
        marginBottom:5,
        width:'100%'
    },
    textArea: {
        height: 150,
        textAlignVertical: 'top',
    },
    error: {
        color:'red',
        opacity: 0.6,
        paddingLeft:8
    },
});

export default MembershipCartPage;