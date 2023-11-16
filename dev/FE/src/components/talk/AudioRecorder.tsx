import { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useMutation } from '@tanstack/react-query';
import { ModelInformation } from '@/types/peopleList';
import { talkingQuestion } from '@/api/talk';

const Wrapper = styled.div``;

interface AudioRecorderProps {
  modelInformation: ModelInformation;
  conversationNo: number;
  audioRecording: boolean;
  setVideoSrc?: (url: string) => void;
}

const AudioRecorder = ({
  modelInformation,
  conversationNo,
  audioRecording,
  setVideoSrc,
}: AudioRecorderProps) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const mutation = useMutation(talkingQuestion, {
    onSuccess: (res) => console.log(res),
    onError: (err) => console.log(err),
  });

  useEffect(() => {
    // 녹음 시작
    const startRecording = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const audioChunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const newAudioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        // const audioURL = URL.createObjectURL(newAudioBlob);
        const type = setVideoSrc ? 'video' : 'voice';
        console.log(type);

        const formData = new FormData();
        formData.append('conversationNo', `${conversationNo}`);
        formData.append('modelNo', `${modelInformation.modelNo}`);
        formData.append('type', type);
        formData.append('file', newAudioBlob, 'audio.wav');
        mutation.mutate(formData);
      };

      mediaRecorder.start();
    };

    if (audioRecording) {
      // 녹음 시작
      startRecording().catch(() => {});
    } else {
      // 녹음 멈춤
      mediaRecorderRef.current?.stop();
    }

    // 컴포넌트가 언마운트되거나 audioRecording이 false가 되기 전에 녹음을 멈추도록 함
    return () => {
      mediaRecorderRef.current?.stop();
    };
  }, [audioRecording]); // audioRecording 상태가 변경될 때마다 useEffect가 실행됩니다.

  return <Wrapper />;
};

export default AudioRecorder;
