import axios from 'axios';
import React, { useState, useRef } from 'react';
import AudioPlayerTest from './AudioPlayerTest';

const TESTURL =
  'https://k9a706.p.ssafy.io/:8443/api/v1/talking/stt/xiwegDxmfAZs4jY54VHT';

const AudioRecorder: React.FC = () => {
  const [recording, setRecording] = useState<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);

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
      formData.append('audio', newAudioBlob, 'audio.wav'); // 'audio'는 서버에서 받을 이름, 'audio.wav'는 파일 이름

      // axios를 사용하여 서버에 POST 요청 보내기
      axios
        .post(TESTURL, formData)
        .then((response: any) => {
          console.log('Successfully uploaded audio:', response.data);
          setAudioSrc(response.text);
        })
        .catch((error) => {
          console.error('Error uploading audio:', error);
        });
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
      {audioBlob && <audio controls src={URL.createObjectURL(audioBlob)} />}
      <div>오디오 플레이어</div>
      {audioSrc && <AudioPlayerTest src={audioSrc} />}
    </div>
  );
};

export default AudioRecorder;
