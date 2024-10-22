/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import { View, SafeAreaView, ScrollView, StyleSheet, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import AppTopBar from '../components/AppTopBar';
import { appBackColor } from '../styles/colors';
import GlobalMargin from '../components/GlobalMargin';
import MemberShipCard from '../components/membership/MemberShipCard';
import NotesSection from '../components/membership/NotesSection';
import { getRequest } from '../utils/api_call';

const MemberShipScreen = ({navigation}) => {
    // const memberShipData = [
    //     {id:1, title: 'Silvers', price:'500', icon: heartBlueIcon}
    //     ,{id:2, title:'Gold', price:'700', icon: starBlueIcon}
    //     ,{id:3, title: 'Platinum', price: '900', icon:crownBlueIcon},
    // ];


    const [memberShipData, setMemberShipData] = useState([]);

    const getMemberShipData = async () => {
        const res = await getRequest('/api/Toys/GetAllMembership');
        const resData = await res.json();
        console.log('membershipData-------', resData?.data[0]);
        setMemberShipData(resData?.data);
    };

    useEffect(() => {
        getMemberShipData();
    }, []);

  return (
    <SafeAreaView style={styles.container}>
        <AppTopBar title={'Membership'} navigation={navigation} />
        <ScrollView contentContainerStyle={{paddingHorizontal:20}} >
            <GlobalMargin />
            <View>
                {/* Membership card section */}
                {/* <FlatList
                data={memberShipData}
                renderItem={MemberShipCard}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{marginRight:10}} />}
                /> */}

                <FlatList
                    data={memberShipData}
                    renderItem={({ item }) => <MemberShipCard item={item} navigation={navigation} />}
                    keyExtractor={item => item.id.toString()} // Also ensure the key is a string
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={{ marginRight: 10 }} />}
                />

                {/* Notes Section */}
                <NotesSection />
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
});

export default MemberShipScreen;