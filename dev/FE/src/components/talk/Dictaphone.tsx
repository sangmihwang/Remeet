import 'regenerator-runtime/runtime';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { ModelInformation } from '@/types/peopleList';
import useAuth from '@/hooks/useAuth';
import { conversateVideo, conversateVoice } from '@/api/talk';
import {
  ConversationResponse,
  ConversationVideoForm,
  ConversationVoiceForm,
} from '@/types/talk';
import AudioRecorder from './AudioRecorder';

interface DictaphoneProps {
  setVideoSrc?: (url: string) => void;
  modelInformation: ModelInformation | undefined;
  pushHistory: (text: string, speakerType: number) => void;
  conversationNo: number;
}

const Dictaphone = ({
  setVideoSrc,
  modelInformation,
  pushHistory,
  conversationNo,
}: DictaphoneProps) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    finalTranscript,
  } = useSpeechRecognition();
  const { userInfo } = useAuth();
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [audioRecording, setAudioRecording] = useState<boolean>(false);
  console.log(conversationNo);

  if (!browserSupportsSpeechRecognition) {
    return <span />;
  }

  const conversateVideoMutation = useMutation<
    AxiosResponse<ConversationResponse>,
    Error,
    ConversationVideoForm
  >(conversateVideo, {
    onSuccess: (res) => {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true })
        .then(() => {})
        .catch(() => {});

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
  const conversateVoiceMutation = useMutation<
    AxiosResponse<ConversationResponse>,
    Error,
    ConversationVoiceForm
  >(conversateVoice, {
    onSuccess: (res) => {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true })
        .then(() => {})
        .catch(() => {});
      console.log(res);
      setAudioSrc(res.data.url);
      pushHistory(res.data.answer, 2);
    },
    onError: (err) => {
      console.log(err);
    },
  });
  const handleFinalTranscript = () => {
    SpeechRecognition.stopListening()
      .then(() => {})
      .catch(() => {});
    pushHistory(finalTranscript, 1);
    if (modelInformation && userInfo && !setVideoSrc) {
      const voiceForm = {
        question: finalTranscript,
        modelName: modelInformation.modelName,
        conversationText: modelInformation.conversationText2,
        eleVoiceId: 'uxgSoqINxv9NZ5NwNoZb',
        conversationNo,
        userNo: userInfo.userId,
        modelNo: modelInformation?.modelNo,
      };
      conversateVoiceMutation.mutate(voiceForm);
    }
    if (modelInformation && userInfo && setVideoSrc) {
      const videoForm = {
        question: finalTranscript,
        modelName: modelInformation.modelName,
        conversationText: modelInformation.conversationText2,
        heyVoiceId: 'uxgSoqINxv9NZ5NwNoZb',
        conversationNo,
        userNo: userInfo.userId,
        modelNo: modelInformation?.modelNo,
        avatarId: modelInformation.avatarId,
      };
      conversateVideoMutation.mutate(videoForm);
    }
  };

  useEffect(() => {
    // transcript가 있는데 finalTranscript가 아직 없는 경우, 녹음을 시작합니다.
    if (transcript && !finalTranscript && !audioRecording) {
      setAudioRecording(true);
    }

    // finalTranscript가 있는 경우, 녹음을 중지하고 대화를 처리합니다.
    if (finalTranscript && audioRecording) {
      setAudioRecording(false);
      handleFinalTranscript(); // 대화 처리를 위한 별도의 함수
    }
  }, [transcript, finalTranscript, audioRecording]);

  useEffect(() => {
    SpeechRecognition.startListening({ continuous: true })
      .then(() => {})
      .catch(() => {});
    return () => {
      SpeechRecognition.stopListening()
        .then(() => {})
        .catch(() => {});
      SpeechRecognition.abortListening()
        .then(() => {})
        .catch(() => {});
    };
  }, []);

  return (
    <div>
      <p>Microphone: {listening ? 'on' : 'off'}</p>
      <AudioRecorder
        modelInformation={modelInformation}
        conversationNo={conversationNo}
        audioRecording={audioRecording}
        setVideoSrc={setVideoSrc}
      />
      <button onClick={resetTranscript}>Reset</button>
      <p>{transcript}</p>
      <p>{finalTranscript}</p>
    </div>
  );
};
export default Dictaphone;
