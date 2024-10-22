/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unstable-nested-components */
import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-elements';
import { View, Image, Text } from 'react-native';

// Import your screens
import HomeScreen from '../screens/HomeScreen';
import ServicesScreen from '../screens/ServicesScreen';
import { bottomBarBg } from '../assets/images/bottombar'; // Your custom bottom bar background image
import { deviceHeight, deviceWidth } from '../styles/size';

const Tab = createBottomTabNavigator();

const CustomTabBarBackground = () => {
  return (
    <View style={{ position: 'absolute', bottom: 0 }}>
      <Image
        source={bottomBarBg}
        style={{
          width: deviceWidth,
          height: deviceHeight * 0.15,
        }}
        resizeMode="cover"
      />
    </View>
  );
};

const tabIcons = [
  { screen: 'Home', iconName: 'home', label: 'Home' },
  { screen: 'Services', iconName: 'settings', label: 'Services' },
  { screen: 'Account', iconName: 'account-circle', label: 'Account' },
  { screen: 'Chart', iconName: 'insert-chart', label: 'Chart' },
  { screen: 'Menu', iconName: 'menu', label: 'Menu' },
];

const BottomNavigation = () => {
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            const currentTab = tabIcons.find((tab) => tab.screen === route.name);
            if (currentTab) {
              return (
                <View style={{ alignItems: 'center', zIndex:100 }}>
                  <Icon
                    name={currentTab.iconName}
                    type="material"
                    size={size}
                    color={focused ? 'blue' : 'gray'}
                  />
                  <Text style={{ color: focused ? 'blue' : 'gray' }}>{currentTab.label}</Text>
                </View>
              );
            }
            return null;
          },
          tabBarStyle: {backgroundColor:'transparent'}
        })}
        tabBarOptions={{
          showLabel: false,
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Services" component={ServicesScreen} />
        {/* <Tab.Screen name="Account" component={AccountScreen} />
        <Tab.Screen name="Chart" component={ChartScreen} />
        <Tab.Screen name="Menu" component={MenuScreen} /> */}
      </Tab.Navigator>
      <CustomTabBarBackground />
    </View>
  );
};

export default BottomNavigation;
