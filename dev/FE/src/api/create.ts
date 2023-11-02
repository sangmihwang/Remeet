import { authFormApi } from '.';

const modelCreate = async (formData: any) => {
  return authFormApi.post('model/', formData);
};

export { modelCreate };
