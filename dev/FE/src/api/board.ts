import { TalkInformation } from '@/types/board';
import { authApi } from '.';

const getRecentVideos = async () => {
  return authApi.get('video/recent');
};

const getVideos = async (modelNo: number): Promise<TalkInformation[]> => {
  const response = await authApi.get<TalkInformation[]>(`video/${modelNo}`);
  return response.data;
};

const deleteVideo = async (provideoNo: number) => {
  return authApi.delete(`video/${provideoNo}`);
};

export { getRecentVideos, getVideos, deleteVideo };
