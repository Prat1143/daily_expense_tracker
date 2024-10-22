/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-elements';
import { appLogo } from '../assets/images/logo';
import CustomButton from '../components/CustomButton';
import { arrowDownIcon, callIcon, emailIcon, eyeIcon, profileIcon } from '../assets/icons';
import { appBackColor } from '../styles/colors';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Picker } from '@react-native-picker/picker';
import { postRequest } from '../utils/api_call';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScreenHeight } from 'react-native-elements/dist/helpers';
import CustomAlert from '../components/CustomAlert';

const SignupScreen = ({navigation, route}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [errorType, setErrorType] = useState('');
  const [loading, setLoading] = useState(false);
  
  const goToLogin = () => {
    navigation.navigate('Login');
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    surname: Yup.string().required('Surname is required'),
    phone: Yup.string().matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .required('Phone is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    // password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    password: Yup.string()
    .required("Password is required")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "Password must be at least 8 characters long and include at least one number and one special character"
    ),
    // Add more validation rules as needed
  });

  const howYouKnowOptions = [
    '',
    'Search engine',
    'Social media',
    'Friend/Family',
    'Advertisement',
    'Other',
  ];


  const handleSignup = async (values, {resetForm}) => {
   try {
    setLoading(true);
    console.log('values', values);
    const data = {
      firstName: values.name,
      lastName: values.surname,
      email: values.email,
      password: values.password,
      contactNo: values.phone,
      howWouldYouHearAboutUs: values.howYouKnow,
      areaId: 5,
    };
    console.log('data--------------------------------', data);
    const res = await postRequest('/api/Toys/Register', JSON.stringify(data), 'POST');
    const resData = await res.json();
    if(resData?.success == true && resData?.data?.isError !== true) {
      console.log('signup_resData========', resData?.data);
      await AsyncStorage.setItem('userData', JSON.stringify(resData?.data));
      setLoading(false);
      setAlertVisible(true);
      setErrorMsg("Please check your email to verify your account. We've sent you a verification link to complete your registration.");
      setErrorType('success');

      // navigation.navigate('home');
    } else {
      console.log('signup_false========', resData?.data);
      setAlertVisible(true);
      setErrorMsg(resData?.data?.error);
      setErrorType('error');
      setLoading(false);
    // Alert.alert(resData?.data?.error);
    }
    // resetForm();
   } catch (err) {
    setLoading(false);
    console.log('err------', err);
   }
  };

  const handleViewPassword = () => {
    setShowPassword(!showPassword);
  }


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: appBackColor }}>
      {loading &&<View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      </View>}

      <CustomAlert
        visible={alertVisible}
        onClose={() => {setAlertVisible(false); navigation.navigate('home');}}
        message={errorMsg}
        type={errorType}
      />
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={appLogo} style={styles.logo} />
      </View>

      <Text style={styles.loginTitle}>Sign Up</Text>

      <Formik
          initialValues={{
            name: '',
            surname: '',
            phone: '',
            email: '',
            password: '',
            howYouKnow: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSignup}
        >
          {({ values, handleChange, handleSubmit, errors, touched }) => (
            <>
             <View style={styles.inputContainer}>
                <Text style={styles.label}>Name</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    value={values.name}
                    onChangeText={handleChange('name')}
                    placeholder="Name"
                    style={styles.input}
                  />
                  <Image style={styles.inputImg} source={profileIcon}  />
                </View>
                {errors.name && touched.name && <Text style={styles.error}>{errors.name}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Surname</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    value={values.surname}
                    onChangeText={handleChange('surname')}
                    placeholder="Surname"
                    style={styles.input}
                  />
                  <Image style={styles.inputImg} source={profileIcon}  />
                </View>
                {errors.surname && touched.surname && <Text style={styles.error}>{errors.surname}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Phone</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    value={values.phone}
                    onChangeText={handleChange('phone')}
                    placeholder="Phone"
                    keyboardType="number-pad"
                    style={styles.input}
                  />
                  <Image style={styles.inputImg} source={callIcon}  />
                </View>
                {errors.phone && touched.phone && <Text style={styles.error}>{errors.phone}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    value={values.email}
                    onChangeText={handleChange('email')}
                    placeholder="Email"
                    style={styles.input}
                  />
                  <Image style={styles.inputImg} source={emailIcon}  />
                </View>
                {errors.email && touched.email && <Text style={styles.error}>{errors.email}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    value={values.password}
                    onChangeText={handleChange('password')}
                    placeholder="Password"
                    secureTextEntry={showPassword ? false : true}
                    style={styles.input}
                  />
                  <TouchableOpacity onPress={handleViewPassword} style={styles.passwordImgContainer}>
                    <Image style={styles.inputImg} source={eyeIcon}  />
                  </TouchableOpacity>
                </View>
                {errors.password && touched.password && <Text style={styles.error}>{errors.password}</Text>}
              </View>


              <View style={styles.inputContainer}>
                <Text style={styles.label}>How do you know about us</Text>
                <View >
                  <Picker
                    selectedValue={values.howYouKnow}
                    onValueChange={(itemValue) => handleChange('howYouKnow')(itemValue)}
                    style={styles.input}
                  >
                    {howYouKnowOptions.map((option, index) => (
                      <Picker.Item key={index} label={option} value={option} />
                    ))}
                  </Picker>
                  <Image style={styles.inputImg} source={arrowDownIcon}  />
                </View>
                {errors.howYouKnow && touched.howYouKnow && <Text style={styles.error}>{errors.howYouKnow}</Text>}
              </View>
              <View style={{ display: 'flex', alignItems: 'center', marginVertical: 30 }}>
              <CustomButton buttonStyle={{ width: 177 }} title={'Sign Up'} onPress={handleSubmit} />
            </View>
            </>
          )}
        </Formik>




      {/* <View style={styles.inputContainer}>
        <Text style={styles.label}>How do you know about us</Text>
        <View style={styles.inputWrapper}>
        <TextInput  style={styles.input} />
        <Image style={styles.inputImg} source={arrowDownIcon}  />
       </View>
      </View> */}


      {/* <View style={styles.loginWithContainer}>
        <View style={styles.line} />
        <Text style={styles.loginWithText}>Or Sign up with</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.socialIcons}>
        <TouchableOpacity style={styles.icon}>
          <Icon type="font-awesome" name="facebook" color="#4267B2" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.icon}>
          <Icon type="font-awesome" name="google" color="#DB4437" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.icon}>
          <Icon type="font-awesome" name="apple" color="#000" />
        </TouchableOpacity>
      </View> */}

      <TouchableOpacity onPress={goToLogin} style={styles.signUpTextContainer}>
        <Text style={styles.signUpTextOne}>Already have an account? <Text style={styles.signUpText}>Log In</Text></Text>
      </TouchableOpacity>
    </ScrollView>
  </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loader: {
    position:'fixed',
    zIndex:9999,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height:'100%'
  },
  loaderContainer: {
      position:'absolute',
      zIndex:9999,
      display:'flex',
      height:'100%',
      width:'100%'
  },
  container: {
    paddingHorizontal: 20,
    backgroundColor: appBackColor,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 0,
    // marginVertical: 50,
  },
  // logo: {
  //   width: 196,
  //   objectFit: 'contain',
  //   height: 64,
  // },
  logo: {
    // width: 196,
    objectFit:'contain',
    height: ScreenHeight*0.3,
    marginTop:-30
  },
  loginTitle: {
    color: '#0C0C0C',
    fontFamily: 'DMSans-Bold',
    fontSize: 24,
    fontStyle: 'normal',
    marginTop:-20
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
    overflow: 'hidden',
    fontFamily: 'DMSans-SemiBold',
    backgroundColor: '#FFFFFF',
    color: '#000000',
    elevation: 1,
    shadowColor: '#171717',
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
    elevation: 2,
    shadowColor: '#171717',
  },
  signUpTextContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  signUpTextOne: {
    color: '#545454',
    fontFamily: 'DMSans-Regular',
  },
  signUpText: {
    textDecorationLine: 'underline',
    color: 'rgba(235, 95, 10, 1)',
    fontFamily: 'DMSans-Bold',
    fontSize: 14,
    marginVertical: 15,
  },
  pickerWrapper: {
    borderRadius: 18,
  },
  passwordImgContainer: {
    position:'absolute',
    right: 0,
    // top: '20%',
    width: 20,
    height: '100%',
  },
});

export default SignupScreen;
