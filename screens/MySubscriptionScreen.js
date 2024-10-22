/* eslint-disable prettier/prettier */
import { View, Text, SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import React, {useEffect, useState} from 'react';
import { appBackColor } from '../styles/colors';
import AppTopBar from '../components/AppTopBar';
import { Image } from 'react-native';
import { checkCircleBlueIcon, crownBlueIcon, heartBlueIcon, starBlueIcon, starRedIcon } from '../assets/icons';
import { bagImage } from '../assets/images/home';
import { deviceWidth, globalMarginTop } from '../styles/size';
import GlobalMargin from '../components/GlobalMargin';
import CustomButton from '../components/CustomButton';
import { getRequest } from '../utils/api_call';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RenderHtml from 'react-native-render-html';

const MySubscriptionScreen = ({navigation}) => {
    const [userId, setUserId] = useState('');
    const [mySubscriptions, setMySubscriptions] = useState([]);

    useEffect(() => {
        getMySubscriptions();
    }, []);

    const getMySubscriptions = async() => {
        const userData = await AsyncStorage.getItem('userData');
        const userDataObj = JSON.parse(userData);
        console.log('logged_in_userData-----------------', userDataObj?.userId);
        setUserId(userDataObj?.userId);

        const res = await getRequest(`/api/Toys/GetSubscriptions/${userDataObj?.userId}`);
        const resData = await res.json();
        console.log("getMySubscriptions============",resData);
        setMySubscriptions(resData?.data);
    }

    const handleMembershipRedirection = () => {
        console.log("TEST----------")
        navigation.navigate('Membership');
    }
    
  return (
    <SafeAreaView style={styles.container} >
        <AppTopBar navigation={navigation} title={'My Subscription'} />
        <ScrollView contentContainerStyle={styles.contentContainer}>
            <GlobalMargin />
            {mySubscriptions.length > 0 ? 
                <View style={{marginVertical:10}} >
                    {/* Subscription Card Section */}
                    {/* Silver Plan Card */}

                    {
                        mySubscriptions?.map((val, idx)=> {
                            console.log("my_sub===============",val);
                            const shortHeadingSource = { html: val.status };
                            return (
                                <View style={styles.card} >
                                    <View style={styles.topContent} >
                                        <View style={{flexDirection:'row', gap:10}} >
                                            <View style={styles.topIconWrapper} >
                                                <Image source={heartBlueIcon} style={styles.icon} />
                                            </View>
                                            <View>
                                                <Text style={styles.orderText}> {val?.membershipName} Plan:  </Text>
                                                <View style={styles.expiredWrapper} >
                                                    {/* <Text style={styles.expireText}> {val?.status} </Text> */}
                                                    <RenderHtml contentWidth={deviceWidth} source={shortHeadingSource} />
                                                </View>
                                            </View>
                                        </View>
                                        <View style={styles.priceSection} >
                                            <Text style={styles.priceDigit} > <Text style={styles.priceIcon}>₹</Text>  {val?.totalAmountPaid}</Text>
                                            {/* <Text style={styles.priceText} >per month</Text> */}
                                        </View>
                                    </View>
                                    <View style={styles.flexWithJustifyBetween} >
                                        <Text style={styles.cardBottomStartText} >Date : </Text>
                                        <Text style={styles.cardBottomEndText} >{val?.startDate} - {val?.expireDate}</Text>
                                    </View>
                                    <View style={styles.flexWithJustifyBetween} >
                                        <Text style={styles.cardBottomStartText} >Order/Transaction Id : </Text>
                                        <Text style={styles.cardBottomEndText} >{val?.transactionId}</Text>
                                    </View>
                                </View>
                            );
                        })
                    }

                    {/* <View style={styles.card} >
                        <View style={styles.topContent} >
                            <View style={{flexDirection:'row', gap:10}} >
                                <View style={styles.topIconWrapper} >
                                    <Image source={heartBlueIcon} style={styles.icon} />
                                </View>
                                <View>
                                    <Text style={styles.orderText}> Silver Plan:  </Text>
                                    <View style={styles.expiredWrapper} >
                                    <Text style={styles.expireText}> Expired </Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.priceSection} >
                                <Text style={styles.priceDigit} > <Text style={styles.priceIcon}>$</Text>  19.99</Text>
                                <Text style={styles.priceText} >per month</Text>
                            </View>
                        </View>
                        <View style={styles.flexWithJustifyBetween} >
                            <Text style={styles.cardBottomStartText} >Date : </Text>
                            <Text style={styles.cardBottomEndText} >02 Aug, 2023-09 Aug, 2023</Text>
                        </View>
                        <View style={styles.flexWithJustifyBetween} >
                            <Text style={styles.cardBottomStartText} >Order/Transaction Id : </Text>
                            <Text style={styles.cardBottomEndText} >00694665166</Text>
                        </View>
                    </View> */}

                    {/* Gold Plan Card */}
                    {/* <View style={styles.card} >
                        <View style={styles.topContent} >
                            <View style={{flexDirection:'row', gap:10}} >
                                <View style={styles.topIconWrapper} >
                                    <Image source={starBlueIcon} style={styles.icon} />
                                </View>
                                <View>
                                    <Text style={styles.orderText}> Gold Plan:  </Text>
                                    <View style={styles.expiredWrapper} >
                                    <Text style={styles.expireText}> Active </Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.priceSection} >
                                <Text style={styles.priceDigit} > <Text style={styles.priceIcon}>$</Text>  29.99</Text>
                                <Text style={styles.priceText} >per month</Text>
                            </View>
                        </View>
                        <View style={styles.flexWithJustifyBetween} >
                            <Text style={styles.cardBottomStartText} >Date : </Text>
                            <Text style={styles.cardBottomEndText} >02 Aug, 2023-09 Aug, 2023</Text>
                        </View>
                        <View style={styles.flexWithJustifyBetween} >
                            <Text style={styles.cardBottomStartText} >Order/Transaction Id : </Text>
                            <Text style={styles.cardBottomEndText} >00694665166</Text>
                        </View>
                    </View> */}

                    {/* Platinum Plan Card */}
                    {/* <View style={styles.card} >
                        <View style={styles.topContent} >
                            <View style={{flexDirection:'row', gap:10}} >
                                <View style={styles.topIconWrapper} >
                                    <Image source={crownBlueIcon} style={styles.icon} />
                                </View>
                                <View>
                                    <Text style={styles.orderText}> Platinum Plan:  </Text>
                                    <View style={styles.expiredWrapper} >
                                    <Text style={styles.expireText}> Pause </Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.priceSection} >
                                <Text style={styles.priceDigit} > <Text style={styles.priceIcon}>$</Text>  39.99</Text>
                                <Text style={styles.priceText} >per month</Text>
                            </View>
                        </View>
                        <View style={styles.flexWithJustifyBetween} >
                            <Text style={styles.cardBottomStartText} >Date : </Text>
                            <Text style={styles.cardBottomEndText} >02 Aug, 2023-09 Aug, 2023</Text>
                        </View>
                        <View style={styles.flexWithJustifyBetween} >
                            <Text style={styles.cardBottomStartText} >Order/Transaction Id : </Text>
                            <Text style={styles.cardBottomEndText} >00694665166</Text>
                        </View>
                    </View> */}
                    {/* Subscription Card Section End */}

                    <View>
                        <Text style={styles.bottomTitle} >Vip-Specifc features</Text>
                    </View>
                    <View style={styles.card} >
                        <View style={styles.bottonCardTextWrapper} >
                            <Image source={checkCircleBlueIcon} style={styles.checkIcon} />
                            <Text style={styles.cardBottomStartText} >No Ads </Text>
                        </View>
                        <View style={styles.bottonCardTextWrapper} >
                            <Image source={checkCircleBlueIcon} style={styles.checkIcon} />
                            <Text style={styles.cardBottomStartText} >Faster Connections </Text>
                        </View>
                        <View style={styles.bottonCardTextWrapper} >
                            <Image source={checkCircleBlueIcon} style={styles.checkIcon} />
                            <Text style={styles.cardBottomStartText} >Worldwide Location </Text>
                        </View>
                        <View style={styles.bottonCardTextWrapper} >
                            <Image source={checkCircleBlueIcon} style={styles.checkIcon} />
                            <Text style={styles.cardBottomStartText} >High-speed Unlimited Bandwidth </Text>
                        </View>
                        <View style={[styles.bottonCardTextWrapper, {borderBottomWidth:0}]} >
                            <Image source={checkCircleBlueIcon} style={styles.checkIcon} />
                            <Text style={styles.cardBottomStartText} >24/7 Customer Support</Text>
                        </View>
                    </View>
                    <View style={{flexDirection:'row', justifyContent:'center', marginVertical: 20}}  >
                        <CustomButton title={'Continue'} onPress={handleMembershipRedirection} buttonStyle={{width: deviceWidth * 0.56}}  />
                    </View>
                </View>
            : 
            <View>
                <View>
                    <Text style={{ textAlign:'center', marginVertical:10 }}>You do not have any active membership plans.</Text>
                </View>
                <View style={{flexDirection:'row', justifyContent:'center', marginVertical: 20}}  >
                    <CustomButton title={'View Memberships'} onPress={handleMembershipRedirection} buttonStyle={{width: deviceWidth * 0.56}}  />
                </View>
            </View>
            }
        </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: appBackColor,
    },
    contentContainer: {
        paddingHorizontal: 20,
    },
    topIconWrapper: {
        width: deviceWidth * 0.15,
        height: deviceWidth * 0.15,
        borderRadius: 16,
        backgroundColor: '#F3F9FC',
        alignItems:'center',
        justifyContent:'center',
    },
    icon: {
        width: deviceWidth * 0.067,
        height: deviceWidth * 0.067,
    },
    card: {
        backgroundColor:'#FFF',
        padding: 10,
        elevation: 2,
        shadowColor: '#171717',
        borderRadius: 16,
        marginBottom:10,
    },
    orderText: {
        color: '#1F1F1F',
        fontFamily: 'DMSans-Medium',
        fontSize: 15,
        marginVertical:3,
    },
    expiredWrapper: {
        backgroundColor: '#FFF4EE',
        width: deviceWidth * 0.187,
        // height: deviceWidth * 0.08,
        paddingVertical:5,
        alignItems:'center',
        justifyContent:'center',
        borderRadius: 10,
    },
    expireText: {
        color: '#EB5F0A',
        fontSize: 12,
        fontFamily: 'DMSans-Medium',
    },
    priceSection: {
        justifyContent:'center',
        alignItems:'flex-end',
    },
    priceDigit: {
        color: '#EB5F0A',
        fontSize: 18,
        fontFamily: 'DMSans-Bold',
    },
    priceIcon: {
        color: '#8F8F8F',
        fontFamily: 'DMSans-Regular',
        fontSize: 16,
    },
    priceText: {
        color: '#737373',
        fontSize: 14,
        fontFamily: 'DMSans-Regular',
    },
    topContent: {
        borderBottomWidth: 1,
        borderBottomColor:'#E2EBF0',
        flexDirection:'row',
        justifyContent:'space-between',
        // gap: 10,
        paddingBottom:10,
    },
    bottomTitle: {
        color: '#0C0C0C',
        fontFamily: 'DMSans-Bold',
        fontSize: 28,
        marginVertical: 20,
    },
    flexWithJustifyBetween: {
        flexDirection:'row',
        justifyContent:'space-between',
        marginVertical:10,
    },
    bottonCardTextWrapper: {
        flexDirection:'row',
        gap: 10,
        paddingVertical: 13,
        borderBottomWidth: 1,
        borderBottomColor:'#E2EBF0',
    },
    checkIcon: {
        width: deviceWidth * 0.05,
        height: deviceWidth * 0.05,
    },
    cardBottomStartText: {
        color: '#737373',
        fontFamily: 'DMSans-Regular',
        fontSize: 14,
    },
    cardBottomEndText: {
        color: '#454545',
        fontFamily: 'DMSans-Medium',
        fontSize: 14,
    },
    totalPaidText: {
        color: '#545454',
        fontFamily: 'DMSans-Regular',
        fontSize: 14,
    },
    totalPaidPrice: {
        color: '#0C0C0C',
        fontFamily: 'DMSans-Bold',
        fontSize: 18,
    },
    priceContentContainer: {
        flexDirection:'row',
        justifyContent:'space-between',
        borderTopWidth: 1,
        borderTopColor:'#E2EBF0',
        paddingVertical:10,
    },

})

export default MySubscriptionScreen;