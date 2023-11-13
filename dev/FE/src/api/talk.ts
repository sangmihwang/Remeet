import { AxiosResponse } from 'axios';
import { ConversationVideoForm, ConversationVoiceForm } from '@/types/talk';
import { authApi, authFormApi } from '.';

const startConversation = async (
  modelNo: number,
  type: string,
): Promise<AxiosResponse<{ conversationNo: number }>> => {
  const data = {
    type,
  };
  return authApi.post(`talking/${modelNo}`, data);
};

const transcribeVoice = async (formData: FormData) => {
  return authFormApi.post('talking/transcribe', formData);
};

const conversateVoice = async (voiceForm: ConversationVoiceForm) => {
  return authApi.post('talking/conversation/voice', voiceForm);
};

const conversateVideo = async (videoForm: ConversationVideoForm) => {
  return authApi.post('talking/converstaion/video', videoForm);
};

export { startConversation, transcribeVoice, conversateVoice, conversateVideo };
