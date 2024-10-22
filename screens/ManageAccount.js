import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import AppTopBar from '../components/AppTopBar';
import { appBackColor } from '../styles/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../constants/constant';
import { launchImageLibrary } from 'react-native-image-picker';
import CustomButton from '../components/CustomButton';
import { getStoredUserData } from '../utils/common';
import { postRequest, getRequest } from '../utils/api_call';
import { Picker } from '@react-native-picker/picker';

const formSchema = yup.object({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    // contact: yup.string().required('Contact is required'),
    // areaId: yup.number().required('Area ID is required').positive().integer(),
    // email: yup.string().email('Invalid email').required('Email is required'),
});
  
const ManageAccount = ({navigation}) => {
    const [userData, setUserData] = useState({});
    const [isUserDataFetched, setIsUserDataFetched] = useState(false);
    const [pincodesArr, setPincodesArr] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getStoredUserData();
            console.log("userData---------------------------", data);
            if (data) {
                setUserData(data); // Update the state with the fetched user data
                setIsUserDataFetched(true);
            }
        };
    
        fetchData();
        getPincodeData();
    }, []);

    const getPincodeData = async() => {
        const res = await getRequest(`/api/Toys/GetAllPinCodesWithAreaId`);
        const resData = await res.json();
        console.log("resData---------------------------", resData?.data);
        if(resData?.success == true) {
            setPincodesArr(resData?.data);
        }
    }

    // useEffect(()=> {
    //     getUserData();
    // },[]);
    
    // const getUserData = async() => {
    //     const userData = await getStoredUserData();
    //     console.log("userData---------------------------",userData);
    // }

    const selectImage = (setFieldValue) => {
        const options = {
          noData: true,
          includeBase64: true,
        };
    
        launchImageLibrary(options, response => {
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          } else {
            const source = { uri: response.assets[0].uri };
            const base64 = response.assets[0].base64;
            setFieldValue('imagePath', source.uri);
            setFieldValue('imageBase64', base64);
          }
        });
    };

    const removeImage = (setFieldValue) => {
        setFieldValue('imagePath', '');
        setFieldValue('imageBase64', '');
    };

    const handleProfileUpdate = async(values) => {
        console.log("handleProfileUpdate=========",values);
        const apiData = {
            id:userData?.userId,
            firstName: values?.firstName,
            lastName: values?.lastName,
            contact: values?.contact,
            areaId: JSON.parse(values?.areaId),
            email:values?.email,
            imagePath:values?.imageBase64
        }
        console.log("apiData=========",apiData);
        const res = await postRequest('/api/Toys/UpdateUserProfile', JSON.stringify(apiData), 'POST');
        const resData = await res.json();
        console.log("resData=------------------------------========",resData);
        if(resData?.success == true) {
            Alert.alert(resData?.data);
        }
    }

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <AppTopBar navigation={navigation} title={'Manage Account'} />

        <View style={{ marginTop:30 }}>
            {isUserDataFetched && <Formik
                initialValues={{
                    firstName: userData.firstName || '',
                    lastName: userData.lastName || '',
                    contact: userData.phoneNumber || '',
                    areaId: '',
                    email: userData.email || '',
                    imagePath: '',
                    imageBase64: '',
                }}
                validationSchema={formSchema}
                onSubmit={(values) => handleProfileUpdate(values)}
            >
                {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched, isSubmitting }) => (
                    <View style={styles.formContainer}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>First Name</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={handleChange('firstName')}
                                    onBlur={handleBlur('firstName')}
                                    value={values.firstName}
                                    placeholder="First Name"
                                />
                                {touched.firstName && errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Last Name</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={handleChange('lastName')}
                                    onBlur={handleBlur('lastName')}
                                    value={values.lastName}
                                    placeholder="Last Name"
                                />
                                {touched.lastName && errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Contact</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={handleChange('contact')}
                                    onBlur={handleBlur('contact')}
                                    value={values.contact}
                                    placeholder="Contact"
                                    keyboardType="phone-pad"
                                />
                                {touched.contact && errors.contact && <Text style={styles.errorText}>{errors.contact}</Text>}
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Email</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={handleChange('email')}
                                    onBlur={handleBlur('email')}
                                    value={values.email}
                                    placeholder="Email"
                                    keyboardType="email-address"
                                />
                                {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Select Pincode</Text>
                            <View style={styles.inputWrapper}>
                                <Picker
                                    selectedValue={values.areaId}
                                    onValueChange={handleChange('areaId')}
                                    style={styles.picker} 
                                >
                                    <Picker.Item label="Select a Pincode" value="" />
                                    {pincodesArr.map((pincode, index) => (
                                        <Picker.Item key={index} label={pincode?.pincode.toString()} value={pincode?.areaId?.toString()} />
                                    ))}
                                </Picker>
                                {touched.areaId && errors.areaId && <Text style={styles.errorText}>{errors.areaId}</Text>}
                            </View>
                        </View>

                        {/* <View style={styles.inputContainer}>
                            <Text style={styles.label}>Select Pincode</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={handleChange('areaId')}
                                    onBlur={handleBlur('areaId')}
                                    value={values.areaId}
                                    placeholder="Pincode"
                                    keyboardType="numeric"
                                />
                                {touched.areaId && errors.areaId && <Text style={styles.errorText}>{errors.areaId}</Text>}
                            </View>
                        </View> */}


                        <View style={styles.inputContainer}>
                                {values.imagePath !== "" ? (
                                    <View style={styles.imageContainer}>
                                        <Image source={{ uri: values.imagePath }} style={styles.imagePreview} />
                                        <TouchableOpacity 
                                            style={styles.removeImageButton} 
                                            onPress={() => removeImage(setFieldValue)}
                                        >
                                            <Text style={styles.removeImageText}>X</Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <View style={styles.imageUploader}>
                                        <TouchableOpacity onPress={() => selectImage(setFieldValue)} style={styles.selectImageBtn}>
                                            <Text>Upload profile image</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                        </View>

                        <View style={{ display: 'flex', alignItems: 'center', marginVertical: 30 }}>
                            <CustomButton buttonStyle={{ width: 177 }} onPress={handleSubmit} title={'Submit'} />
                        </View>
                    </View>
                )}
            </Formik>}
        </View>
      </ScrollView>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      padding: 20,
    },
    formContainer: {
      width: '100%',
    },
    // input: {
    //   borderWidth: 1,
    //   borderColor: '#ddd',
    //   padding: 10,
    //   fontSize: 18,
    //   borderRadius: 6,
    //   marginBottom: 10,
    // },
    input: {
        paddingLeft: 15,
        height: 50,
        borderRadius: 16,
        paddingRight: 50,
        fontFamily: 'DMSans-SemiBold',
        backgroundColor: '#FFFFFF',
        color: '#000000',
        elevation: 1,
        shadowColor: '#171717',
        marginBottom:5
    },
    errorText: {
      color: 'crimson',
      fontWeight: 'bold',
      marginBottom: 10,
      marginTop: -6,
      textAlign: 'center',
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
    error: {
        color:'red',
        opacity: 0.6,
    },
    imageUploader: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
        height: 50,
        marginBottom: 20,
        borderRadius:50
    },
    imagePreview: {
        width: 90,
        height: 90,
        marginBottom: 10,
        borderRadius:50
    },
    imageContainer: {
        display:'flex',
        flexDirection:'row',
        alignItems:'center'
    },
    removeImgBtn: {
        borderRadius:50
    },
    removeImageButton: {
        position: 'absolute',
        // right: -10,
        left:60,
        top: -10,
        backgroundColor: 'red',
        borderRadius: 15,
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    removeImageText: {
        color: 'white',
        fontSize: 18,
    },
    picker: {
        paddingLeft: 15,
        // height: 50,
        borderRadius: 40,
        // paddingRight: 50,
        fontFamily: 'DMSans-SemiBold',
        backgroundColor: '#FFFFFF',
        color: '#000000',
        elevation: 1,
        shadowColor: '#171717',
        marginBottom:5
        // Add more styling as needed
    },
  });
  
  export default ManageAccount;