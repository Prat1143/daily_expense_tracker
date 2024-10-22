/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { Alert, Image, TextInput } from 'react-native';
import { View, Text, Modal, TouchableOpacity, StyleSheet, FlatList, ScrollView, KeyboardAvoidingView } from 'react-native';
import { arrowRightIcon, closeCirceRedIcon } from '../assets/icons';
import { mumbaiLocationImg, bengaluru, chennai, delhi, faridabad, ghaziabad, gurugram, hyderabad, noida, pune, blank_location, blank_location_2  } from '../assets/images/delivery-location';
import { deviceWidth } from '../styles/size';
import LinearGradient from 'react-native-linear-gradient';
import { StatusBar } from 'react-native';
import { getRequest } from '../utils/api_call';

const DeliveryLocationModal = ({ visible, closeModal, setSelectedPincode, selectedPincode, setPincodeArr, handleOpenPincodePicker }) => {
  const [cityArr, setCityArr] = useState([]);
  const [pincode, setPincode] = useState(null);

  useEffect(()=>{
    console.log("DeliveryLocationModal===========");
    // getAllCities();
    getPopularCities();
  },[]);

  const getAllCities = async() => {
    const res = await getRequest(`/api/Toys/GetAllCity`);
    const resData = await res.json();
    console.log("res===========",resData?.data[0]);
    // setCityArr(resData?.data);
  }

  const getPopularCities = async() => {
    const res = await getRequest(`/api/Toys/GetPopularCities`);
    const resData = await res.json();
    if(resData?.success == true) {
      // console.log("getPopularCities_res===========",resData);
      setCityArr(resData?.data);
    }
  }

  const handleCitySelection = async(selectedCity) => {
    console.log("selectedCity==========",selectedCity?.id);
    const res = await getRequest(`/api/Toys/GetAreasByCityId/${selectedCity?.id}`);
    // const res = await getRequest(`/api/Toys/GetPincodeListByCity/${selectedCity?.id}`);
    
    const resData = await res.json();
    console.log("GetPincodeListByCity_resData==========",resData?.data);
    if(resData?.success == true) {
      const filteredPincodes = resData?.data.filter(pincode => pincode !== null);
      const dataWithPincode = resData?.data.filter(item => item.pincode != null && item.pincode !== "");
    // console.log("dataWithPincode==========",dataWithPincode);

      if(filteredPincodes?.length >0) {
        setPincodeArr(dataWithPincode);
        handleOpenPincodePicker();
      } else {
        Alert.alert("Cooming soon in your area...");
      }
    }
    closeModal();
  }

  const handleCheckPincode = async() => {
    console.log("pincode--------",pincode);
    try {
      const res = await getRequest(`/api/Toys/GetPinCodeExistStatus/${pincode}`);
      const resData = await res.json();
      console.log("GetPinCodeExistStatus================",resData);
      if(resData?.data == true) {
        setSelectedPincode(pincode);
        closeModal();
      } else {
        Alert.alert("Pin code is not servicable.");
      }
    } catch (err) {
      console.log('err', err);
    }
  };

  const handlePincodeChange = (text) => {
    setPincode(text);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={closeModal}
      style={{ position:'fixed', bottom:0}}
    >
      {/* <ScrollView> */}
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalContainer}
          // onPressOut={closeModal}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            // style={{ flex: 1 }}
          >
            <StatusBar backgroundColor="rgba(0, 0, 0, 0.3)" />
            <View style={styles.modalContent}>
              <View style={styles.modalTopContainer}>
                <Text style={styles.modalTitle}>Select Delivery Location</Text>
                <TouchableOpacity onPress={closeModal} >
                  <Image source={closeCirceRedIcon} style={styles.topIcon}  />
                </TouchableOpacity>
              </View>

              <View style={styles.textInputContainer}>
                <TextInput keyboardType='numeric' placeholder="Enter your pincode" placeholderTextColor={'#8B8289'} onChangeText={handlePincodeChange} value={pincode} style={styles.textInput} />
                <TouchableOpacity onPress={handleCheckPincode}>
                    <LinearGradient
                      colors={['#6BD3FB', '#50BFE9']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.textInputIconContainer} >
                        <Image source={arrowRightIcon} style={styles.textInputIcon}  />
                    </LinearGradient>
                </TouchableOpacity>
              </View>
              <View style={styles.locationTextContainer}>
                <Text style={styles.locationText}>Currently selected pincode: <Text style={styles.locationTextRed} >{selectedPincode}</Text> </Text>
              </View>

              <View>
                <Text style={styles.bottomTitle} >Select Your City</Text>
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                  <View style={styles.cityList}>
                    {cityArr.map((city, index) => (
                      <TouchableOpacity key={index} style={styles.cityItem} onPress={()=>handleCitySelection(city)}>
                        <Image source={blank_location_2} style={styles.locationImg} />
                        <Text style={styles.cityName}>{city.cityName}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
              
              {/* Working Code */}
              {/* <View style={styles.bottomTitleContainer}>
                <Text style={styles.bottomTitle} >Select Your City</Text>
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                  <View style={styles.cityList}>
                    <TouchableOpacity style={styles.cityItem} onPress={()=>handleCitySelection("city")}>
                      <Image  source={bengaluru} style={styles.locationImg} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.cityItem} onPress={()=>handleCitySelection("city")}>
                      <Image  source={mumbaiLocationImg} style={styles.locationImg} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.cityItem} onPress={()=>handleCitySelection("city")}>
                      <Image  source={pune} style={styles.locationImg} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.cityItem} onPress={()=>handleCitySelection("city")}>
                      <Image  source={delhi} style={styles.locationImg} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.cityItem} onPress={()=>handleCitySelection("city")}>
                      <Image  source={gurugram} style={styles.locationImg} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.cityItem} onPress={()=>handleCitySelection("city")}>
                      <Image  source={noida} style={styles.locationImg} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.cityItem} onPress={()=>handleCitySelection("city")}>
                      <Image  source={hyderabad} style={styles.locationImg} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.cityItem} onPress={()=>handleCitySelection("city")}>
                      <Image  source={chennai} style={styles.locationImg} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cityItem} onPress={()=>handleCitySelection("city")}>
                      <Image  source={ghaziabad} style={styles.locationImg} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.cityItem} onPress={()=>handleCitySelection("city")}>
                      <Image  source={faridabad} style={styles.locationImg} />
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View> */}

              {/* <View style={styles.bottomTitleContainer}> */}
                {/* <Text style={styles.bottomTitle} >Select Your City</Text> */}
                {/* <FlatList
                  data={cityArr}
                  keyExtractor={(city) => city.id.toString()}
                  renderItem={renderCityItem}
                  vertical
                  showsVerticalScrollIndicator={false}
                /> */}
                {/* <View style={styles.bottomCityImagesContainer} >
                  {
                    cityArr.map(()=>{
                      return (
                        <Image source={mumbaiLocationImg} style={styles.locationImg} />
                      );
                    })
                  }
                </View> */}
              {/* </View> */}
            </View>
          </KeyboardAvoidingView>
        </TouchableOpacity>
      {/* </ScrollView> */}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderTopStartRadius:26,
    borderTopEndRadius: 26,
  },
  modalTopContainer: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
  },
  modalTitle: {
    color:'#0C0C0C',
    fontFamily:'DMSans-Bold',
    fontSize:18,
    lineHeight:28,
  },
  topIcon: {
    width: deviceWidth * 0.067,
    height: deviceWidth * 0.067,
  },
  textInputContainer: {
    borderRadius: 60,
    backgroundColor:'#FFF',
    elevation:2,
    shadowColor: '#0C0C0C',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    paddingLeft:20,
    paddingHorizontal:5,
    paddingVertical:3,
    marginVertical:10,
  },
  textInput: {
    color: '#8B8289',
    width: '80%',
  },
  textInputIconContainer: {
    backgroundColor:'#6BD3FB',
    width: deviceWidth * 0.123,
    height: deviceWidth * 0.123,
    borderRadius: 100,
    alignItems:'center',
    justifyContent:'center',
  },
  textInputIcon: {
    width: 20,
    height: 20,
  },
  locationTextContainer: {
    marginVertical:10,
  },
  locationText: {
    color: '#A3A3A3',
    fontSize:14,
    textAlign:'center',
  },
  locationTextRed: {
    color: '#EB5F0A',
    fontFamily:'DMSans-Medium',
  },
  
  bottomTitle: {
    color: '#0C0C0C',
    fontFamily:'DMSans-Bold',
    fontSize:18,
    marginVertical:20,
  },
  bottomCityImagesContainer: {
    flexDirection:'row',
    gap: 20,
    flexWrap:'wrap',
    height: deviceWidth * 0.5,
  },
  locationImg: {
    width: deviceWidth * 0.17,
    height: deviceWidth * 0.17,
  },

  scrollView: {
    height: deviceWidth * 0.70, // Fixed height for the View
  },
  cityList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // justifyContent: 'space-between',
  },
  cityListLastTwo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // justifyContent: 'space-between',
  },
  cityItem: {
    width: '25%', // Adjust as needed to have 2 items in a row
    marginBottom: 10,
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
  },
  cityName: {
    textAlign: 'center',
    position:'absolute',
    top:6,
    fontSize:deviceWidth * 0.026,
    // fontWeight:'bold',
    color:'#000000'
  },

});

export default DeliveryLocationModal;
