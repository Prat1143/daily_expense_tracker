/* eslint-disable prettier/prettier */
// LoginScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Button, Alert, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-elements';
import { appLogo } from '../assets/images/logo';
import { emailIcon, eyeIcon } from '../assets/icons';
import CustomButton from '../components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { deviceWidth } from '../styles/size';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { postRequest } from '../utils/api_call';
import CustomAlert from '../components/CustomAlert';

const LoginScreen = ({navigation, route}) => {

  const goToSignup = () => {
    navigation.navigate('Signup');
  };

  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [displayLoader, setDisplayLoader] = useState(false);
  
  useFocusEffect(
    React.useCallback(() => {
      try {
        (async () => {
          const userData = await AsyncStorage.getItem('userData');
          console.log('resultData', userData);
          if (userData) {
            // const {isLoggedIn} = JSON.parse(userData);
            console.log('result', userData);
            navigation.navigate('home');
          // if (isLoggedIn === 'true') {
          // }
          }
        })();
      } catch (err) {
        console.log('err', err);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  const handleLogin = async (values, {resetForm, setSubmitting}) => {
    try {
      navigation.navigate('home');

      // setDisplayLoader(true);
      // console.log('login_values-----------------', values);
      // const res = await postRequest('/api/Toys/Login', JSON.stringify(values), 'POST');
      // const resData = await res.json();
      // console.log('login_resData-----------------', resData);
      // if (res.status === 200 && resData.success  && resData?.data?.isError !== true && resData?.data?.email !== null) {
      //   console.log('loginSuccess--------------------------------', resData);
      //   await AsyncStorage.setItem('userData', JSON.stringify(resData?.data));
      //   resetForm();
      //   setDisplayLoader(false);
      //   navigation.navigate('home');
      // } else {
      //   // Alert.alert("Invalid credentials.");
      //   // Alert.alert(resData?.data?.error);
      //   setDisplayLoader(false);
      //   setAlertVisible(true);
      // }
    } catch (err) {
      setDisplayLoader(false);
      console.log('err', err);
    } finally {
      setDisplayLoader(false);
      setSubmitting(false);
    }
  };

  const handleViewPassword = () => {
    setShowPassword(!showPassword);
  }

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  } 

  return (
    <>
    {displayLoader &&<View style={styles.loaderContainerNew}>
      <ActivityIndicator size="large" color="#0000ff" style={styles.loaderNew} />
    </View>}
    {isLoading ? 
      <View style={styles.loaderContainer}>
        <Image source={appLogo}  style={styles.loadingIcon} />
      </View> :
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image  source={appLogo} style={styles.logo} />
        </View>

        <CustomAlert
          visible={alertVisible}
          type="error" // Can be "success", "error", or "warning"
          message="Invalid credentials."
          onClose={() => setAlertVisible(false)}
        />

      <Text style={styles.loginTitle}  > Log In </Text>
    <Formik
      initialValues={{
        email: '',
        password: '',
      }}
      // validationSchema={validationSchema}
      // onSubmit={handleLogin}
      // onSubmit={(values, { resetForm }) => {
      //   handleLogin(values, {resetForm});
      // }}
      onSubmit={(values, { resetForm, setSubmitting }) => {
        handleLogin(values, {resetForm, setSubmitting});
      }}
    >
      {({ values, handleChange, handleSubmit, errors, touched, isSubmitting }) => (
        <>
        <View style={styles.inputContainer} >
          <Text style={styles.label} >Email</Text>
        <View style={styles.inputWrapper}>
        <TextInput
          value={values.email}
          onChangeText={handleChange('email')}
          placeholder="Email" style={styles.input} />
          <Image style={styles.inputImg} source={emailIcon}  />
          {errors.email && touched.email && <Text style={styles.error}>{errors.email}</Text>}
        </View>
        </View>

        <View style={styles.inputContainer} >
          <Text style={styles.label} > Password </Text>
          <View style={styles.inputWrapper}>
        <TextInput
          value={values.password}
          placeholder="Password"
          onChangeText={handleChange('password')}
          secureTextEntry={showPassword ? false : true}
          style={[styles.input]} />
          <TouchableOpacity onPress={handleViewPassword} style={styles.passwordImgContainer}>
            <Image style={styles.inputImg} source={eyeIcon}  />
          </TouchableOpacity>
          {errors.password && touched.password && <Text style={styles.error}>{errors.password}</Text>}
        </View>
        </View>

        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        <View style={{display:'flex', alignItems:'center', marginVertical:30}}  >
          <CustomButton buttonStyle={{width:177}} title={'Log In'} onPress={isSubmitting ? null : handleSubmit} />
        </View>
        </>
      )}
    </Formik>


  {/* <View style={styles.loginWithContainer}>
    <View style={styles.line} />
      <Text style={styles.loginWithText}>Or Log in with</Text>
    <View style={styles.line} />
  </View> */}

  {/* <View style={styles.socialIcons}>
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

  <TouchableOpacity onPress={goToSignup} style={styles.signUpTextContainer}>
    <Text style={styles.signUpTextOne} >Don't have an account? <Text style={styles.signUpText} >Sign Up</Text> </Text>
  </TouchableOpacity>
</View>}
</>
  );
};

const styles = StyleSheet.create({
  loaderNew: {
    position:'fixed',
    zIndex:9999,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height:'100%'
  },
  loaderContainerNew: {
    position:'absolute',
    zIndex:9999,
    display:'flex',
    height:'100%',
    width:'100%'
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIcon: {
    marginBottom: 20,
    width: deviceWidth * 0.5,
    height: deviceWidth * 0.5,
    resizeMode:'contain',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#F9FDFF',
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 0,
  },
  logo: {
    // width: 196,
    objectFit:'contain',
    height: 230,
  },
  loginTitle: {
    color: '#0C0C0C',
    fontFamily:'DMSans-Bold',
    fontSize: 24,
    fontStyle: 'normal',
    marginTop:-20
  },
  inputContainer: {
    marginTop:20,
  },
  error: {
    color:'red',
    opacity: 0.6,
  },
  label: {
    fontFamily: 'DMSans-Regular',
    color:'#6F6F6F',
    fontSize: 14,
    marginBottom:10,
    marginLeft:4,
  },
  inputImg: {
    position:'absolute',
    right: 20,
    top: '30%',
    width: 20,
    height: 20,
  },
  passwordImgContainer: {
    position:'absolute',
    right: 0,
    // top: '20%',
    width: 20,
    height: '100%',
  },
  input: {
    paddingLeft: 15,
    height: 54,
    borderRadius: 16,
    paddingRight:50,
    fontFamily: 'DMSans-SemiBold',
    backgroundColor: '#FFFFFF',
    color: '#000000',
    elevation: 1,
    shadowColor: '#171717',
    fontSize:16
  },
  forgotPassword: {
    textDecorationLine: 'underline',
    color: 'rgba(235, 95, 10, 1)',
    fontFamily: 'DMSans-SemiBold',
    fontSize: 14,
    marginVertical:15,
    textAlign:'right',
  },
  loginButton: {
    backgroundColor: 'blue',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    color: '#fff',
  },
  loginWithContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
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
    fontFamily:'DMSans-Regular',
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
    alignItems:'center',
    justifyContent:'center',
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
      marginVertical:15,
  },
});

export default LoginScreen;

// danish.rooman@gmail.com
// @Password1