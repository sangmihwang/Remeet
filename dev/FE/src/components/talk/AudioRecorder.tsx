import { useState, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import styled from 'styled-components';
import AudioPlayerTest from './AudioPlayerTest';
import { ModelInformation } from '@/types/peopleList';
import { conversateVoice, transcribeVoice } from '@/api/talk';
import { History } from '@/types/talk';
import useAuth from '@/hooks/useAuth';

const RecordButton = styled.button`
  width: 2rem;
  height: 2rem;
  border-radius: 100%;
  background-image: url('/icon/mic_icon.svg');
  background-repeat: no-repeat;
  background-size: contain;
`;

interface AudioRecorderProps {
  setVideoSrc?: (url: string) => void;
  modelInformation: ModelInformation | undefined;
  pushHistory: (text: string, speakerType: number) => void;
  history: History[];
  conversationNo: number;
}

const AudioRecorder = ({
  setVideoSrc,
  modelInformation,
  pushHistory,
  history,
  conversationNo,
}: AudioRecorderProps) => {
  const [recording, setRecording] = useState<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [currentTranscribe, setCurrentTranscribe] = useState<string>('');
  const { userInfo } = useAuth();
  const conversateVoiceMutation = useMutation(conversateVoice, {
    onSuccess: (res) => {
      console.log(res);
      setAudioSrc(res.data.url);
      pushHistory(res.data.answer, 2);
    },
    onError: (err) => {
      console.log(err);
    },
  });
  const transcribeMutation = useMutation(transcribeVoice, {
    onSuccess: (res) => {
      console.log(res);
      pushHistory(res.data.result, 1);
      setCurrentTranscribe(res.data.result);
      if (modelInformation && userInfo) {
        const voiceForm = {
          question: res.data.result,
          modelName: modelInformation.modelName,
          conversationText: modelInformation.conversationText2,
          history,
          eleVoiceId: 'uxgSoqINxv9NZ5NwNoZb',
          conversationNo,
          userNo: userInfo.userId,
          modelNo: modelInformation?.modelNo,
        };
        conversateVoiceMutation.mutate(voiceForm);
      }
    },
    onError: (err) => console.log(err),
  });

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    const audioChunks: Blob[] = [];
    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const newAudioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      setAudioBlob(newAudioBlob);
      // You can save or send the audioBlob to the server now
      // FormData를 만들어서 음성 파일 추가
      const formData = new FormData();
      formData.append('file', newAudioBlob, 'audio.wav'); // 'audio'는 서버에서 받을 이름, 'audio.wav'는 파일 이름

      // axios를 사용하여 서버에 POST 요청 보내기
      transcribeMutation.mutate(formData);
    };

    mediaRecorder.start();
    setRecording(true);

    // Stop recording after 6 seconds
    setTimeout(() => {
      mediaRecorder.stop();
      setRecording(false);
    }, 6000);
  };

  return (
    <div>
      <RecordButton onClick={startRecording} disabled={recording} />
      <span>{recording ? 'Recording...' : 'Start Recording'}</span>
      <span>{currentTranscribe}</span>
      <div>상대방의 대답</div>
      {audioSrc && <AudioPlayerTest src={audioSrc} />}
    </div>
  );
};

export default AudioRecorder;
