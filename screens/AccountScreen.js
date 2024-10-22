/* eslint-disable prettier/prettier */
import {View, Text, ScrollView, StyleSheet, Image} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, Linking } from 'react-native';
import AppTopBar from '../components/AppTopBar';
import GlobalMargin from '../components/GlobalMargin';
import { appBackColor } from '../styles/colors';
import { deviceWidth } from '../styles/size';
import { profileImg } from '../assets/images/account';
import { cameraIcon, circleArrowRightIcon, circleArrowUpIcon, heartBlueIcon, locationIcon, noteBlueIcon, passCheckBlueIcon, questionBlueIcon, shoppingCartBlueIcon, userGroupBlueIcon, userSquareBlueIcon, walletBlueIcon } from '../assets/icons';
import { TouchableOpacity } from 'react-native';
import CustomButton from '../components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStoredUserData } from '../utils/common';
import { getRequest } from '../utils/api_call';
import { API_URL } from '../constants/constant';


const AccountScreen = ({navigation}) => {

const handleNavigation = (screenName) => {
    navigation.navigate(screenName);
};

const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.navigate('Login');
};

const [profileData, setProfileData] = useState({});
const [profieImage, setProfileImage] = useState();
const [depositMoney, setDepositMoney] = useState();
const [walletAmount, setWalletAmount] = useState();


const getProfileImage = async () => {
    const userData = await getStoredUserData();
    console.log("🚀 ~ ===== getProfileImage ==== ~  =======userData========:", userData)
    const res = await getRequest(`/api/Toys/GetUserProfileImagetByUserId/${userData?.userId}`);
    const resData = await res.json();
    if (resData?.success) {
        // setProfileData({...profileData, image: resData?.data});
        console.log("GetUserProfileImagetByUserId_resData==================", resData)
        setProfileImage(resData?.data);
    }
    console.log('getProfileImage data ---------', resData);
};

const getWalletAmount = async () => {
    try {
        const userData = await getStoredUserData();
        const res = await getRequest(`/api/Toys/GetWalletAmountByUserId/${userData?.userId}`);
        const resData = await res.json();
        console.log('getWalletAmount --------', resData);
        if (resData?.success && res.status === 200) {
            setWalletAmount(resData?.data);
        }
    } catch (err) {
        console.log('err', err);
    }
};


const getSecurityDeposit = async () => {
    const userData = await getStoredUserData();
    const res = await getRequest(`/api/Toys/GetSecurityDepositByUserId/${userData?.userId}`);
    const resData = await res.json();
    if (resData?.success) {
        setDepositMoney(resData?.data);
    }
    console.log('getSecurityDeposit data ---------', resData, res.status);
};


const getProfileData = async () => {
    try {
        const userData = await getStoredUserData();
        const res = await getRequest(`/api/Toys/GetUserProfile/${userData?.userId}`);
        const resData = await res.json();
        console.log('GetUserProfile==================-----', resData?.imagePath);
        const data = {fullName: `${resData?.data?.firstName} ${resData?.data?.lastName}`, email: resData?.data?.email};
        setProfileData({...profileData, ...data});
    } catch (err) {
        console.log('err', err);
    }
};

console.log('🚀 ~ AccountScreen ~ profileData:', profileData);


