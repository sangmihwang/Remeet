import axios from 'axios';

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

const api = apiInstance();

export { api };
