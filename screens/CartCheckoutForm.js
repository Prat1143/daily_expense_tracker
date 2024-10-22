/* eslint-disable prettier/prettier */
import { View, Text, StyleSheet, SafeAreaView, Dimensions, TextInput, ScrollView, ActivityIndicator, Image, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { appBackColor } from '../styles/colors';
import AppTopBar from '../components/AppTopBar';
import { getRequest, postRequest } from '../utils/api_call';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RazorpayCheckout from 'react-native-razorpay';
import CustomButton from '../components/CustomButton';
import CheckBox from '@react-native-community/checkbox';

const CartCheckoutForm = ({navigation, route}) => {
    const [userId, setUserId] = useState('');
    const [userDetails, setUserDetails] = useState([]);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [contact, setContact] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [acceptTnC, setAcceptTnC] = useState(false);
    const [acceptTnCError, setAcceptTnCError] = useState(false);
    const [addressError, setAddressError] = useState(false);
    const [phoneNoError, setPhoneNoError] = useState(false);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {

        console.log("route?.params=============",route?.params?.userCartData);
        console.log("route?.params=============",route?.params?.selfPickup);
        async function getLoggedInUserData() {
            const userData = await AsyncStorage.getItem('userData');
            const userDataObj = JSON.parse(userData);
            console.log('logged_in_userData-----------------', userDataObj);
            setUserId(userDataObj?.userId);
            setUserDetails(userDataObj);
        };
        getLoggedInUserData();
    },[]);

    handleChangeAddress = (val) => {
        setAddress(val);
        setUserDetails((currentDetails) => {
            return {
              ...currentDetails,
              address: val
            };
        });
    }

    const handleCheckout = async() => {
        try {
            setLoading(true);
            if(acceptTnC == false) {
                setAcceptTnCError(true);
                setLoading(false);
                return false;
            } else {
                setAcceptTnCError(false);
            }
    
            if(userDetails?.phoneNumber == "") {
                setPhoneNoError(true);
                setLoading(false);
                return false;
            } else {
                setPhoneNoError(false);
            }

            if(address == '') {
                setAddressError(true);
                setLoading(false);
                return false;
            } else {
                setAddressError(false);
            }
            
            const payloadData = {
                "userId":userDetails?.userId,
                "SelfPickupDrop": route?.params?.selfPickup,
                "Contact": userDetails?.phoneNumber,
                "Address": address
            }
            console.log("payloadData----------------", payloadData);
            
            const res = await postRequest('/api/Toys/CreateOrder', JSON.stringify(payloadData), 'POST');
            const resData = await res.json();
            console.log("resData----------------", resData);
    
            if(resData?.success == true) {
                if(resData?.razorpay == true) {
                    var options = {
                        description: 'Product Purchase',
                        image: 'https://toyrentjunction.com/Images/logo/logo%20148%20by%2048.png',
                        currency: 'INR',
                        key: resData.data?.razorpayKey, // Replace this with your actual Razorpay key id
                        // key: 'rzp_test_6aOguOVuPB9j5j', // Replace this with your actual Razorpay key id
                        amount: resData?.data?.totalAmount, // Amount is in the smallest currency unit (e.g., paise for INR)
                        // amount: item.totalAmount * 100, // Amount is in the smallest currency unit (e.g., paise for INR)
                        name: `${userDetails?.firstName} ${userDetails?.lastName}`,
                        prefill: {
                            email: userDetails?.email,
                            contact: userDetails?.phoneNumber,
                            name: `${userDetails?.firstName} ${userDetails?.lastName}`
                        },
                        theme: {color: '#53a20e'}
                    };
    
                    RazorpayCheckout.open(options).then(async(data) => {
                        // Handle success
                        console.log(`Success------------------: ${data}`);
                        console.log('dataaaaaaaaa--------------------',data);
                        console.log(`Success: ${data}`);
                        let dataToSend = resData.data;
                        dataToSend.rzpOrderId = resData?.data?.orderId;
                        dataToSend.rzpPaymentId = data.razorpay_payment_id;
                        dataToSend.rzpSignatureId = data.razorpay_payment_id;
                        console.log("dataToSend==============================",dataToSend);

                        
                        const res = await postRequest('/api/Toys/CompleteOrderPayment', JSON.stringify(dataToSend), 'POST');
                        const resData2 = await res.json();
                        console.log("CompleteOrderPayment_resData2==============================",resData2);
                        if(resData2?.success == true) {
                            setLoading(false);
                            navigation.navigate('MyOrder')
                        } else {
                            setLoading(false);
                        }
                        // alert(`Success: Payment ID: ${data.razorpay_payment_id}`);
                    }).catch((error) => {
                        // Handle error
                        setLoading(false);
                        console.log(`Error: ${error.code} | ${error.description}`);
                        // alert(`Error: ${error.description}`);
                    });
                } else if(resData?.razorpay == false && resData?.value == "Order submitted successfully.") {
                    setLoading(false);
                    Alert.alert(resData?.value);
    
                    Alert.alert(
                        resData?.value, // title of the alert
                        "", // message of the alert
                        [
                            {
                            text: 'OK',
                            onPress: () => navigation.navigate('MyOrder'), // Replace 'TargetScreenName' with the name of the screen you want to navigate to
                            },
                        ],
                        { cancelable: true } // This prevents the alert from being dismissed by tapping outside of it
                    );
                }
            }
        } catch (error) {
            setLoading(false);
        } finally {
            setLoading(false);
        }

        
        

    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <AppTopBar navigation={navigation} title={'Checkout'} />
            
            {loading &&<View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
            </View>}

            <ScrollView style={{ flex: 1, marginTop:30 }}>
                {userDetails && 
                    <View style={[styles.card, {padding:20}]}>
                        <Text style={{ fontWeight:'bold', color:'black' }}>Contact Details</Text>
                        <View style={styles?.formContainer}>
                            <View style={styles.formRowContainer}>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>First Name</Text>
                                    <View style={styles.inputWrapper}>
                                        <TextInput
                                            value={userDetails?.firstName}
                                            style={styles.input} 
                                            // onChangeText={(text) => setUserDetails({ ...userDetails, firstName: text })}
                                        />
                                    </View>
                                </View>

                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Last Name</Text>
                                    <View style={styles.inputWrapper}>
                                        <TextInput
                                            value={userDetails?.lastName}
                                            style={styles.input} 
                                            // onChangeText={(text) => setUserDetails({ ...userDetails, lastName: text })}
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
                                </View>
                            {/* </View> */}


                            <View style={[styles.inputContainer, , { width:'100%' }]}>
                                <Text style={styles.label}>Contact</Text>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        value={userDetails?.phoneNumber}
                                        style={styles.input} 
                                        onChangeText={(text) => setUserDetails({ ...userDetails, phoneNumber: text })}
                                    />
                                </View>
                                {phoneNoError && <Text style={styles.error} >Mobile No. is required.</Text>}
                            </View>

                            {/* 3rd Row */}
                            {/* <View style={styles.formRowContainer}>
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
                            </View> */}

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
                            {addressError && <Text style={styles.error} >Please enter full address.</Text>}
                        </View>

                        <View style={styles.bottomTopContent, {flexDirection:'column', paddingVertical:10, padding:0 }} >
                            <View style={{flexDirection:'row', alignItems:'center', gap: 2, justifyContent:'center'}} >
                                <CheckBox
                                    value={acceptTnC}
                                    onValueChange={()=>setAcceptTnC(!acceptTnC)}
                                    tintColors={{ true: '#50BFE9', false: '#50BFE9' }} // Customize your color
                                />
                                <Text style={styles.bottomTopContentStartText} >I agree with the terms and conditions.</Text>
                            </View>
                            {acceptTnCError && <Text style={styles.error} >Please accept the terms and conditions.</Text>}
                        </View>

                        <CustomButton title={'Proceed to checkout'} onPress={handleCheckout} />
                    </View>
                }
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    loader: {
        position:'fixed',
        zIndex:9999,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        height:'100%'
    },
    loaderContainer: {
        position:'absolute',
        zIndex:9999,
        display:'flex',
        height:'100%',
        width:'100%'
    },
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

export default CartCheckoutForm;