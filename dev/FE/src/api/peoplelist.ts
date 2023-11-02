import { authApi } from '.';

const getPeopleList = async (option: string) => {
  return authApi.get(`model?option=${option}`);
};

const getPeopleInfo = async (modelNo: number) => {
  return authApi.get(`model/${modelNo}`);
};

const deletePeople = async (modelNo: number) => {
  return authApi.delete(`model/${modelNo}`);
};

export { getPeopleList, getPeopleInfo, deletePeople };
