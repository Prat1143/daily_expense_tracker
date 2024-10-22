/* eslint-disable prettier/prettier */
import { View, Text, SafeAreaView, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { appBackColor } from '../styles/colors'
import AppTopBar from '../components/AppTopBar'
import { Image } from 'react-native'
import { starRedIcon } from '../assets/icons'
import { bagImage } from '../assets/images/home'
import { globalMarginTop } from '../styles/size'
import GlobalMargin from '../components/GlobalMargin'
import { getRequest } from '../utils/api_call'
import { getStoredUserData } from '../utils/common'
import { API_URL } from '../constants/constant';

const MyOrderDetailsScreen = ({navigation, route}) => {
    const { orderId } = route?.params;

    // console.log("orderId===========",route?.params);

    const [orderDetails, setOrderDetails] = useState([]);
    const [totalRent, setTotalRent] = useState('');
    const [deliveryPickupCost, setDeliveryPickupCost] = useState('');
    const [gst, setGst] = useState(0);
    const [refundableDeposit, setRefundableDeposit] = useState('');

    const getOrderDetails = async () => {
        try {
            const userData = await getStoredUserData();
            const res = await getRequest(`/api/Toys/GetOrdersItemsDetail/${orderId}/${userData?.userId}`);
            const resData = await res.json();
            var totRent = 0;
            // console.log(' ======= getOrderDetails =======', resData);
            if (res.status === 200 && resData?.success) {
                setOrderDetails(resData?.data);
                await resData?.data.map((val,id)=>{
                    console.log(' ======= val =======', val);
                    totRent = totRent + parseFloat(val?.rent);
                });
                setTotalRent(totRent);
                setGst(totRent * 0.18);
            }
        } catch (err) {
            console.log('err', err);
        }
    };

    useEffect(() => {
        getOrderDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderId]);

  return (
    <SafeAreaView style={styles.container} >
        <AppTopBar navigation={navigation} title={'My Order Details'} />
        <ScrollView contentContainerStyle={styles.contentContainer}>
            <GlobalMargin />
        <View style={{marginVertical:10}} >
            {/* Card Section */}
            {orderDetails.map((item, id) =>(
                <View key={id} style={styles.card} >
                <View style={styles.topContent} >
                <View>
                    <Image source={{uri: `${API_URL}${item?.imageUrl}`}} style={{width:86, height:86, borderRadius:16}} />
                </View>
            <View>
                <Text style={styles.orderText}> Order Id: <Text style={{fontFamily:'DMSans-Medium', color:'#1F1F1F'}} > {item?.id}</Text> </Text>
                <Text style={styles.dateText}> {item?.bookingStart} </Text>
                <View style={{flexDirection:'row', alignItems:'center', marginVertical:10, gap:3}} >
                    <Image source={starRedIcon} style={{width:18, height:18}} />
                    <Text style={styles.ratingText} > 4.5 </Text>
                </View>
            </View>
                </View>
                <View style={styles.flexWithJustifyBetween} >
                    <Text style={styles.cardBottomStartText} >Booking Date : </Text>
                    <Text style={styles.cardBottomEndText} >{item?.bookingEnd}</Text>
                </View>
                <View style={styles.flexWithJustifyBetween} >
                    <Text style={styles.cardBottomStartText} >Rent : </Text>
                    <Text style={styles.cardBottomEndText} >{item?.rent}</Text>
                </View>
                <View style={styles.flexWithJustifyBetween} >
                    <Text style={styles.cardBottomStartText} >Refund Deposit : </Text>
                    <Text style={styles.cardBottomEndText} > {item?.deposit ? item?.deposit : 0} </Text>
                </View>
        </View>
            ))}
            <View style={styles.card} >
                <View style={styles.flexWithJustifyBetween} >
                    <Text style={styles.cardBottomStartText} >Total Rent : </Text>
                    <Text style={styles.cardBottomEndText} >{totalRent}</Text>
                </View>
                <View style={styles.flexWithJustifyBetween} >
                    <Text style={styles.cardBottomStartText} >Delivery & Pickup : </Text>
                    <Text style={styles.cardBottomEndText} >NA</Text>
                </View>
                <View style={styles.flexWithJustifyBetween} >
                    <Text style={styles.cardBottomStartText} >GST(18%) : </Text>
                    <Text style={styles.cardBottomEndText} >{gst?.toFixed(2)}</Text>
                </View>
                <View style={styles.flexWithJustifyBetween} >
                    <Text style={styles.cardBottomStartText} >Refundable deposit : </Text>
                    <Text style={styles.cardBottomEndText} >NA</Text>
                </View>
                <View style={[styles.priceContentContainer]} >
                    <Text style={styles.totalPaidText} >Total Paid :</Text>
                    <Text style={styles.totalPaidPrice} >{totalRent+gst}</Text>
                </View>
        </View>
        </View>
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
    card: {
        backgroundColor:'#FFF',
        padding: 10,
        elevation: 2,
        shadowColor: '#171717',
        borderRadius: 16,
        marginBottom:10,
    },
    orderText: {
        color: '#545454',
        fontFamily: 'DMSans-Regular',
        fontSize: 16,
        marginVertical:3,
    },
    dateText: {
        color: '#545454',
        fontSize: 13,
        fontFamily: 'DMSans-Regular',
        marginVertical:3,
    },
    bottomText: {
        color: '#50BFE9',
        fontFamily: 'DMSans-Regular',
        fontSize: 12,
        textTransform:'capitalize',
    },
    ratingText: {
        color: '#363636',
        fontFamily: 'DMSans-Medium',
        fontSize: 12,
    },
    topContent: {
        borderBottomWidth: 1,
        borderBottomColor:'#E2EBF0',
        flexDirection:'row',
        gap: 10,
        paddingBottom:10,
    },
    flexWithJustifyBetween: {
        flexDirection:'row',
        justifyContent:'space-between',
        marginVertical:10,
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

export default MyOrderDetailsScreen