import { AxiosResponse } from 'axios';
import { Login, UserResponse } from '@/types/user';
import { api, authApi, formApi } from '.';

const userLogin = async (
  loginData: Login,
): Promise<AxiosResponse<UserResponse>> => {
  return api.post('user/login', loginData);
};

const userSignUp = async (signUpForm: FormData): Promise<AxiosResponse> => {
  return formApi.post('user/signup', signUpForm);
};

const getCheckUserId = async (userId: string) => {
  return api.get(`user/check-id?userId=${userId}`);
};

const getUserInfo = async () => {
  return authApi.get('user');
};

const deleteUser = async () => {
  return authApi.delete('user');
};

export { userLogin, userSignUp, getCheckUserId, getUserInfo, deleteUser };
