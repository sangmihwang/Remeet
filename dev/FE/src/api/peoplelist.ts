import { ModelInformation } from '@/types/peopleList';
import { authApi } from '.';

const getPeopleList = async (option: string) => {
  return authApi.get(`model?option=${option}`);
};

const getPeopleInfo = async (modelNo: number): Promise<ModelInformation> => {
  const response = await authApi.get<ModelInformation>(`model/${modelNo}`);
  return response.data;
};

const deletePeople = async (modelNo: number) => {
  return authApi.delete(`model/${modelNo}`);
};

export { getPeopleList, getPeopleInfo, deletePeople };
