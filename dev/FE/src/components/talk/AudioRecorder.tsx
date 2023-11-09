import axios from 'axios';
import { useState, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import AudioPlayerTest from './AudioPlayerTest';
import { ModelInformation } from '@/types/peopleList';
import { conversateVoice, transcribeVoice } from '@/api/talk';
import { History } from '@/types/talk';

const TESTURL = 'http://localhost:5000/api/v1';

interface AudioRecorderProps {
  setVideoSrc: (url: string) => void;
  modelInformation: ModelInformation | undefined;
  pushHistory: (text: string, speakerType: number) => void;
  history: History[];
}

const AudioRecorder = ({
  setVideoSrc,
  modelInformation,
  pushHistory,
  history,
}: AudioRecorderProps) => {
  const [recording, setRecording] = useState<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [currentTranscribe, setCurrentTranscribe] = useState<string>('');
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
      const voiceForm = {
        question: res.data.result,
        modelName: modelInformation?.modelName,
        conversationText: modelInformation?.conversationText2,
        history,
        eleVoiceId: 'uxgSoqINxv9NZ5NwNoZb',
        conversationNo: 1,
        userNo: 1,
      };
      conversateVoiceMutation.mutate(voiceForm);
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
      // axios
      //   .post(`${TESTURL}/transcribe`, formData)
      //   .then((response: any) => {
      //     console.log('Successfully uploaded audio:', response.data);
      //     setAudioSrc(response.data.text);
      //     axios
      //       .post(`${TESTURL}/conversation/voice`, {
      //         // question: response.data.transcription,
      //         // heyVoiceId: '720b7163e1dc40ddbe76ab8a58161f7b',
      //         // avatarId: 'f51ed02fc13a4a1694736bfb04620901',
      //         // modelName: '강명조',
      //         // conversationText: '나 : 야 \n나 : 니 \n나 : 담주만가능하나?\n나 : 스터디잇는거까뭇네\n강명조 : 낼 모레 일이잇어서\n강명조 : 서울에\n강명조 : 아님 미룰까\n강명조 : 대답\n나 : 미루는거\n나 : 추천\n나 : 이번주만\n나 : 오지게바쁨\n나 : 일잔\n나 : 서울은어차피오는거가\n강명조 : ㅇㅇ\n강명조 : 담주 중으로감그럼\n나 : ㅇㅋ\n나 : 이번주\n나 : 젤바쁜주엿노 ㅋ\n강명조 : 일단 못갈수도잇음\n나 : ㅜ\n나 : ㅇ..\n'
      //         question: response.data.transcription,
      //         modelName: '강명조',
      //         conversationText:
      //           '나 : 야 \n나 : 니 \n나 : 담주만가능하나?\n나 : 스터디잇는거까뭇네\n강명조 : 낼 모레 일이잇어서\n강명조 : 서울에\n강명조 : 아님 미룰까\n강명조 : 대답\n나 : 미루는거\n나 : 추천\n나 : 이번주만\n나 : 오지게바쁨\n나 : 일잔\n나 : 서울은어차피오는거가\n강명조 : ㅇㅇ\n강명조 : 담주 중으로감그럼\n나 : ㅇㅋ\n나 : 이번주\n나 : 젤바쁜주엿노 ㅋ\n강명조 : 일단 못갈수도잇음\n나 : ㅜ\n나 : ㅇ..\n',
      //         eleVoiceId: 'uxgSoqINxv9NZ5NwNoZb',
      //         userNo: 1,
      //         modelNo: 1,
      //         conversationNo: 1,
      //       })
      //       .then((res) => {
      //         console.log(res);
      //         console.log(res.data);
      //         setAudioSrc(res.data.URL);
      //         setVideoSrc(res.data.URL);
      //       })
      //       .catch((err) => {
      //         console.log(err);
      //       });
      //   })
      //   .catch((error) => {
      //     console.error('Error uploading audio:', error);
      //   });
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
      <button onClick={startRecording} disabled={recording}>
        {recording ? 'Recording...' : 'Start Recording'}
      </button>
      <span>{currentTranscribe}</span>
      {audioBlob && <audio controls src={URL.createObjectURL(audioBlob)} />}
      <div>오디오 플레이어</div>
      {audioSrc && <AudioPlayerTest src={audioSrc} />}
    </div>
  );
};

export default AudioRecorder;
