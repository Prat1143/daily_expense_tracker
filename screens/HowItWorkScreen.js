/* eslint-disable prettier/prettier */
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';
import React from 'react';
import { appBackColor } from '../styles/colors';
import AppTopBar from '../components/AppTopBar';
import GlobalMargin from '../components/GlobalMargin';
import { ScrollView } from 'react-native';
import { calendarBlueFillIcon, calendarBlueIcon, cardPoseBlueFillIcon, checkSquareBlueFillIcon, checkSquareBlueIcon, refreshBlueFillIcon, statusUpBlueFillIcon } from '../assets/icons';
import { deviceHeight, deviceWidth } from '../styles/size';

const HowItWorkScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <AppTopBar title={'How It Work'} navigation={navigation} />
      <GlobalMargin />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.stepConnector} />
        <View style={styles.stepContainer}>
          <View style={styles.step}>
            <Text style={styles.stepNumber}>1</Text>
          </View>
          <View style={styles.stepTextContainer} >
            <Text style={styles.stepText} >Step</Text>
          </View>
          <View style={styles.stepContent}>
            <View style={styles.iconContainer}>
              <Image source={checkSquareBlueFillIcon} style={styles.icon} />
            </View>
            <View style={{ paddingRight: 40 }}>
              <Text style={styles.contentText}>Select Library Services on home page</Text>
            </View>
          </View>
        </View>
        <View style={styles.stepContainer}>
          <View style={styles.step}>
            <Text style={styles.stepNumber}>2</Text>
          </View>
          <View style={styles.stepTextContainer} >
            <Text style={styles.stepText} >Step</Text>
          </View>
          <View style={styles.stepContent}>
            <View style={styles.iconContainer}>
              <Image source={calendarBlueFillIcon} style={styles.icon} />
            </View>
            <View style={{ paddingRight: 40 }}>
              <Text style={styles.contentText}>Choose your desired items and select exchange duration (1 week/2 Week)</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.stepContainer}>
          <View style={styles.step}>
            <Text style={styles.stepNumber}>3</Text>
          </View>
          <View style={styles.stepTextContainer} >
            <Text style={styles.stepText} >Step</Text>
          </View>
          <View style={styles.stepContent}>
            <View style={styles.iconContainer}>
              <Image source={cardPoseBlueFillIcon} style={styles.icon} />
            </View>
            <View style={{ paddingRight: 40 }}>
              <Text style={styles.contentText}>
                Now opt your membership package that
               includes One time Registration Fee + Minimum Rental Recharge + Refundable
                Security Deposit & Delivery Charges if any
                </Text>
            </View>
          </View>
        </View>

        <View style={styles.stepContainer}>
          <View style={styles.step}>
            <Text style={styles.stepNumber}>4</Text>
          </View>
          <View style={styles.stepTextContainer} >
            <Text style={styles.stepText} >Step</Text>
          </View>
          <View style={styles.stepContent}>
            <View style={styles.iconContainer}>
              <Image source={statusUpBlueFillIcon} style={styles.icon} />
            </View>
            <View style={{ paddingRight: 40 }}>
              <Text style={styles.contentText}>
              Make Payment and Receive Toys at your door step within 2 working days
               (If cart value is more then minimum recharge value, Pay the excess
                amount or upgrade plan for more benefits.)</Text>
            </View>
          </View>
        </View>

        <View style={styles.stepContainer}>
          <View style={styles.step}>
            <Text style={styles.stepNumber}>5</Text>
          </View>
          <View style={styles.stepTextContainer} >
            <Text style={styles.stepText} >Step</Text>
          </View>
          <View style={styles.stepContent}>
            <View style={styles.iconContainer}>
              <Image source={refreshBlueFillIcon} style={styles.icon} />
            </View>
            <View style={{ paddingRight: 40 }}>
              <Text style={styles.contentText}>
              Place Next Order 2 Days Prior to Exchange Day.
               Also You have option to continue with same toys.
                If you don't place any exchange order, It will be consider
                 that you continue with toys with prior selected exchange cycle
                </Text>
            </View>
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
  scrollContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  step: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderColor:'#F1A577',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#FFF',
  },
  stepNumber: {
    color: '#EB5F0A', // Text color inside circle
    fontSize: 16,
  },
  stepTextContainer: {
    position:'absolute',
    top: 40,
  },
  stepText: {
    color: '#545454',
    fontFamily:'DMSans-Regular',
    fontSize:14,
  },
  stepContent: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: '#FFF',
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#0C0C0C',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    maxWidth: deviceWidth - 10,
  },
  iconContainer: {
    backgroundColor: '#F3F9FC',
    padding: 10,
    borderRadius: 12,
  },
  icon: {
    width: deviceWidth * 0.067,
    height: deviceWidth * 0.067,
  },
  contentText: {
    fontSize: 15,
    color: '#000',
    fontFamily: 'DMSans-Medium',
    lineHeight: 22,
  },
  stepConnector: {
      borderWidth: 0.9,
      borderStyle:'dashed',
      borderColor:'#DAE9EF',
      height: deviceHeight * 0.79,
      position:'absolute',
      left: 33,
      top: 20,
  }
});

export default HowItWorkScreen;
