/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, SafeAreaView, Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import { appLogo } from '../assets/images/logo';
import CustomButton from '../components/CustomButton';
import { arrowDownIcon, callIcon, emailIcon, eyeIcon, profileIcon, locationIcon } from '../assets/icons';
import { appBackColor } from '../styles/colors';
import AppTopBar from '../components/AppTopBar';
import { globalMarginTop } from '../styles/size';
import GlobalMargin from '../components/GlobalMargin';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Picker } from '@react-native-picker/picker';
import { getRequest, postRequest } from '../utils/api_call';
import Spinner from 'react-native-loading-spinner-overlay';

const BecameFranchise = ({navigation, route}) => {

  const [cityArr, setCityArr] = useState([]);
  const [stateArr, setStateArr] = useState([]);
  const [capitalArr, setCapitalArr] = useState([]);
  const [getToKnowArr, setGetToKnowArr] = useState([]);
  const [spinnerLoading, setSpinnerLoading] = useState(false);

  useEffect(()=> {
    getSelectArrays();
  },[]);

  const getSelectArrays = async() => {
    const capitalRes = await getRequest(`/api/Toys/GetCapital`);
    const resCapitalData = await capitalRes.json();
    setCapitalArr(resCapitalData?.data);

    const stateRes = await getRequest(`/api/Toys/GetAllState`);
    const resStateData = await stateRes.json();
    setStateArr(resStateData?.data);

    const cityRes = await getRequest(`/api/Toys/GetAllCity`);
    const resCityData = await cityRes.json();
    setCityArr(resCityData?.data);

    const getToKnowRes = await getRequest(`/api/Toys/GetKnwonAboutUs`);
    const getToKnowData = await getToKnowRes.json();
    setGetToKnowArr(getToKnowData?.data);

    console.log("getToKnowData-----------",getToKnowData.data);
  }

  const validationSchema = Yup.object().shape({
    FullName: Yup.string().required('Name is required'),
    contactEmail: Yup.string().email('Invalid Email').required('Email is required'),
    ContactNumber: Yup.string().matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .required('Phone is required'),
    message: Yup.string().required('Message is required'),
  });

const handleBecomeFranchise = async (values, {resetForm}) => {
  try {
    setSpinnerLoading(true);
    const data = {...values};
    data.cityId = parseInt(data.cityId);
    data.stateId = parseInt(data.stateId);
    data.CompleteAddress = "test";
    
    console.log("data=========",data);
    const res = await postRequest('/api/Toys/FranchiseRequestAsync', JSON.stringify(data), 'POST');
    const resData = await res.json();
    console.log('handleSendMessage data------', resData, res.status);
    
    if (res.status === 200 && resData?.success) {
      resetForm();
      Alert.alert(resData?.data);
    }
  } catch (error) {
    console.log("error=========",error);
  } finally {
    setSpinnerLoading(false);
  }
}

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'appBackColor' }}>
      <Spinner
        visible={spinnerLoading}
        // textContent={'Loading...'}
        textStyle={{ color: '#FFF' }}
        animation="fade"
        overlayColor="rgba(0, 0, 0, 0.6)"
      />
      <AppTopBar navigation={navigation} title={'Became A Franchise'} />
    <ScrollView contentContainerStyle={styles.container}>
      <GlobalMargin />

      <Formik
          initialValues={{
            contactEmail:'',
            FullName: '',
            ContactNumber: '',
            capital:'',
            stateId:'',
            cityId:'',
            area:'',
            message: '',
            howWouldYouHearAboutUs:'',
          }}
          validationSchema={validationSchema}
          onSubmit={handleBecomeFranchise}
        >
          {({values, handleChange, handleSubmit, errors, touched, isSubmitting}) => (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Name</Text>
                <View style={styles.inputWrapper}>
                  <TextInput 
                    onChangeText={handleChange('FullName')}
                    value={values.FullName}  
                    style={styles.input} 
                  />
                  <Image style={styles.inputImg} source={profileIcon}  />
                  {errors.FullName && touched.FullName  && <Text style={styles.error} >{errors.FullName} </Text> }
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    onChangeText={handleChange('contactEmail')}
                    value={values.contactEmail}
                    style={styles.input}
                  />
                  <Image style={styles.inputImg} source={emailIcon}  />
                </View>
                {errors.contactEmail && touched.contactEmail && <Text style={styles.error}>{errors.contactEmail}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Phone</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    onChangeText={handleChange('ContactNumber')}
                    value={values.ContactNumber}
                    style={styles.input}
                  />
                  <Image style={styles.inputImg} source={callIcon} />
                </View>
                {errors.ContactNumber && touched.ContactNumber && <Text style={styles.error}>{errors.ContactNumber}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Available Capital</Text>
                <View style={styles.inputWrapper}>
                  <Picker
                    selectedValue={values.capital}
                    onValueChange={(itemValue) => handleChange('capital')(itemValue)}
                    style={[styles.input, { paddingRight: 0, borderRadius: 16 }]}
                    dropdownIconColor={'white'}
                  >
                    <Picker.Item label="Select Capital" value="" />
                    {capitalArr.map((val,idx)=> {
                      return (
                        <Picker.Item key={idx} label={val?.value} value={val.id} />
                      )
                    })}
                  </Picker>
                  <Image style={styles.inputImg} source={arrowDownIcon} />
                </View>
                {errors.capital && touched.capital && (
                  <Text style={styles.error}>{errors.capital}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>State</Text>
                <View style={styles.inputWrapper}>
                  <Picker
                    selectedValue={values.stateId}
                    onValueChange={(itemValue) => handleChange('stateId')(itemValue)}
                    style={styles.input}
                    dropdownIconColor={'white'}
                  >
                    <Picker.Item label="Select State" value="" />
                    {stateArr.map((val,idx)=> {
                      return (
                        <Picker.Item key={idx} label={val?.stateName} value={JSON.stringify(val.id)} />
                      )
                    })}
                  </Picker>
                  <Image style={styles.inputImg} source={arrowDownIcon} />
                </View>
                {errors.stateId && touched.stateId && <Text style={styles.error}>{errors.stateId}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>City</Text>
                <View style={styles.inputWrapper}>
                  <Picker
                    selectedValue={values.cityId}
                    onValueChange={(itemValue) => handleChange('cityId')(itemValue)}
                    style={styles.input}
                    dropdownIconColor={'white'}
                  >
                    <Picker.Item label="Select City" value="" />
                    {cityArr.map((val,idx)=> {
                      return (
                        <Picker.Item key={idx} label={val?.cityName} value={JSON.stringify(val.id)} />
                      )
                    })}
                  </Picker>
                  <Image style={styles.inputImg} source={arrowDownIcon} />
                </View>
                {errors.cityId && touched.cityId && <Text style={styles.error}>{errors.cityId}</Text>}
              </View>

              {/* <View style={styles.inputContainer}>
                <Text style={styles.label}>Area</Text>
                <View style={styles.inputWrapper}>
                  <Picker
                    selectedValue={values.area}
                    onValueChange={(itemValue) => handleChange('area')(itemValue)}
                    style={styles.input}
                    dropdownIconColor={'white'}
                  >
                    <Picker.Item label="Select Area" value="" />
                    <Picker.Item label="Area 1" value="1" />
                    <Picker.Item label="Area 2" value="2" />
                  </Picker>
                  <Image style={styles.inputImg} source={arrowDownIcon} />
                </View>
                {errors.area && touched.area && <Text style={styles.error}>{errors.area}</Text>}
              </View> */}

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Select Area</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    onChangeText={handleChange('area')}
                    value={values.area}
                    style={styles.input}
                  />
                  <Image style={styles.inputImg} source={locationIcon} />
                </View>
                {errors.area && touched.area && <Text style={styles.error}>{errors.area}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Message</Text>
                <TextInput
                  onChangeText={handleChange('message')}
                  value={values.message}
                  multiline={true}
                  numberOfLines={5}
                  placeholderTextColor={'#828282'}
                  placeholder="Write your message..."
                  style={[styles.input, styles.textArea]}
                />
                {errors.message && touched.message && <Text style={styles.error}>{errors.message}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>How do you know about us</Text>
                <View style={styles.inputWrapper}>
                  <Picker
                    selectedValue={values.howWouldYouHearAboutUs}
                    onValueChange={(itemValue) => handleChange('howWouldYouHearAboutUs')(itemValue)}
                    style={[styles.input, { paddingRight: 0 }]} // Hide right-side icon
                  >
                    <Picker.Item label="Select Option" value="" />
                    {getToKnowArr.map((val,idx)=> {
                      return (
                        <Picker.Item key={idx} label={val?.value} value={val.id} />
                      )
                    })}
                  </Picker>
                </View>
                {errors.howWouldYouHearAboutUs && touched.howWouldYouHearAboutUs && (
                  <Text style={styles.error}>{errors.howWouldYouHearAboutUs}</Text>
                )}
              </View>

              {/* <View style={styles.inputContainer}>
                <Text style={styles.label}>State</Text>
                <View style={styles.inputWrapper}>
                <TextInput  style={styles.input} />
                <Image style={styles.inputImg} source={arrowDownIcon}  />
              </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>City</Text>
                <View style={styles.inputWrapper}>
                <TextInput  style={styles.input} />
                <Image style={styles.inputImg} source={arrowDownIcon}  />
              </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Area</Text>
                <View style={styles.inputWrapper}>
                <TextInput  style={styles.input} />
                <Image style={styles.inputImg} source={arrowDownIcon}  />
              </View>
              </View> */}

              {/* <View style={styles.inputContainer}>
                <Text style={styles.label}>Message</Text>
                <TextInput
                multiline={true}
                numberOfLines={5}
                placeholderTextColor={'#828282'}
                placeholder="write your message..."
                style={[styles.input, styles.textArea]} />
              </View> */}

              {/* <View style={styles.inputContainer}>
                <Text style={styles.label}>How do you know about us</Text>
                <View style={styles.inputWrapper}>
                <TextInput   style={styles.input} />
                <Image style={styles.inputImg} source={arrowDownIcon}  />
              </View>
              </View> */}

              <View style={{ display: 'flex', alignItems: 'center', marginVertical: 30 }}>
                <CustomButton onPress={isSubmitting ? null : handleSubmit} buttonStyle={{ width: 177 }} title={'Send Now'} />
              </View>
            </>
          )}
        </Formik>


    </ScrollView>
  </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: appBackColor,
  },
  loginTitle: {
    color: '#0C0C0C',
    fontFamily: 'DMSans-Bold',
    fontSize: 24,
    fontStyle: 'normal',
  },
  inputContainer: {
    marginTop: 20,
  },
  label: {
    fontFamily: 'DMSans-Regular',
    color: '#6F6F6F',
    fontSize: 14,
    marginBottom: 10,
    marginLeft: 4,
  },
  inputImg: {
    position:'absolute',
    right: 20,
    top: '30%',
    width: 20,
    height: 20,
  },
  input: {
    paddingLeft: 15,
    height: 54,
    borderRadius: 16,
    paddingRight: 50,
    fontFamily: 'DMSans-SemiBold',
    backgroundColor: '#FFFFFF',
    color: '#000000',
    elevation: 1,
    shadowColor: '#171717',
  },
  textArea: {
    height: 150,
    textAlignVertical: 'top',
  },
  loginWithContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    gap: 10,
  },
  line: {
    height: 1,
    width: 52,
    opacity: 0.25,
    backgroundColor: '#C5C5C5',
  },
  loginWithText: {
    textAlign: 'center',
    color: '#858E92',
    fontFamily: 'DMSans-Regular',
    fontSize: 16,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  icon: {
    borderRadius: 25,
    padding: 10,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 52,
    height: 52,
    backgroundColor: '#F9FDFF',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 30,
    elevation: 5,
  },
});

export default BecameFranchise;
