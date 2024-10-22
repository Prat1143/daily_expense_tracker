/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { Image, SafeAreaView } from 'react-native';
import { View, StyleSheet } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import AppTopBar from '../components/AppTopBar';
import CustomBottomTabBar from '../navigation/CustomBottomTabBar';
import { appBackColor } from '../styles/colors';
import { Text } from 'react-native';
import { messagesIcon } from '../assets/icons';
import { deviceWidth } from '../styles/size';
import { TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

LocaleConfig.locales['en'] = {
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
};

LocaleConfig.defaultLocale = 'en';

const CalendarScreen = ({navigation, route}) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const bookedDates = route?.params?.bookedDates || [];
  
  const todayDate = new Date().toISOString().split('T')[0];

  console.log("bookedDatesssssss========", route?.params?.bookedDates);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    route.params?.onSelectDate(date);
    navigation.goBack();
  };

  const handleNavigation = (screenName) => {
    navigation.navigate(screenName);
  };

  const markedDates = bookedDates.reduce((acc, date) => {
    // Convert date from DD-MM-YYYY to YYYY-MM-DD format
    const formattedDate = date.split("-").reverse().join("-");
    acc[formattedDate] = { disabled: true, disableTouchEvent: true, selected: true };
    return acc;
  }, {});

  return (
    <SafeAreaView style={styles.container}>
        <AppTopBar title={'Calendar'} navigation={navigation} />
      <View style={{flex: 1}} >
      <Calendar
        // current={'2024-01-08'} // Set the current date
        onDayPress={(day) => handleDateSelect(day.dateString)} // Handle date selection
        style={styles.calendar}
        markedDates={markedDates}
        minDate={todayDate}
        theme={{
          backgroundColor: '#F9FDFF', // Change background color
          calendarBackground: '#F9FDFF', // Change calendar background color
          textSectionTitleColor: '#676767', // Change text color
          selectedDayBackgroundColor: '#D0CCCB', // Change selected day background color
          selectedDayTextColor: '#FFF', // Change selected day text color
          todayTextColor: '#007AFF', // Change today text color
          dayTextColor: '#000', // Change day text color
          textDisabledColor: '#A3A3A3', // Change disabled text color
          arrowColor: '#007AFF', // Change arrow color
          monthTextColor: '#000', // Change month text color
          textDayFontFamily: 'DMSans-Regular', // Change day text font family
          textMonthFontFamily: 'DMSans-Bold', // Change month text font family
          textDayHeaderFontFamily: 'DMSans-Medium', // Change day header text font family
        }}
      />
      <TouchableOpacity onPress={() => handleNavigation('Chat')} style={styles.messageIconContainer} >
        <LinearGradient
          colors={['#f57223', '#ff914e']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.messageIconGradientContainer}
         >
        <Image source={messagesIcon} style={styles.icon} />
        </LinearGradient>
      </TouchableOpacity>
      </View>
      <CustomBottomTabBar routeName={'menu'} navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appBackColor,
  },
  calendar: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    margin: 20,
    marginTop: 50,
  },
  messageIconContainer: {
    position:'absolute',
    right: 20,
    bottom: 90,
  },
  messageIconGradientContainer: {
    width: deviceWidth * 0.14,
    height: deviceWidth * 0.14,
    borderRadius: 100,
    alignItems:'center',
    justifyContent:'center',
  },
  icon: {
    width: deviceWidth * 0.062,
    height: deviceWidth * 0.062,
  }
});

export default CalendarScreen;
