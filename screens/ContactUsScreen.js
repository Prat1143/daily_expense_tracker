/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, SafeAreaView, Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import { appLogo } from '../assets/images/logo';
import CustomButton from '../components/CustomButton';
import { arrowDownIcon, callIcon, circleArrowDownIcon, circleArrowUpIcon, emailIcon, eyeIcon, locationIcon, profileIcon } from '../assets/icons';
import { appBackColor } from '../styles/colors';
import AppTopBar from '../components/AppTopBar';
import GlobalMargin from '../components/GlobalMargin';
import { postRequest, getRequest } from '../utils/api_call';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Spinner from 'react-native-loading-spinner-overlay';
import { Picker } from '@react-native-picker/picker';

const ContactUsScreen = ({navigation, route}) => {

  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [isAccordionOpen1, setIsAccordionOpen1] = useState(false);
  const [isAccordionOpen2, setIsAccordionOpen2] = useState(false);
  const [isAccordionOpen3, setIsAccordionOpen3] = useState(false);
  const [franchiseData, setFranchiseData] = useState([]);
  const [openAccordions, setOpenAccordions] = useState({});
  const [citiesArr, setCitiesArr] = useState([]);

  useEffect(()=> {
    getFranchiseDetails();
    getAllCities();
  }, []);

  const getAllCities = async() => {
    const res = await getRequest('/api/Toys/GetAllCity');
    const resData = await res.json();
    if(resData?.success == true) {
      console.log("GetAllCity==============",resData?.data[0]);
      setCitiesArr(resData?.data);
    }
  }

  const handleAccordionToggle = (idx) => {
    setOpenAccordions((prevOpenAccordions) => ({
      ...prevOpenAccordions,
      [idx]: !prevOpenAccordions[idx],
    }));
  };

  const getFranchiseDetails = async() => {
    const res = await getRequest('/api/Toys/GetAllFranchises');
    const resData = await res.json();
    if(resData?.success == true) {
      // console.log("resData==============",resData?.data);
      setFranchiseData(resData?.data);
    }
  }

  // const handleAccordionToggle = (accordion) => {
  //   switch (accordion) {
  //     case 1:
  //       setIsAccordionOpen1(!isAccordionOpen1);
  //       break;
  //     case 2:
  //       setIsAccordionOpen2(!isAccordionOpen2);
  //       break;
  //     case 3:
  //       setIsAccordionOpen3(!isAccordionOpen3);
  //       break;
  //     default:
  //       break;
  //   }
  // };

  const renderAccordionContent = (val) => {
    return (
      <View style={styles.contentContainer}>
        <View style={[styles.triangleShape]} />
        <View style={styles.contentBody}  >
          <Text style={styles.accordionStartText}>Center Head</Text>
          <Text style={styles.accordionEndText}>{val?.contactPerson}</Text>
        </View>
        <View style={styles.contentBody}  >
          <Text style={styles.accordionStartText}>Contact No.</Text>
          <Text style={styles.accordionEndText}>{val?.contactNumber}</Text>
        </View>
        {/* <View style={styles.contentBody}  >
          <Text style={styles.accordionStartText}>Pickup & Drop Timing</Text>
          <Text style={styles.accordionEndText}>08:00 AM - 03:30 PM</Text>
        </View> */}
        <View style={styles.contentBody}  >
          <Text style={styles.accordionStartText}>Address</Text>
          <Text style={[styles.accordionEndText, {maxWidth:170}]}>{val?.completeAddress}</Text>
        </View>
        <View style={[styles.contentBody, styles.removeBottomBorder]}  >
          <Text style={styles.accordionStartText}>Serviceable Area</Text>
          <Text style={[styles.accordionEndText, {maxWidth:170, maxHeight:125}]}>{val?.areaNames}</Text>
        </View>
      </View>
    );
    // let content = null;
    // switch (accordionNumber) {
    //   case 1:
    //     content = (
    //       <View style={styles.contentContainer}>
    //         <View style={[styles.triangleShape]} />
    //         <View style={styles.contentBody}  >
    //         <Text style={styles.accordionStartText}>Center Head</Text>
    //         <Text style={styles.accordionEndText}>Mr. Rajesh</Text>
    //         </View>
    //         <View style={styles.contentBody}  >
    //         <Text style={styles.accordionStartText}>Contact No.</Text>
    //         <Text style={styles.accordionEndText}>+01 123 456 7890</Text>
    //         </View>
    //         <View style={styles.contentBody}  >
    //         <Text style={styles.accordionStartText}>Pickup & Drop Timing</Text>
    //         <Text style={styles.accordionEndText}>08:00 AM - 03:30 PM</Text>
    //         </View>
    //         <View style={styles.contentBody}  >
    //         <Text style={styles.accordionStartText}>Address</Text>
    //         <Text style={styles.accordionEndText}>123 New Street, New York</Text>
    //         </View>
    //         <View style={[styles.contentBody, styles.removeBottomBorder]}  >
    //         <Text style={styles.accordionStartText}>Serviceable Area</Text>
    //         <Text style={styles.accordionEndText}>Thane, Airoli, Vashi</Text>
    //         </View>
    //       </View>
    //     );
    //     break;
    //   case 2:
    //     content = (
    //       <View style={styles.contentContainer}>
    //         <View style={[styles.triangleShape]} />
    //         <View style={styles.contentBody}  >
    //         <Text style={styles.accordionStartText}>Center Head</Text>
    //         <Text style={styles.accordionEndText}>Mr. Rajesh</Text>
    //         </View>
    //         <View style={styles.contentBody}  >
    //         <Text style={styles.accordionStartText}>Contact No.</Text>
    //         <Text style={styles.accordionEndText}>+01 123 456 7890</Text>
    //         </View>
    //         <View style={styles.contentBody}  >
    //         <Text style={styles.accordionStartText}>Pickup & Drop Timing</Text>
    //         <Text style={styles.accordionEndText}>08:00 AM - 03:30 PM</Text>
    //         </View>
    //         <View style={styles.contentBody}  >
    //         <Text style={styles.accordionStartText}>Address</Text>
    //         <Text style={styles.accordionEndText}>123 New Street, New York</Text>
    //         </View>
    //         <View style={[styles.contentBody, styles.removeBottomBorder]}  >
    //         <Text style={styles.accordionStartText}>Serviceable Area</Text>
    //         <Text style={styles.accordionEndText}>Thane, Airoli, Vashi</Text>
    //         </View>
    //       </View>
    //     );
    //     break;
    //   case 3:
    //     content = (
    //       <View style={styles.contentContainer}>
    //         <View style={[styles.triangleShape]} />
    //         <View style={styles.contentBody}  >
    //         <Text style={styles.accordionStartText}>Center Head</Text>
    //         <Text style={styles.accordionEndText}>Mr. Rajesh</Text>
    //         </View>
    //         <View style={styles.contentBody}  >
    //         <Text style={styles.accordionStartText}>Contact No.</Text>
    //         <Text style={styles.accordionEndText}>+01 123 456 7890</Text>
    //         </View>
    //         <View style={styles.contentBody}  >
    //         <Text style={styles.accordionStartText}>Pickup & Drop Timing</Text>
    //         <Text style={styles.accordionEndText}>08:00 AM - 03:30 PM</Text>
    //         </View>
    //         <View style={styles.contentBody}  >
    //         <Text style={styles.accordionStartText}>Address</Text>
    //         <Text style={styles.accordionEndText}>123 New Street, New York</Text>
    //         </View>
    //         <View style={[styles.contentBody, styles.removeBottomBorder]}  >
    //         <Text style={styles.accordionStartText}>Serviceable Area</Text>
    //         <Text style={styles.accordionEndText}>Thane, Airoli, Vashi</Text>
    //         </View>
    //       </View>
    //     );
    //     break;
    //   default:
    //     break;
    // }
    // return content;
  };

const handleSendMessage = async (values, {resetForm}) => {
  try {
    console.log("values================",values);
      setSpinnerLoading(true);
      const data = {...values};
      const res = await postRequest('/api/Toys/ContactAsync', JSON.stringify(data), 'POST');
      const resData = await res.json();
      console.log('handleSendMessage data------', resData, res.status);
      if (res.status === 200 && resData?.success) {
        resetForm();
        Alert.alert(resData?.data);
      }
  } catch (err) {
      console.log('err', err);
  } finally {
    setSpinnerLoading(false);
  }
};

const [spinnerLoading, setSpinnerLoading] = useState(false);

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid Email').required('Email is required'),
  phone: Yup.string().matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
  .required('Phone is required'),
  message: Yup.string().required('Message is required'),
});

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: appBackColor }}>
      <Spinner
        visible={spinnerLoading}
        // textContent={'Loading...'}
        textStyle={{ color: '#FFF' }}
        animation="fade"
        overlayColor="rgba(0, 0, 0, 0.6)"
      />
      <AppTopBar navigation={navigation} title={'Contact us'} />
    <ScrollView contentContainerStyle={styles.container}>
    <GlobalMargin />
        <Formik
        initialValues={{
          email:'',
          name: '',
          phone: '',
          message: '',
          cityId:'',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSendMessage}
        >
    {({values, handleChange, handleSubmit, errors, touched, isSubmitting, setFieldValue}) => (
      <>
        <View style={styles.inputContainer}>
              <Text style={styles.label}>Name</Text>
              <View style={styles.inputWrapper}>
            <TextInput
            onChangeText={handleChange('name')}
             value={values.name}
             style={styles.input} />
              <Image style={styles.inputImg} source={profileIcon}  />
              {errors.name && touched.name  && <Text style={styles.error} >{errors.name} </Text> }
            </View>
            </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
            <TextInput
            onChangeText={handleChange('email')}
             value={values.email} style={styles.input} />
            <Image style={styles.inputImg} source={emailIcon}  />
            {errors.email && touched.email  && <Text style={styles.error} >{errors.email} </Text> }
          </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone</Text>
            <View style={styles.inputWrapper}>
            <TextInput
            onChangeText={handleChange('phone')}
             value={values.phone} style={styles.input} />
            <Image style={styles.inputImg} source={callIcon}  />
            {errors.phone && touched.phone  && <Text style={styles.error} >{errors.phone} </Text> }
          </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>City</Text>
            <View style={styles.inputWrapper}>
              <Picker
                selectedValue={values.cityId}
                onValueChange={(itemValue) => setFieldValue('cityId', itemValue)}
                style={[styles.input, { paddingRight: 0, borderRadius: 16 }]}
                dropdownIconColor={'white'}
              >
                <Picker.Item label="Select City" value="" />
                {citiesArr.map((val, idx) => (
                  <Picker.Item key={idx} label={val?.cityName} value={val.id} />
                ))}
              </Picker>
              <Image style={styles.inputImg} source={arrowDownIcon} />
            </View>
            {errors.cityId && touched.cityId && (
              <Text style={styles.error}>{errors.cityId}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Message</Text>
            <TextInput
            onChangeText={handleChange('message')}
            value={values.message}
            multiline={true}
            numberOfLines={5}
            placeholderTextColor={'#828282'}
            placeholder="write your message..."
            style={[styles.input, styles.textArea]} />
              {errors.message && touched.message  && <Text style={styles.error} >{errors.message} </Text> }
          </View>

          <View style={{ display: 'flex', alignItems: 'center', marginVertical: 30 }}>
            <CustomButton buttonStyle={{ width: 177 }} onPress={isSubmitting ? null : handleSubmit} title={'Send Message'} />
          </View>
      </>
    )}
    </Formik>

    <View style={{ paddingBottom:10 }}>
      <Text style={{ fontWeight:'bold', color:'#000', fontSize:18 }}>Our Centers</Text>
      {franchiseData?.map((val, idx) => {
        const isAccordionOpen = openAccordions[idx];
        return (
          <View key={idx} style={styles.accordionContainer}>
            <TouchableOpacity
              onPress={() => handleAccordionToggle(idx)}
              style={[styles.accordionHeader, { backgroundColor: isAccordionOpen ? '#F2F2F2' : '#FFF' }]}
            >
              <View style={styles.locationContainer}>
                <View style={styles.locationBox}>
                  <Image source={locationIcon} style={styles.iconLocation} />
                </View>
                <Text style={styles.title}>{val?.storeName}</Text>
              </View>
              <Image
                source={isAccordionOpen ? circleArrowUpIcon : circleArrowDownIcon}
                style={styles.expandIcon}
              />
            </TouchableOpacity>
            {isAccordionOpen && renderAccordionContent(val)}
          </View>
        );
      })}
    </View>



      {/* <View style={styles.accordionContainer}>
          <TouchableOpacity
            onPress={() => handleAccordionToggle(1)}
            style={[styles.accordionHeader, { backgroundColor: isAccordionOpen1 ? '#F2F2F2' : '#FFF' }]}
          >
            <View style={styles.locationContainer}  >
            <View style={styles.locationBox} >
              <Image source={locationIcon} style={styles.iconLocation} />
            </View>
              <Text style={styles.title}>Pune MG Road</Text>
            </View>
              <Image
                source={isAccordionOpen1 ? circleArrowUpIcon : circleArrowDownIcon}
                style={[styles.expandIcon]}
              />
          </TouchableOpacity>
          {isAccordionOpen1 && renderAccordionContent(1)}
        </View>

        <View style={styles.accordionContainer}>
          <TouchableOpacity
            onPress={() => handleAccordionToggle(2)}
            style={[styles.accordionHeader, { backgroundColor: isAccordionOpen2 ? '#F2F2F2' : '#FFF' }]}
          >
             <View style={styles.locationContainer}  >
            <View style={styles.locationBox} >
              <Image source={locationIcon} style={styles.iconLocation} />
            </View>
              <Text style={styles.title}>Mumbai-Thane</Text>
            </View>
              <Image
                source={isAccordionOpen2   ? circleArrowUpIcon : circleArrowDownIcon}
                style={[styles.expandIcon]}
              />
          </TouchableOpacity>
          {isAccordionOpen2 && renderAccordionContent(2)}
        </View>

        <View style={[styles.accordionContainer, {marginBottom:20}]}>
          <TouchableOpacity
            onPress={() => handleAccordionToggle(3)}
            style={[styles.accordionHeader, { backgroundColor: isAccordionOpen3 ? '#F2F2F2' : '#FFFFFF' }]}
          >
           <View style={styles.locationContainer}  >
            <View style={styles.locationBox} >
              <Image source={locationIcon} style={styles.iconLocation} />
            </View>
              <Text style={styles.title}>Mumbai-Thane</Text>
            </View>
              <Image
                source={isAccordionOpen3   ? circleArrowUpIcon : circleArrowDownIcon}
                style={[styles.expandIcon]}
              />
          </TouchableOpacity>
          {isAccordionOpen3 && renderAccordionContent(3)}
        </View> */}

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
  error: {
    color:'red',
    opacity: 0.6,
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
  title: {
    marginVertical: 10,
    color: '#1F1F1F',
    fontFamily:'DMSans-Bold',
    fontSize: 14,
  },
  ourCenterSection: {
    // Your styles for the accordion section
    marginVertical: 20,
  },
  accordionContainer: {
    marginVertical: 5,
  },
  accordionHeader: {
    // Styles for the header of the accordion
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
  expandIcon: {
    width: 24,
    height: 24,
  },
  contentContainer: {
    // Styles for the content of the accordion
    paddingVertical: 10,
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius:16,
    elevation: 2,
    shadowColor: '#0C0C0C',
    marginTop: 6,
  },
  contentBody: {
    flexDirection:'row',
    justifyContent:'space-between',
    borderBottomColor: '#E2EBF0',
    borderBottomWidth: 1,
    paddingVertical: 14,
  },
  removeBottomBorder: {
    borderBottomWidth: 0,
  },
  accordionStartText: {
    color: '#545454',
    fontFamily:'DMSans-Regular',
  },
  accordionEndText: {
    color: '#1F1F1F',
    fontFamily: 'DMSans-SemiBold',
  },
  accordionText: {
    color:'#1F1F1F',
  },
  locationContainer: {
    flexDirection:'row',
    alignItems:'center',
    gap: 15,
  },
  locationBox: {
    backgroundColor: '#F3F9FC',
    width: 48,
    height: 48,
    borderRadius: 15,
    alignItems:'center',
    justifyContent:'center',
  },
  iconLocation: {
    width: 22,
    height: 22,
  },
  triangleShape: {
    width: 0,
    height: 0,
    position:'absolute',
    top: -15,
    right: 10,
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

export default ContactUsScreen;
