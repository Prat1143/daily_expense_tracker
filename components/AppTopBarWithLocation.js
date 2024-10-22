/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, Linking, TouchableWithoutFeedback } from 'react-native';
import { arrowDownBlackIcon, arrowDownIcon, arrowLeftIconBlack, callIconBlack, heartOutlineBlackIcon, locationIcon, locationRedIcon, searchIcon } from '../assets/icons';
import { StatusBar } from 'react-native';
import { topBarBgImg } from '../assets/images/topbar';
import { deviceHeight, deviceWidth } from '../styles/size';
import DeliveryLocationModal from './DeliveryLocationModal';
import { getRequest } from '../utils/api_call';
import PincodeDropdown from './PincodeDropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useDropdown } from './DropdownContext';

const AppTopBarWithLocation = ({ title, navigation, showService}) => {
  // console.log("title--------------",title);
  // const AppTopBarWithLocation = ({ title, navigation, showService, services, setIsDropdownVisible, isDropdownVisible, selectedServiceId, selectedServiceName}) => {
  const [deliveryModalVisible, setDeliveryModalVisible] = React.useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('1');
  const [selectedServiceName, setSelectedServiceName] = useState('Service');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [services, setServices] = useState([]);
  const [pincodeArr, setPincodeArr] = useState([]);
  const [selectedPincode, setSelectedPincode] = useState('');
  const [isPincodeDropdownVisible, setIsPincodeDropdownVisible] = useState(false);
  
  useEffect(()=> {
    getUserProfile();
    getServices();
  },[]);
  
  const getServices = async() => {
    const res = await getRequest('/api/Toys/GetServices');
    const resData = await res.json();
    setServices(resData?.data);
    if(resData?.data[0]?.servicesName) {
      const serviceName = resData?.data[0]?.servicesName.toLowerCase() 
      .split(' ') 
      .map(function(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }) 
      .join(' ');
      setSelectedServiceName(serviceName);
    }
  }

  const getUserProfile = async() => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      const userDataObj = JSON.parse(userData);
      console.log('userId-----------------', userDataObj);
      const res = await getRequest(`/api/Toys/GetUserProfile/${userDataObj?.userId}`);
      const resData = await res.json();
      console.log("getUserProfile============",resData?.data?.pincode);
      setSelectedPincode(resData?.data?.pincode)
      // setUserReviews(resData?.data);
    } catch (err) {
      console.log('err', err);
    }
  }

  const openDeliveryModal = () => {
    if (pincodeArr.length === 0) {
      setDeliveryModalVisible(true);
    } else {
      setIsPincodeDropdownVisible(true); // Show the pincode dropdown
    }
    // setDeliveryModalVisible(true);
  };

  const closeDeliveryModal = () => {
    setDeliveryModalVisible(false);
  };
  const goBack = () => {
    // const navigation1 = useNavigation();
    const currentScreen = navigation.getState().routes[navigation.getState().index].name;
    console.log("currentScreen==============",currentScreen);
    if(currentScreen == "Services") {
      navigation.navigate("Services");
    }

    if(currentScreen !== "home") {
      navigation.goBack();
    }
  };

  const handleNavigation = (screenName) => {
    navigation.navigate(screenName);
  };

  const handleCall = () => {
    const url = `tel:8983900282`; // Replace 1234567890 with the phone number you want to call
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          console.log('Can\'t handle url: ' + url);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };

  const handleProductSearch = async() => {
    console.log("searchQueryyyyy=============",searchQuery);
    console.log("selectedServiceId=============",selectedServiceId);
    const res = await getRequest(`/api/Toys/SearchProducts/${selectedServiceId}?query=${searchQuery}`);
    const resData = await res.json();
    console.log("handleProductSearch===========",resData?.data);
    if(resData?.success == true) {
      navigation.navigate('Products', {serviceId: 1, categoryId: null, productDataArr:resData?.data});
    }
  };

  const handleServicesRediirection = (serviceData) => {
      const serviceName = serviceData?.servicesName.toLowerCase() 
      .split(' ') 
      .map(function(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }) 
      .join(' ');
      console.log("serviceName===========",serviceName);
      // navigation.navigate('Categories', {serviceId: serviceData?.id});
      setSelectedServiceId(serviceData?.id);
      setSelectedServiceName(serviceName);
      setIsDropdownVisible(false);
  }

  const handlePincodeSelect = async(pincodeData) => {
    console.log("handlePincodeSelect==============",pincodeData);
    // Toys/UpdateUserPincodeByAreaId/${userDataObj?.userId}

    const userData = await AsyncStorage.getItem('userData');
    const userDataObj = JSON.parse(userData);
    console.log('userId-----------------', userDataObj?.userId);

    const res = await getRequest(`/api/Toys/UpdateUserPincodeByAreaId/${userDataObj?.userId}/${pincodeData?.id}`);
    const resData = await res.json();
    console.log('handlePincodeSelect_resData-----------------------------', resData);
    
    setSelectedPincode(pincodeData?.pincode);
    setIsPincodeDropdownVisible(false);
  }

  const handleChooseDiffCity = () => {
    setIsPincodeDropdownVisible(false);
    setDeliveryModalVisible(true);
  }

  const closePincodeModal = () => {
    setIsPincodeDropdownVisible(false);
  }

  const handleOpenPincodePicker = () => {
    setIsPincodeDropdownVisible(true);
  }

  return (
      <TouchableWithoutFeedback onPress={() => setIsDropdownVisible(false)}>     
    <View style={styles.container}>
        <Image source={topBarBgImg}  style={styles.bgImg} />
        <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="dark-content"
          />
        <View style={styles.contentContainer} >
        <View style={styles.iconWithTextContainer}>
            <TouchableOpacity onPress={goBack} style={styles.iconContainer}>
              <Image source={arrowLeftIconBlack} style={styles.icon} />
            </TouchableOpacity>

          <TouchableOpacity onPress={openDeliveryModal} >
            <View style={styles.locationContainer} >
              <Image source={locationRedIcon} style={styles.locationIcon} />
              <Text style={styles.locationText}> {selectedPincode}  </Text>
              <Image source={arrowDownBlackIcon} style={styles.locationIcon} />
            </View>
          </TouchableOpacity>
        </View>


   <View style={{flexDirection:'row', gap:7}} >
   {/* <TouchableOpacity onPress={() => navigation.navigate('Wishlist')} style={styles.iconContainer}>
      <Image source={heartOutlineBlackIcon} style={styles.icon} />
    </TouchableOpacity> */}
    <TouchableOpacity onPress={handleCall} style={styles.iconContainer}>
      <Image source={callIconBlack} style={styles.icon} />
    </TouchableOpacity>
   </View>

   <View style={styles.textInputContainer} >
    {/* {showService ?  */}
    {title !== "Services" && <TouchableOpacity onPress={() => setIsDropdownVisible(!isDropdownVisible)} style={styles.textInputStartContainer} >
      <Text style={styles.textInputStartText}>{selectedServiceName}</Text>
      <Image source={arrowDownBlackIcon} style={styles.arrowDownIcon} />
    </TouchableOpacity>}
     {/* : null} */}

    <View style={[styles.textInputEndContainer, title == "Services" ? { width:'100%'} :  deviceWidth * 0.58 ]} >
      <TextInput
        placeholder="Search"
        placeholderTextColor={'#8B8289'} 
        style={[styles.textInput, !showService || title == "Services" ? {width: '90%'} : {width: '80%'} ]}
        onChangeText={setSearchQuery}
        value={searchQuery}
      />
      <TouchableOpacity onPress={()=>handleProductSearch()}>
        <Image source={searchIcon} style={styles.searchIcon} />
      </TouchableOpacity>
    </View>
   </View>

   </View>
   <DeliveryLocationModal closeModal={closeDeliveryModal} visible={deliveryModalVisible} setSelectedPincode={setSelectedPincode} selectedPincode={selectedPincode} setPincodeArr={setPincodeArr} handleOpenPincodePicker={handleOpenPincodePicker} />

   <PincodeDropdown pincodes={pincodeArr} onSelect={handlePincodeSelect} onChooseDifferentCity={handleChooseDiffCity} isPincodeDropdownVisible={isPincodeDropdownVisible} closePincodeModal={closePincodeModal} />

   {isDropdownVisible && (
      <View style={styles.dropdownContainer}>
        <View style={[styles.triangleShape]} />
        <View >
          {services.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={styles.dropdownItem}
              onPress={() => {
                console.log(service.label); // Handle item selection
                setIsDropdownVisible(false); // Close dropdown after selection
              }}
            >
              <TouchableOpacity onPress={()=>handleServicesRediirection(service)}>
                <Text>{service.servicesName}</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    )}


  </View>
</TouchableWithoutFeedback>
  );
};


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: deviceHeight * 0.22,
    zIndex: 12,
  },
  bgImg: {
    height: deviceHeight * 0.257,
    width: deviceWidth,
    position:'absolute',
    top: 0,
    zIndex: 10,
   },

  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    width:'100%',
    zIndex: 11,
    marginTop: 30,
    flexWrap:'wrap',
    rowGap: 20,
  },
  iconWithTextContainer: {
    flexDirection:'row',
    alignItems: 'center',
    gap: 15,
  },
  iconContainer: {
    width: 42,
    height: 42,
    backgroundColor: '#FFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#171717',
  },
  icon: {
    width: 20,
    height: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: 'DMSans-Bold',
    color: '#0C0C0C',
    textTransform: 'capitalize',
  },
  locationContainer: {
    flexDirection:'row',
    alignItems:'center',
    gap: 3,
  },
  locationText: {
    color:'#222F2F',
    fontFamily:'DMSans-Regular',
    fontSize: 14,
  },
  locationIcon: {
    width: deviceWidth * 0.05,
    height: deviceWidth * 0.05,
  },
  textInputContainer: {
    flexDirection:'row',
    alignItems:'center',
    backgroundColor:'#FFF',
    width:'100%',
    borderRadius: 60,
    paddingHorizontal: 14,
  },
  textInputStartText: {
    color:'#8B8289',
    fontFamily:'DMSans-Regular',
    fontSize: 14,
  },
  arrowDownIcon: {
    width: deviceWidth * 0.04,
    height: deviceWidth * 0.04,
  },
  textInputStartContainer: {
    flexDirection:'row',
    alignItems:'center',
    borderRightWidth:1,
    borderRightColor:'#C6C6C6',
    padding: 6,
    gap: 5,
    width:deviceWidth * 0.29,
    // width:'30%',
    display:'flex',
    justifyContent:'space-between'
  },
  textInputEndContainer: {
    flexDirection:'row',
    alignItems:'center',
    padding: 6,
    gap: 5,
    // width:'70%'
    width:deviceWidth * 0.58,
  },
   searchIcon: {
    width: deviceWidth * 0.05,
    height: deviceWidth * 0.05,
  },
  textInput: {
    color: '#8B8289',
    fontFamily:'DMSans-Regular',
    fontSize: 14,
    width:'70%',
  },
  // Dropdown css
  dropdownContainer: {
    // Styles for the dropdown container
    padding: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#DDD',
    // borderRadius: 5,
    // width:deviceWidth*0.35,
    width:200,
    zIndex:9999,
    position:'absolute',
    top:deviceHeight*0.23,
    left:deviceWidth*0.2,
    borderRadius:20
  },
  dropdownItem: {
    // Styles for dropdown items
    paddingVertical: 10,
    paddingHorizontal: 15,
    color:"black"
  },
  triangleShape: {
    width: 0,
    height: 0,
    position:'absolute',
    top: -15,
    // right: 10,
    left:10,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 14,
    borderRightWidth: 14,
    borderBottomWidth: 24,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FFF',
  },
});

export default AppTopBarWithLocation;
