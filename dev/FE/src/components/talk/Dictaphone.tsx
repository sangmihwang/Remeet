import 'regenerator-runtime/runtime';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import styled from 'styled-components';
import { ModelInformation } from '@/types/peopleList';
import useAuth from '@/hooks/useAuth';
import { conversateVideo, conversateVoice } from '@/api/talk';
import {
  ConversationResponse,
  ConversationVideoForm,
  ConversationVoiceForm,
} from '@/types/talk';
import AudioRecorder from './AudioRecorder';
import AudioPlayerTest from './AudioPlayerTest';

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

interface DictaphoneProps {
  setVideoSrc?: (url: string) => void;
  modelInformation: ModelInformation | undefined;
  pushHistory: (text: string, speakerType: number) => void;
  conversationNo: number;
  isSaving: boolean;
}

const Dictaphone = ({
  setVideoSrc,
  modelInformation,
  pushHistory,
  conversationNo,
  isSaving,
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
    console.log('보내기');
    SpeechRecognition.stopListening()
      .then(() => {})
      .catch(() => {});
    pushHistory(finalTranscript, 1);
    if (
      modelInformation &&
      userInfo &&
      !setVideoSrc &&
      modelInformation.eleVoiceId
    ) {
      const voiceForm = {
        question: finalTranscript,
        modelName: modelInformation.modelName,
        conversationText: modelInformation.conversationText2,
        eleVoiceId: modelInformation.eleVoiceId,
        conversationNo,
        userNo: userInfo.userNo,
        modelNo: modelInformation?.modelNo,
      };
      conversateVoiceMutation.mutate(voiceForm);
    }
    if (
      modelInformation &&
      userInfo &&
      setVideoSrc &&
      modelInformation.heyVoiceId
    ) {
      const videoForm = {
        question: finalTranscript,
        modelName: modelInformation.modelName,
        conversationText: modelInformation.conversationText2,
        heyVoiceId: modelInformation.heyVoiceId,
        eleVoiceId: modelInformation.eleVoiceId,
        conversationNo,
        userNo: userInfo.userNo,
        modelNo: modelInformation?.modelNo,
        avatarId: modelInformation.avatarId,
      };
      conversateVideoMutation.mutate(videoForm);
    }
  };

  useEffect(() => {
    // transcript가 있는데 finalTranscript가 아직 없는 경우, 녹음을 시작합니다.
    if (transcript && !finalTranscript && !audioRecording && !isSaving) {
      setAudioRecording(true);
    }

    // finalTranscript가 있는 경우, 녹음을 중지하고 대화를 처리합니다.
    if (finalTranscript && audioRecording && !isSaving) {
      setAudioRecording(false);
      handleFinalTranscript(); // 대화 처리를 위한 별도의 함수
    }
  }, [transcript, finalTranscript, audioRecording, isSaving]);

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
    <Wrapper>
      <TextWrapper>
        {listening}
        <RecordButton disabled={listening} />
        <Text>{transcript}</Text>
      </TextWrapper>
      {!setVideoSrc && (
        <>
          <div>상대방의 대답</div>
          {audioSrc && <AudioPlayerTest src={audioSrc} />}
        </>
      )}
      {modelInformation && (
        <AudioRecorder
          modelInformation={modelInformation}
          conversationNo={conversationNo}
          audioRecording={audioRecording}
          setVideoSrc={setVideoSrc}
        />
      )}
    </Wrapper>
  );
};
export default Dictaphone;
