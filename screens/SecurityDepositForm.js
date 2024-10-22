import React, {useState, useEffect} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, SafeAreaView, Alert } from 'react-native';
import { postRequest, getRequest } from '../utils/api_call';
import { appBackColor } from '../styles/colors';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AppTopBar from '../components/AppTopBar';
import CustomButton from '../components/CustomButton';
import { getStoredUserData } from '../utils/common';

const SecurityDepositForm = ({navigation, route}) => {

    // useEffect(()=>{
    // },[]);

   

    // const validationSchema = Yup.object().shape({
    //     name: Yup.string().required('Name is required'),
    //     account_no: Yup.string().required('Account No is required'),
    //     bank_name: Yup.string().required('Bank name and branch is required'),
    //     security_deposit: Yup.string().required('Security Deposit is required'),
    //     upi_id: Yup.string().required('UPI id is required'),
    //     // .required('Phone is required'),
    //     // ifsc_code: Yup.string().required('Message is required'),
    //     // upi_id: Yup.string().required('Message is required'),
    // });

    const validationSchema = Yup.object().shape({
        name: Yup.string('Name is required'),
        account_no: Yup.string('Account No is required'),
        bank_name: Yup.string('Bank name and branch is required'),
        security_deposit: Yup.string('Security Deposit is required'),
        upi_id: Yup.string('UPI id is required'),
      }).test('eitherOr', 'Either UPI id is required or Name, Account No, Bank Name, Security Deposit', function(values) {
        const { name, account_no, bank_name, security_deposit, upi_id } = values;
      
        // Check if either UPI id is filled or the group of fields is filled
        const isUpiIdFilled = !!upi_id;
        const isGroupFilled = !!(name && account_no && bank_name && security_deposit);
      
        // Either UPI id must be filled or the group of fields must be filled
        if (!(isUpiIdFilled || isGroupFilled)) {
          return this.createError({
            path: isUpiIdFilled ? 'upi_id' : 'ifsc_code', // You can choose any field to attach the error to
            message: 'Either UPI id is required or Name, Account No, Bank Name, Security Deposit',
          });
        }
      
        return true;
      });

    const handleFormSubmit = async (values, {resetForm}) => {
        try {
            const userData = await getStoredUserData();
            const payload ={
                "userId":userData?.userId,
                "AccountHolderName": values?.name,
                "AccountNo": values?.account_no,
                "BankAndBranch": values?.bank_name,
                "IFSCcode": values?.ifsc_code,
                "UPICode":values?.upi_id,
                "Status": 1,
                "SecurityDeposit": values?.security_deposit
            }
            console.log("RequestSecurityRedeem_payload==============",payload);
            const res = await postRequest('/api/Toys/RequestSecurityRedeem', JSON.stringify(payload), 'POST');
            const resData = await res.json();
            console.log("RequestSecurityRedeem_res==============",resData);
            if(resData?.success == true) {
                resetForm();
                Alert.alert(resData?.data);
            }
        } catch (err) {
            console.log('err', err);
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: appBackColor }}>
            <AppTopBar navigation={navigation} title={'Security Deposit'} />
            <ScrollView contentContainerStyle={styles.container}>
                <Formik
                    initialValues={{
                        name: '',
                        account_no:'',
                        bank_name: '',
                        ifsc_code: '',
                        upi_id: '',
                        security_deposit:'',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleFormSubmit}
                >
                    {({values, handleChange, handleSubmit, errors, touched, isSubmitting}) => (
                        <>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Account Holder Name</Text>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        onChangeText={handleChange('name')}
                                        value={values.name}
                                        style={styles.input} 
                                    />
                                    {errors.name && touched.name  && <Text style={styles.error} >{errors.name} </Text> }
                                </View>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Account No</Text>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        onChangeText={handleChange('account_no')}
                                        value={values.account_no}
                                        style={styles.input} 
                                    />
                                    {errors.account_no && touched.account_no  && <Text style={styles.error} >{errors.account_no} </Text> }
                                </View>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Bank Name & Branch</Text>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        onChangeText={handleChange('bank_name')}
                                        value={values.bank_name}
                                        style={styles.input} 
                                    />
                                    {errors.bank_name && touched.bank_name  && <Text style={styles.error} >{errors.bank_name} </Text> }
                                </View>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Security Deposit Amount</Text>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        onChangeText={handleChange('security_deposit')}
                                        value={values.security_deposit}
                                        style={styles.input}
                                        keyboardType='numeric'
                                    />
                                    {errors.security_deposit && touched.security_deposit  && <Text style={styles.error} >{errors.security_deposit} </Text> }
                                </View>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>IFSC Code</Text>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        onChangeText={handleChange('ifsc_code')}
                                        value={values.ifsc_code}
                                        style={styles.input} 
                                    />
                                    {errors.ifsc_code && touched.ifsc_code  && <Text style={styles.error} >{errors.ifsc_code} </Text> }
                                </View>
                            </View>

                            <Text style={styles.or_label}>OR</Text>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>UPI Code</Text>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        onChangeText={handleChange('upi_id')}
                                        value={values.upi_id}
                                        style={styles.input} 
                                    />
                                    {errors.upi_id && touched.upi_id  && <Text style={styles.error} >{errors.upi_id} </Text> }
                                </View>
                            </View>

                            

                            <View style={{ display: 'flex', alignItems: 'center', marginVertical: 30, paddingBottom:20 }}>
                                <CustomButton buttonStyle={{ width: 177 }} onPress={isSubmitting ? null : handleSubmit} title={'Submit'} />
                            </View>
                        </>
                    )}
                </Formik>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        backgroundColor: appBackColor,
        marginTop:30,
        marginBottom:20
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
    or_label: {
        fontFamily: 'DMSans-Regular',
        color: '#6F6F6F',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10,
        marginLeft: 4,
        marginTop:20,
        textAlign:'center'
    }
});

export default SecurityDepositForm;
