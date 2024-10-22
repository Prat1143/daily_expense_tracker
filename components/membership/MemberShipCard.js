/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import React, {useState, useEffect} from 'react';
import { deviceWidth } from '../../styles/size';
import { Image } from 'react-native';
import CustomButton from '../CustomButton';
import { crownBlueIcon, heartBlueIcon, starBlueIcon } from '../../assets/icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RazorpayCheckout from 'react-native-razorpay';
import { getRequest, postRequest } from '../../utils/api_call';
import { NavigationContainer } from '@react-navigation/native';
import RenderHtml from 'react-native-render-html';

const MemberShipCard = ({item, navigation}) => {
    const [userId, setUserId] = useState('');
    const [staticData,setStaticData] = useState({});
    
    const detailsSource = { html: item.rentRechargeTagLine };
    const benifitMessage = { html: item.benefits };
    const { width: screenWidth } = Dimensions.get('window');

    // useEffect(()=> {
    //     getMemberships();
    // }, []);

    // const getMemberships = async() => {
    //     const res = await getRequest('/api/Toys/GetAllMembership');
    //     const resData = await res.json();
    //     console.log("resData============",resData?.data);
    // }

    const renderCardIcon = (text) => {
       try {
        if (text === 'Silvers') {
            return heartBlueIcon;
        } else if ( text === 'Gold') {
            return starBlueIcon;
        } else if (text === 'Diamond') {
            return crownBlueIcon;
        } else {
            return crownBlueIcon;
        }
       } catch (err) {
        console.log('err', err);
       }
    };

    const renderCardStaticData = (text) => {
        try {
            if (text === 'Platinum') {
                setStaticData({
                    plan_price : '900',
                    rent_recharge_message :'Get ₹10800 worth of rent value in wallet',
                    benefits_message : 'Get 35% off on Toys, Brain games and Books Category, Get 25% CASH BACK on battery operated Ride-ones and Original Musical Instrument Category \n(Save Up to ₹2,14000 worth of Toys)',
                    percentage:35,
                })

            } else if (text === 'Silvers') {
                    setStaticData({
                        plan_price : '500',rent_recharge_message:'Get 500 worth of rent value in wallet',benefits_message : 'Get 20% off on Toys, Brain games and Books Rent under Library Service \n(Save Up to ₹5000 worth of Toys)',
                        percentage:20,
                    })


            }
            else if (text === 'Gold') {
                setStaticData({
                    plan_price : '700',rent_recharge_message:'Get ₹2100 worth of rent value in wallet',benefits_message : 'Get 25% off on Toys, Brain games and Books Rent under Library Service \n(Save Up to ₹30000 worth of Toys)',  percentage:25,
                })

            }
            else if (text === 'Diamond') {
                setStaticData({
                    plan_price : '800',rent_recharge_message:'Get ₹4800 worth of rent value in wallet',benefits_message : 'Get 30% off on Toys, Brain games and Books Category, Get 15% CASH BACK on battery operated Ride-ones \n(Save Up to ₹80000 worth of Toys)',  percentage:30,
                })

            }
 
        } catch (err) {
         console.log('err', err);
        }
    };

    useEffect(() => {
        console.log("item=====================================]",item)
        renderCardStaticData(item?.libraryMembershipName)
    }, []);

    const handleBuyPlan = async() => {
        console.log("handleBuyPlan============", item);
        console.log("totalAmount============", item?.totalAmount);
        console.log("PLAN_ID============", item?.id);
        const userData = await AsyncStorage.getItem('userData');
        const userDataObj = JSON.parse(userData);
        console.log('logged_in_userData-----------------', userDataObj?.userId);
        setUserId(userDataObj?.userId);

        const res = await getRequest(`/api/Toys/GetMembershipDetail/${item?.id}`);
        const resData = await res.json();
        if(resData?.success == true) {
            console.log("GetMembershipDetail===========",resData);
            navigation.navigate("MembershipCartPage",{membershipDetails:resData?.data});
            // setCityArr(resData?.data);
        }

        
        // var options = {
        //     description: 'Membership Purchase',
        //     image: 'https://toyrentjunction.com/Images/logo/logo%20148%20by%2048.png',
        //     currency: 'INR',
        //     key: 'rzp_test_6aOguOVuPB9j5j', // Replace this with your actual Razorpay key id
        //     amount: item.totalAmount * 100, // Amount is in the smallest currency unit (e.g., paise for INR)
        //     name: `${userDataObj?.firstName} ${userDataObj?.lastName}`,
        //     prefill: {
        //         email: userDataObj?.email,
        //         contact: userDataObj?.phoneNumber,
        //         name: `${userDataObj?.firstName} ${userDataObj?.lastName}`
        //     },
        //     theme: {color: '#53a20e'}
        // };

        // RazorpayCheckout.open(options).then((data) => {
        //     // Handle success
        //     console.log(`Success------------------: ${data}`);
        //     console.log('dataaaaaaaaa--------------------',data);
        //     console.log(`Success: ${data.razorpay_payment_id}`);
        //     // alert(`Success: Payment ID: ${data.razorpay_payment_id}`);
        // }).catch((error) => {
        //     // Handle error
        //     console.log(`Error: ${error.code} | ${error.description}`);
        //     // alert(`Error: ${error.description}`);
        // });

        // console.log('options------------------------------', options);
    }

  return (
    <View style={styles.cardContainer} >
            <View style={styles.card}>
                <View style={{marginBottom:10, gap:10}}  >
                    <View style={styles.iconContainer} >
                    <Image source={renderCardIcon(item?.libraryMembershipName)} style={styles.icon} />
                    </View>
                    <Text style={styles.cardTitle} > {item?.libraryMembershipName} </Text>
                    {/* <Text style={styles.topPriceAmount}> ₹{item?.rentRecharge}<Text style={styles.priceText} > /Month </Text> </Text> */}
                    <Text style={styles.topPriceAmount}> ₹{item?.amountPerMonth}<Text style={styles.priceText} > /Month </Text> </Text>
                    {/* <Text style={styles.topPriceAmount}> ₹{staticData?.plan_price}<Text style={styles.priceText} > /Month </Text> </Text> */}
                </View>

                <View>
                    <View style={styles.cardContent}>
                        <Text style={styles.cardStartText} >Registration fee</Text>
                        <Text style={styles.cardEndText} >₹{item?.registrationFee}</Text>
                    </View>
                    <View style={styles.cardContent}>
                        <View style={styles.cardSubContent} >
                            <Text style={styles.cardStartText} >Rent Recharge</Text>
                            <RenderHtml contentWidth={screenWidth} ignoredDomTags={['font']} source={detailsSource} />
                            {/* <Text style={styles.cardSubText} >{staticData.rent_recharge_message}</Text> */}
                        </View>
                        <Text style={styles.cardEndText} >₹{item?.rentRecharge}</Text>
                    </View>
                    <View style={styles.cardContent}>
                        <Text style={styles.cardStartText} >Validity</Text>
                        <Text style={styles.cardEndText} >{item?.validityInWeeks} Weeks </Text>
                    </View>
                    <View style={styles.cardContent}>
                        <Text style={styles.cardStartText} >Exchange Type</Text>
                        <Text style={styles.cardEndText} >{item?.exchangeType}</Text>
                    </View>
                    <View style={styles.cardContent}>
                        <View style={styles.cardSubContent} >
                        <Text style={styles.cardStartText} >Pick-Up / Delivery Charge</Text>
                        <Text style={styles.cardSubText} >(Per Delivery)</Text>
                        </View>
                        <Text style={styles.cardEndText} >₹{item?.deliverCharges}</Text>
                    </View>
                    <View style={styles.cardContent}>
                        <View style={styles.cardSubContent} >
                            <Text style={styles.cardStartText} >Benefits</Text>
                            {/* <Text style={styles.cardSubText} > */}
                            <RenderHtml contentWidth={screenWidth} ignoredDomTags={['font']} source={benifitMessage} />
                                {/* {staticData.benefits_message}  */}
                            {/* </Text> */}
                        </View>
                        <Text style={styles.cardEndText} >{item.discount}% Off</Text>
                        {/* <Text style={styles.cardEndText} >{staticData.percentage}% Off</Text> */}
                    </View>
                    <View style={styles.cardContent}>
                        <Text style={styles.cardStartText} >Cart Limit</Text>
                        <Text style={styles.cardEndText} >₹{item?.cartLimit}</Text>
                    </View>
                    <View style={styles.cardContent}>
                        <Text style={styles.cardStartText} >Security Deposit (Refundable)</Text>
                        <Text style={styles.cardEndText} >₹{item?.securityDeposit}</Text>
                    </View>
                </View>

                <View style={{justifyContent:'center', display:'flex', gap: 20, marginTop:20, marginBottom:10}} >
                    <CustomButton title={'Buy Plan'} onPress={handleBuyPlan} />
                    <Text style={styles.bottomPriceAmount}> ₹{item?.totalAmount} </Text>
                </View>

            </View>
        </View>
  );
};

