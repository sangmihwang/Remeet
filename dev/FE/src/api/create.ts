import { AxiosResponse } from 'axios';
import { ModelInformation } from '@/types/peopleList';
import { authApi, authFormApi } from '.';

const modelCreate = async (
  formData: FormData,
): Promise<AxiosResponse<ModelInformation>> => {
  return authFormApi.post('model', formData);
};

const makeVoiceId = async (modelNo: number) => {
  return authApi.get(`/model/makevoice/${modelNo}`);
};

export { modelCreate, makeVoiceId };
