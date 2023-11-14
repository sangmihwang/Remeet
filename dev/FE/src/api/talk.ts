import { AxiosResponse } from 'axios';
import {
  ConversationResponse,
  ConversationVideoForm,
  ConversationVoiceForm,
  TalkSaveForm,
} from '@/types/talk';
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

const conversateVoice = async (
  voiceForm: ConversationVoiceForm,
): Promise<AxiosResponse<ConversationResponse>> => {
  return authApi.post('talking/conversation/voice', voiceForm);
};

const conversateVideo = async (
  videoForm: ConversationVideoForm,
): Promise<AxiosResponse<ConversationResponse>> => {
  return authApi.post('talking/converstaion/video', videoForm);
};

const talkingQuestion = async (formData: FormData) => {
  return authFormApi.post('talking/question', formData);
};

const saveTalking = async (data: TalkSaveForm) => {
  return authApi.post('talking/combination', data);
};

export {
  startConversation,
  transcribeVoice,
  conversateVoice,
  conversateVideo,
  talkingQuestion,
  saveTalking,
};
