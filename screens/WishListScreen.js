/* eslint-disable prettier/prettier */
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { appBackColor } from '../styles/colors';
import { ScrollView } from 'react-native';
import AppTopBar from '../components/AppTopBar';
import { Image } from 'react-native';
import { girlNavyPanther } from '../assets/images/wishlist';
import { heartRedIcon } from '../assets/icons';
import { deviceWidth, globalMarginTop } from '../styles/size';
import GlobalMargin from '../components/GlobalMargin';

const WishListScreen = ({navigation}) => {
    useEffect(()=> {
        getWishListData();
        // const wishlistRes = await getRequest(`/api/Toys/GetCapital`);
        // const resWishlistData = await wishlistRes.json();
    },[]);

    const getWishListData = () => {
    }

  return (
    <SafeAreaView style={styles.container}>
        <AppTopBar navigation={navigation} title={'Wishlist'}/>
        <ScrollView contentContainerStyle={styles.contentContainer} >
            <GlobalMargin />
            <View style={styles.cardSection} >
                {/* Card */}
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_, id)=> (
                    <View key={id} style={styles.card}>
                    <View style={styles.imgContainer}>
                        <Image source={girlNavyPanther} style={{width: deviceWidth * 0.239,  height: deviceWidth * 0.239, borderRadius: 16}} />
                    </View>
                    <View style={{width: '70%'}} >
                         <Text style={styles.cardTitle} >Girl Navy Panther</Text>
                         <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingRight: 10, marginTop:10}} >
                            <View style={{gap:10}} >
                            <View style={{flexDirection:'row', alignItems:'center', gap:4}} >
                                <Text style={styles.daysText} >14 Days</Text>
                                <Text style={styles.rentText} >Rent</Text>
                            </View>
                            <Text style={styles.priceText} >₹829</Text>
                            </View>
                            <TouchableOpacity style={styles.button} >
                                <Text style={styles.buttonText} >Add To Cart</Text>
                            </TouchableOpacity>
                         </View>
                    </View>
                    <TouchableOpacity style={styles.heartContainer} >
                    <Image source={heartRedIcon} style={{width:20, height:20}} />
                    </TouchableOpacity>
                </View>
                ))} 
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
    cardSection: {
        marginVertical: 10,
    },
    card: {
        backgroundColor:'#FFF',
        borderRadius: 16,
        padding: 10,
        flexDirection:'row',
        gap: 10,
        marginBottom:10,
        elevation: 2,
        shadowColor: '#171717',
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
        width: deviceWidth * 0.312,
        borderColor:'#50BFE9',
        height: deviceWidth * 0.106,
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
});

export default WishListScreen;