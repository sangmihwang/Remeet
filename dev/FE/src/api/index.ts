import axios from 'axios';

const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL as string;

console.log(API_BASE_URL);

const apiInstance = () => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json;charset=UTF-8',
      Accept: 'application/json,',
    },
  });
  return instance;
};

const formApiInstance = () => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'multipart/form-data;charset=UTF-8',
      Accept: 'application/json,',
    },
  });
  return instance;
};

const api = apiInstance();
const formApi = formApiInstance();

export { formApi, api };
