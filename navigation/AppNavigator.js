/* eslint-disable prettier/prettier */
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import your screens
import LoginScreen from '../screens/LoginScreen';
// import ProductsScreen from '../screens/ProductsScreen';
// import ContactUsScreen from '../screens/ContactUsScreen';
// import BottomNavigation from './BottomNavigation';
import { appBackColor } from '../styles/colors';
import { StatusBar } from 'react-native';
import SignUpScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
// import BecameFranchise from '../screens/BecameFranchise';
// import ServicesScreen from '../screens/ServicesScreen';
// import TenureScreen from '../screens/TenureScreen';
// import WishListScreen from '../screens/WishListScreen';
// import MyOrderScreen from '../screens/MyOrderScreen';
// import MyOrderDetailsScreen from '../screens/MyOrderDetailsScreen';
// import AddToCartScreen from '../screens/AddToCartScreen';
// import ProductDetailsScreen from '../screens/ProductDetailsScreen';
// import AccountScreen from '../screens/AccountScreen';
// import MySubscriptionScreen from '../screens/MySubscriptionScreen';
// import MemberShipScreen from '../screens/MemberShipScreen';
// import ChatScreen from '../screens/ChatScreen';
// import HowItWorkScreen from '../screens/HowItWorkScreen';
// import CalendarScreen from '../screens/CalendarScreen';
// import CategoriesScreen from '../screens/CategoriesScreen';
// import FilterScreen from '../components/FilterScreen';
// import MembershipCartPage from '../screens/MembershipCartPage';
// import SecurityDepositForm from '../screens/SecurityDepositForm';
// import CartCheckoutForm from '../screens/CartCheckoutForm';
// import BlogDetails from '../screens/BlogDetails';
// import ManageAccount from '../screens/ManageAccount';
// import MenuScreen from '../screens/MenuScreen';
// import ForgotPassword from '../screens/ForgotPassword';
// import BlogsList from '../screens/BlogsList';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer >
      <StatusBar backgroundColor="#F9FDFF" barStyle={'dark-content'} translucent={false} />
      <Stack.Navigator screenOptions={{cardStyle: {backgroundColor:appBackColor}}} initialRouteName="Login" >
      {/* <Stack.Navigator screenOptions={{cardStyle: {backgroundColor:appBackColor}}} initialRouteName="home" > */}
        <Stack.Screen options={{headerShown:false}}  name="Login" component={LoginScreen} />
        <Stack.Screen options={{headerShown:false}}  name="Signup" component={SignUpScreen} />
        {/* <Stack.Screen options={{headerShown:false}} name="Products" component={ProductsScreen} />
        <Stack.Screen options={{headerShown:false}} name="ContactUs" component={ContactUsScreen} />
        <Stack.Screen options={{headerShown:false}} name="BecameFranchise" component={BecameFranchise} />
        <Stack.Screen options={{headerShown:false}} name="Services" component={ServicesScreen} />
        <Stack.Screen options={{headerShown:false}} name="Categories" component={CategoriesScreen} />
        <Stack.Screen options={{headerShown:false}} name="Tenure" component={TenureScreen} />
        <Stack.Screen options={{headerShown:false}} name="Wishlist" component={WishListScreen} />
        <Stack.Screen options={{headerShown:false}} name="MyOrder" component={MyOrderScreen} />
        <Stack.Screen options={{headerShown:false}} name="MyOrderDetails" component={MyOrderDetailsScreen} />
        <Stack.Screen options={{headerShown:false}} name="AddToCart" component={AddToCartScreen} />
        <Stack.Screen options={{headerShown:false}} name="ProductDetails" component={ProductDetailsScreen} />
        <Stack.Screen options={{headerShown:false}} name="Account" component={AccountScreen} />
        <Stack.Screen options={{headerShown:false}} name="MySubscription" component={MySubscriptionScreen} />
        <Stack.Screen options={{headerShown:false}} name="Membership" component={MemberShipScreen} />
        <Stack.Screen options={{headerShown:false}} name="Chat" component={ChatScreen} />
        <Stack.Screen options={{headerShown:false}} name="HowItWork" component={HowItWorkScreen} />
        <Stack.Screen options={{headerShown:false}} name="Calendar" component={CalendarScreen} />
        <Stack.Screen options={{headerShown:false}} name="FilterScreen" component={FilterScreen} />
        <Stack.Screen options={{headerShown:false}} name="SecurityDepositForm" component={SecurityDepositForm} />
        <Stack.Screen options={{headerShown:false}} name="MembershipCartPage" component={MembershipCartPage} />
        <Stack.Screen options={{headerShown:false}} name="CartCheckoutForm" component={CartCheckoutForm} />
        <Stack.Screen options={{headerShown:false}} name="BlogDetails" component={BlogDetails} />
        <Stack.Screen options={{headerShown:false}} name="BlogsList" component={BlogsList} />
        <Stack.Screen options={{headerShown:false}} name="ManageAccount" component={ManageAccount} />
        <Stack.Screen options={{headerShown:false}} name="MenuScreen" component={MenuScreen} />
        <Stack.Screen options={{headerShown:false}} name="ForgotPassword" component={ForgotPassword} />*/}
        <Stack.Screen options={{headerShown:false}} name="home" component={HomeScreen} />
        {/* Add more stack screens here for screens that don't need the bottom tab navigation */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