const styles = StyleSheet.create({
    cardContainer: {
        marginTop:20,
    },
    card: {
        borderWidth: 2,
        borderColor: '#56C4ED',
        backgroundColor: '#FFF',
        elevation: 2,
        shadowColor: '#171717',
        padding: 10,
        width: deviceWidth * 0.84,
        borderRadius: 16,
        // marginRight: 10,
    },
    iconContainer: {
        width: deviceWidth * 0.145,
        height: deviceWidth * 0.145,
        backgroundColor: '#F3F9FC',
        borderRadius: 16,
        justifyContent:'center',
        alignItems:'center',
    },
    icon: {
        width: deviceWidth * 0.067,
        height: deviceWidth * 0.067,
    },
    cardTitle: {
        color: '#363636',
        fontFamily: 'DMSans-Regular',
        fontSize: 18,
    },
    topPriceAmount: {
        color: '#50BFE9',
        fontFamily: 'DMSans-Bold',
        fontSize: 24,
    },
    priceText: {
        color: '#808080',
        fontFamily: 'DMSans-Regular',
        fontSize: 16,
    },
    cardContent: {
        flexDirection:'row',
        justifyContent:'space-between',
        borderTopWidth: 1,
        borderTopColor: '#E2EBF0',
        paddingVertical: 10,
    },
    cardSubContent: {
        flexDirection:'column',
        // gap: 6,
        width:'70%',
    },
    cardStartText: {
        color: '#545454',
        fontFamily: 'DMSans-Regular',
        fontSize: 13,
    },
    cardSubText: {
        color: '#F67F36',
        fontFamily: 'DMSans-Regular',
        fontSize: 10,
        display:'flex',
        flexWrap:'wrap',
    },
    cardEndText: {
        fontFamily: 'DMSans-Bold',
        color: '#1F1F1F',
        fontSize: 13,
    },
    bottomPriceAmount: {
        color: '#EB5F0A',
        fontFamily: 'DMSans-Bold',
        fontSize: 22,
        textAlign:'center',
    },
})

export default MemberShipCard;