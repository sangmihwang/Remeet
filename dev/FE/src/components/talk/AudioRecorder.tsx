import { useState, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import styled from 'styled-components';
import AudioPlayerTest from './AudioPlayerTest';
import { ModelInformation } from '@/types/peopleList';
import { conversateVideo, conversateVoice, transcribeVoice } from '@/api/talk';
import { History } from '@/types/talk';
import useAuth from '@/hooks/useAuth';

const Wrapper = styled.div`
  height: 25vh;
`;

const RecordButton = styled.button`
  width: 2rem;
  height: 2rem;
  border-radius: 100%;
  background-color: #f6f6f6;
  background-image: url('/icon/mic_icon.svg');
  background-repeat: no-repeat;
  background-size: 80%;
  background-position: center;
`;

const TextWrapper = styled.div`
  width: 86vw;
  height: 3rem;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ebebeb;
`;

const Text = styled.div`
  font-size: 0.875rem;
  width: 70vw;
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
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [currentTranscribe, setCurrentTranscribe] = useState<string>('');
  const { userInfo } = useAuth();
  const conversateVideoMutation = useMutation(conversateVideo, {
    onSuccess: (res) => {
      console.log(res);
      if (setVideoSrc) {
        setVideoSrc(res.data.url);
      }
      pushHistory(res.data.answer, 2);
    },
    onError: (err) => {
      console.log(err);
    },
  });
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
      if (modelInformation && userInfo && !setVideoSrc) {
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
      if (modelInformation && userInfo && setVideoSrc) {
        const videoForm = {
          question: res.data.result,
          modelName: modelInformation.modelName,
          conversationText: modelInformation.conversationText2,
          history,
          heyVoiceId: 'uxgSoqINxv9NZ5NwNoZb',
          conversationNo,
          userNo: userInfo.userId,
          modelNo: modelInformation?.modelNo,
          avatarId: modelInformation.avatarId,
        };
        conversateVideoMutation.mutate(videoForm);
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
    <Wrapper>
      <TextWrapper>
        <RecordButton onClick={startRecording} disabled={recording} />
        {/* <span>{recording ? 'Recording...' : 'Start Recording'}</span> */}
        <Text>{currentTranscribe}</Text>
      </TextWrapper>
      {!setVideoSrc && (
        <>
          <div>상대방의 대답</div>
          {audioSrc && <AudioPlayerTest src={audioSrc} />}
        </>
      )}
    </Wrapper>
  );
};

export default AudioRecorder;
