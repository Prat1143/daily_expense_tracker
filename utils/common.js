/* eslint-disable prettier/prettier */
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getStoredUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');

      if (userDataString !== null) {
        const userDataObj = JSON.parse(userDataString);
        console.log('========userData===========', userDataObj.user_id);
        return userDataObj;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error retrieving user data: ', error);
    }
  };