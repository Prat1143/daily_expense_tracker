/* eslint-disable prettier/prettier */
import {View, Text, ScrollView, StyleSheet, Image, SafeAreaView, FlatList, Dimensions, Touchable} from 'react-native';
import React, { useEffect, useState } from 'react';
import AppTopBar from '../components/AppTopBar';
import { appBackColor } from '../styles/colors';
import { deviceWidth } from '../styles/size';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../constants/constant';
import { getStoredUserData } from '../utils/common';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { bagImage, contact_us, franchise, home, how_its_work, membership, our_services } from '../assets/images/home';

const data = [
    { id: '1', title: 'Home', val:"home", imageUrl: home },
    { id: '2', title: 'Services', val:"Services", imageUrl: our_services },
    { id: '3', title: 'How It Works', val:"HowItWork", imageUrl: how_its_work },
    { id: '4', title: 'Membership Plan', val:"Membership", imageUrl: membership },
    { id: '5', title: 'Contact us', val:"ContactUs", imageUrl: contact_us },
    { id: '6', title: 'Become a Franchise', val:"BecameFranchise", imageUrl: franchise },
];

// const numColumns = 3;
// const screenWidth = Dimensions.get('window').width;
// const cardWidth = screenWidth / numColumns;

const cardMargin = 4;
const numColumns = 3;
const screenWidth = Dimensions.get('window').width;
const totalMarginSpace = (numColumns + 1) * 2 * cardMargin;
const cardWidth = (screenWidth - totalMarginSpace) / numColumns;

const MenuScreen = ({navigation}) => {

    const handleNavigation = (screenName) => {
        navigation.navigate(screenName);
    }

    const renderItem = ({ item }) => {
        console.log("item============", item)
        return(
        <TouchableOpacity style={styles.card} onPress={() => handleNavigation(item.val)}>
            {item.imageUrl !==null && <Image source={item.imageUrl} style={styles.cardImage} />}
            <View style={styles.cardTextContainer}>
                <Text >{item.title}</Text>
            </View>
        </TouchableOpacity>
    )};

    return (
        <SafeAreaView style={{ flex:1, alignItems:'center' }}>
          <AppTopBar navigation={navigation} title={'Menu'} />
          <View style={{ marginTop:40 }}>
              <FlatList
                  data={data}
                  renderItem={renderItem}
                  keyExtractor={item => item.id}
                  numColumns={numColumns}
              />
          </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    card: {
        width: cardWidth,
        // Set a fixed height for the card or adjust as needed
        height: 160,
        borderRadius: 10,
        backgroundColor: '#fff',
        margin: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        // Ensure the card content is flexibly laid out
        flexDirection: 'column',
    },
    cardImage: {
        flex: 3, // Takes 4/5 of the space
        width: '100%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        objectFit:'contain',
    },
    cardText: {
        // flex: 1, // Takes 1/5 of the space
        // padding: 5,
        // textAlign: 'center',
        fontSize: 14, // Adjust font size as needed
    },
    cardTextContainer: {
        flex: 1,
        paddingHorizontal: 5,
        // padding: 5,
        textAlign: 'center',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        paddingVertical:5
    }
    // card: {
    //   width: cardWidth,
    //   borderRadius: 10,
    //   backgroundColor: '#fff',
    //   margin: 5,
    //   shadowColor: '#000',
    //   shadowOffset: { width: 0, height: 2 },
    //   shadowOpacity: 0.23,
    //   shadowRadius: 2.62,
    //   elevation: 4,
    // },
    // cardImage: {
    //   width: '100%',
    //   height: '80%',
    //   borderTopLeftRadius: 10,
    //   borderTopRightRadius: 10,
    // },
    // cardText: {
    //   padding: 5,
    //   textAlign: 'center',
    // },
});

export default MenuScreen;
