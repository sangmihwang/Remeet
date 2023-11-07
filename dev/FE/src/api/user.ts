import { AxiosResponse } from 'axios';
import { Login, SignUpForm, UserResponse } from '@/types/user';
import { api, authApi } from '.';

const userLogin = async (
  loginData: Login,
): Promise<AxiosResponse<UserResponse>> => {
  return api.post('user/login', loginData);
};

const userSignUp = async (signUpForm: SignUpForm): Promise<AxiosResponse> => {
  return api.post('user/signup', signUpForm);
};

const getCheckUserId = async (userId: string) => {
  return api.get(`user/check-id?userId=${userId}`);
};

const getUserInfo = async () => {
  return authApi.get('user');
};

export { userLogin, userSignUp, getCheckUserId, getUserInfo };
