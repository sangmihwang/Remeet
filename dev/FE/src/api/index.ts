import axios, { AxiosInstance } from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { getAccessToken, getRefreshToken, setAccessToken } from '@/utils';

const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL as string;

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

const authIntercepter = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    (config) => {
      const accessToken = getAccessToken();
      config.headers['X-ACCESS-TOKEN'] = accessToken;
      return config;
    },
    (error) => {
      console.error('request error : ', error);
      return Promise.reject(error);
    },
  );

  return instance;
};

// 나중에 any처리하기
const refreshAuthLogic = async (failedRequest: any) => {
  const refreshToken = getRefreshToken();
  return axios
    .post(
      `${API_BASE_URL}user/reissue`,
      {},
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'X-REFRESH-TOKEN': refreshToken,
        },
      },
    )
    .then((res: any) => {
      setAccessToken(res.data.token);
      failedRequest.response.config.headers['X-ACCESS-TOKEN'] = res.data.token;
      return Promise.resolve(failedRequest);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

const authApiInstance = () => {
  return authIntercepter(apiInstance());
};

const authFormApiInstance = () => {
  return authIntercepter(formApiInstance());
};

const api = apiInstance();
const formApi = formApiInstance();
const authApi = authApiInstance();
const authFormApi = authFormApiInstance();

createAuthRefreshInterceptor(authApi, refreshAuthLogic, {
  statusCodes: [409],
});
createAuthRefreshInterceptor(authFormApi, refreshAuthLogic, {
  statusCodes: [409],
});

export { formApi, api, authApi, authFormApi };
