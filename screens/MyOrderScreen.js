/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import { View, Text, SafeAreaView, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { appBackColor } from '../styles/colors';
import AppTopBar from '../components/AppTopBar';
import { Image } from 'react-native';
import { starRedIcon } from '../assets/icons';
import { globalMarginTop, globalViewHeight } from '../styles/size';
import GlobalMargin from '../components/GlobalMargin';
import { getRequest } from '../utils/api_call';
import { getStoredUserData } from '../utils/common';

const MyOrderScreen = ({navigation}) => {

    const [orders, setOrders] = useState([]);

    const getOrdersData = async () => {
        try {
            const userData = await getStoredUserData();
            const res = await getRequest(`/api/Toys/GetUserOrdersByUserId/${userData?.userId}`);
            const resData = await res.json();
            console.log('getOrdersData========', resData?.data[0]);
            if (res.status === 200 && resData?.success) {
                setOrders(resData?.data);
            }
        } catch (err) {
            console.log('err', err);
        }
    };

    useEffect(() => {
        getOrdersData();
    }, []);
  return (
    <SafeAreaView style={styles.container} >
        <AppTopBar navigation={navigation} title={'My Order'} />
        <ScrollView contentContainerStyle={styles.contentContainer}>
            <GlobalMargin />
        <View style={{marginVertical:10}} >
            {/* Card Section */}
        {orders.map((item, id) => (
            <TouchableOpacity key={id} onPress={() => navigation.navigate('MyOrderDetails', {orderId: item?.orderId})}  style={styles.card} >
                <View>
                    <Text style={styles.orderText}> Order Id: <Text style={{fontFamily:'DMSans-Medium', color:'#1F1F1F'}} > {item?.orderId}</Text> </Text>
                    <Text style={styles.dateText}> {item?.deliveryDate ? item?.deliveryDate : 'Date not added '} </Text>
                </View>
                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}} >
                    <Text style={styles.bottomText}>{item?.status.replace(/<[^>]+>/g, '')}</Text>
                    <View style={{flexDirection:'row', alignItems:'center', marginVertical:10, gap:3}} >
                        <Image source={starRedIcon} style={{width:18, height:18}} />
                        <Text style={styles.ratingText} > 4.5 </Text>
                    </View>
                </View>
            </TouchableOpacity>
        ))}
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
    card: {
        backgroundColor:'#FFF',
        padding: 15,
        elevation: 2,
        shadowColor: '#171717',
        borderRadius: 16,
        marginBottom:10,
    },
    orderText: {
        color: '#545454',
        fontFamily: 'DMSans-Regular',
        fontSize: 16,
        marginVertical:5,
    },
    dateText: {
        color: '#545454',
        fontSize: 13,
        fontFamily: 'DMSans-Regular',
        marginVertical:5,
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
    }
});

export default MyOrderScreen;