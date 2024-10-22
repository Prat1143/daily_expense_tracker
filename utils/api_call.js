/* eslint-disable prettier/prettier */

import { API_URL } from '../constants/constant';


export const getRequest = async (url) => {
    try {
      console.log(`${API_URL}${url}`);
      const response = await fetch(`${API_URL}${url}`, {
        headers: {
          'content-type': 'application/json',
        },
      }).catch((err) => console.log(err));
      return response;
    } catch (err) {
      console.log('err', err);
    }
  };

  export const postRequest = async (url, reqBody, reqMethod, token = false) => {
    console.log(`${API_URL}${url}`);
    try {
      const response = await fetch(`${API_URL}${url}`, {
        headers: {
          'content-type': 'application/json',
        },
        method: reqMethod,
        body: reqBody,
      }).catch((err) => console.log(err));
      return response;
    } catch (err) {
      console.log('err', err);
    }
  };