useEffect(() => {
    getProfileData();
    getProfileImage();
    getSecurityDeposit();
    getWalletAmount();
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

const handleSecurityFormRedirection = () => {
    console.log("handleSecurityFormRedirection-----------");
    navigation.navigate('SecurityDepositForm');
}

const handleDeleteAccount = () => {

}

return (
    <SafeAreaView style={styles.container} >
        <AppTopBar navigation={navigation} title={'Account'} />
        <ScrollView contentContainerStyle={{paddingHorizontal:20}} >
            <GlobalMargin />
            <View style={styles.profileSection}>
                <View style={styles.profileImgContainer} >
                    <Image source={{uri: `${API_URL}${profieImage}`}} style={styles.profileImg}  />
                    {/* <View style={styles.cameraIconWrapper} >
                        <Image source={cameraIcon} style={styles.cameraIcon} />
                    </View> */}
                </View>
                <View style={styles.profileData}>
                    <Text style={styles.profileName}> {profileData?.fullName} </Text>
                    <Text style={styles.profileEmail}> {profileData?.email} </Text>
                </View>
            </View>

            {/* Wallet Card */}
            <View style={{marginTop:20}} >
            <View style={styles.cardContainer}>
                <View
                    // onPress={() => handleAccordionToggle(1)}
                    style={[styles.cardHeader, { backgroundColor: '#FFF' }]}
                >
                <View style={styles.iconContainer}  >
                <View style={styles.iconBox} >
                    <Image source={walletBlueIcon} style={styles.icon} />
                </View>
                    <Text style={styles.cardTitle}>Wallet</Text>
                </View>
                    <Text style={styles.cardEndText} >₹{walletAmount}</Text>
                </View>
                </View>

                {/* Security Deposite Card  */}
                <View style={styles.cardContainer}>
                <TouchableOpacity
                    style={[styles.cardHeader, { backgroundColor: '#FFF' }]}
                    onPress={handleSecurityFormRedirection}
                >
                <View style={styles.iconContainer}  >
                <View style={styles.iconBox} >
                    <Image source={passCheckBlueIcon} style={styles.icon} />
                </View>
                    <Text style={styles.cardTitle}>Security Deposit</Text>
                </View>
                <View style={{flexDirection:'row', gap:8}} >
                <Text style={styles.cardEndText} >₹{depositMoney?.split('.')[0]}</Text>
                <Image
                source={circleArrowRightIcon}
                style={[styles.expandIcon]}
                />
                </View>
                </TouchableOpacity>
                </View>


                {/* My Order Card  */}
                <View style={styles.cardContainer}>
                <TouchableOpacity
                    onPress={() => handleNavigation('MyOrder')}
                    style={[styles.cardHeader, { backgroundColor: '#FFF' }]}
                >
                <View style={styles.iconContainer}  >
                <View style={styles.iconBox} >
                    <Image source={shoppingCartBlueIcon} style={styles.icon} />
                </View>
                    <View>
                    <Text style={styles.cardTitle}>My Order</Text>
                    <Text style={styles.cardDesc}>Order History</Text>
                    </View>
                </View>
                <View style={{flexDirection:'row', gap:8}} >
                    <Image
                    source={circleArrowRightIcon}
                    style={[styles.expandIcon]}
                    />
                </View>
                </TouchableOpacity>
                </View>

                {/* My Subscription Card */}
                <View style={styles.cardContainer}>
                <TouchableOpacity
                    onPress={() => handleNavigation('MySubscription')}
                    style={[styles.cardHeader, { backgroundColor: '#FFF' }]}
                >
                <View style={styles.iconContainer}  >
                <View style={styles.iconBox} >
                    <Image source={noteBlueIcon} style={styles.icon} />
                </View>
                    <View>
                    <Text style={styles.cardTitle}>My subscription</Text>
                    <Text style={styles.cardDesc}>Active membership plan</Text>
                    </View>
                </View>
                <View style={{flexDirection:'row', gap:8}} >
                    <Image
                    source={circleArrowRightIcon}
                    style={[styles.expandIcon]}
                    />
                </View>
                </TouchableOpacity>
                </View>


                {/* Manage Account Card */}
                <View style={styles.cardContainer}>
                <TouchableOpacity
                    onPress={() => handleNavigation('ManageAccount')}
                    style={[styles.cardHeader, { backgroundColor: '#FFF' }]}
                >
                <View style={styles.iconContainer}  >
                <View style={styles.iconBox} >
                    <Image source={userSquareBlueIcon} style={styles.icon} />
                </View>
                    <View>
                    <Text style={styles.cardTitle}>Manage Account</Text>
                    <Text style={styles.cardDesc}>Saved address, account details</Text>
                    </View>
                </View>
                <View style={{flexDirection:'row', gap:8}} >
                    <Image
                    source={circleArrowRightIcon}
                    style={[styles.expandIcon]}
                    />
                </View>
                </TouchableOpacity>
                </View>

                
                {/* Wishlist Card */}
                {/* <View style={styles.cardContainer}>
                <TouchableOpacity
                    onPress={() => handleNavigation('Wishlist')}
                    style={[styles.cardHeader, { backgroundColor: '#FFF' }]}
                >
                <View style={styles.iconContainer}  >
                <View style={styles.iconBox} >
                    <Image source={heartBlueIcon} style={styles.icon} />
                </View>
                    <View>
                    <Text style={styles.cardTitle}>Wishlist</Text>
                    <Text style={styles.cardDesc}>Add your favourite products</Text>
                    </View>
                </View>
                <View style={{flexDirection:'row', gap:8}} >
                    <Image
                    source={circleArrowRightIcon}
                    style={[styles.expandIcon]}
                    />
                </View>
                </TouchableOpacity>
                </View> */}

                {/* Refer & Earn Card */}
                {/* <View style={styles.cardContainer}>
                <TouchableOpacity
                    // onPress={() => handleNavigation('')}
                    style={[styles.cardHeader, { backgroundColor: '#FFF' }]}
                >
                    <View style={styles.iconContainer}  >
                    <View style={styles.iconBox} >
                        <Image source={userGroupBlueIcon} style={styles.icon} />
                    </View>
                        <View>
                        <Text style={styles.cardTitle}>Refer & Earn</Text>
                        </View>
                    </View>
                    <View style={{flexDirection:'row', gap:8}} >
                        <Image
                        source={circleArrowRightIcon}
                        style={[styles.expandIcon]}
                        />
                    </View>
                </TouchableOpacity>
                </View> */}


                    {/* Help center Card */}
                    <View style={styles.cardContainer}>
                        <View
                            // onPress={() => handleNavigation('ContactUs')}
                            style={[styles.cardHeader, { backgroundColor: '#FFF' }]}
                        >
                            <View style={styles.iconContainer}  >
                                <View style={styles.iconBox} >
                                    <Image source={questionBlueIcon} style={styles.icon} />
                                </View>
                                <View>
                                    <Text style={styles.cardTitle}>Help Center</Text>
                                    <Text style={styles.cardDesc}>91 8983900282</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.cardContainer}>
                        <TouchableOpacity
                            onPress={() => {
                                Linking.openURL('https://www.toyrentjunction.com/Identity/Account/Manage/PersonalData');
                            }}
                            style={[styles.cardHeader, { backgroundColor: '#FFF' }]}
                        >
                        <View style={styles.iconContainer}  >
                            <View style={styles.iconBox} >
                                <Image source={userSquareBlueIcon} style={styles.icon} />
                            </View>
                            <View>
                                <Text style={styles.cardTitle}>Delete Account</Text>
                            </View>
                        </View>
                        <View style={{flexDirection:'row', gap:8}} >
                            <Image
                            source={circleArrowRightIcon}
                            style={[styles.expandIcon]}
                            />
                        </View>
                        </TouchableOpacity>
                    </View>

                <View style={{display:'flex', alignItems:'center', marginVertical:20}} >
                    <CustomButton onPress={handleLogout} buttonStyle={{width:deviceWidth * 0.574}}  title={'Log Out'} />
                </View>

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
    profileSection: {
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
    },
    profileImgContainer: {
        borderRadius: 100,
        borderWidth: 10,
        borderColor:'#FFFFFF',
        width: deviceWidth * 0.35,
        height: deviceWidth * 0.35,
        alignItems:'center',
        justifyContent:'center',
        elevation: 1,
    },
    profileImg: {
        width: deviceWidth * 0.25,
        height: deviceWidth * 0.25,
        resizeMode:'center',
    },
    cameraIconWrapper: {
        position:'absolute',
        backgroundColor: '#EB5F0A',
        borderRadius: 100,
        borderWidth: 1,
        borderColor: '#FFFFFF',
        width: 28,
        height: 28,
        alignItems:'center',
        justifyContent:'center',
        bottom: 0,
        right:-10,
    },
    cameraIcon: {
        width: 15,
        height: 15,
    },
    profileData: {
        gap: 10,
        marginTop: 20,
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        textAlign:'center'
    },
    profileName: {
        color: '#1F1F1F',
        fontFamily: 'DMSans-Bold',
        fontSize: 20,
    },
    profileEmail: {
        color: '#EB5F0A',
        fontFamily: 'DMSans-Regular',
        fontSize: 13,
    },

    cardContainer: {
        marginVertical: 5,
      },
      cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        paddingVertical: 10,
        borderRadius: 15,
        elevation: 2,
        shadowColor: '#0C0C0C',
        padding: 10,
      },
      cardTitle: {
        // marginVertical: 10,
        color: '#1F1F1F',
        fontFamily:'DMSans-Bold',
        fontSize: 16,
      },
      cardEndText: {
        color: '#EB5F0A',
        fontFamily: 'DMSans-SemiBold',
        fontSize: 17,
      },
      cardDesc: {
        color: '#545454',
        fontFamily: 'DMSans-Regular',
        fontSize: 12,
        marginTop:4,
      },
      expandIcon: {
        width: 24,
        height: 24,
      },
      iconContainer: {
        flexDirection:'row',
        alignItems:'center',
        gap: 15,
      },
      iconBox: {
        backgroundColor: '#F3F9FC',
        width: 48,
        height: 48,
        borderRadius: 15,
        alignItems:'center',
        justifyContent:'center',
      },
      icon: {
        width: 22,
        height: 22,
      },

});

export default AccountScreen;