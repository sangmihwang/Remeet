import { AxiosResponse } from 'axios';
import HeyModel from '@/types/admin';
import { authApi } from '.';

const getHeygenId = async (): Promise<AxiosResponse<HeyModel[]>> => {
  return authApi.get('model/check-model');
};

const createHeygenId = async (data: HeyModel) => {
  return authApi.post('model/update-heyId', data);
};

const createBasicVideo = async (data: HeyModel) => {
  return authApi.post('model/create-common', data);
};

export { getHeygenId, createHeygenId, createBasicVideo };
