import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '@/components/navbar/PageHeader';
// import BottomNavigation from '@/components/navbar/BottomNavigation';
import { SmallButton, TalkBubble } from '@/components/common';
import AudioRecorder from '@/components/talk/AudioRecorder';
import Video from '@/components/talk/Video';
import Modal from '@/components/common/Modal';
import { History } from '@/types/talk';
import { ModelInformation } from '@/types/peopleList';
import { getPeopleInfo } from '@/api/peoplelist';

const Wrapper = styled.div`
  background-color: var(--primary-color);
  padding-top: 1vh;
  height: 100vh;
`;

const TitleWrapper = styled.div`
  width: 100%;
  height: 45vh;
`;

const VideoWrapper = styled.div`
  margin: 0 auto;
  width: 86vw;
  height: 12.5rem;
  background-color: #fff;
`;

const ContentWrpper = styled.div`
  width: 100%;
  height: 65vh;
  background-color: #fff;
`;

const TalkPage = () => {
  const navigate = useNavigate();
  const { modelNo } = useParams();

  const [isOpenTalkHistoryModal, setIsOpentalkHistoryModal] =
    useState<boolean>(false);
  const [talkHistory, setTalkHistory] = useState<History[]>([]);
  const { data: modelInfomation } = useQuery<ModelInformation | undefined>(
    ['getModelInfo'],
    () => getPeopleInfo(Number(modelNo)),
  );
  console.log(modelInfomation);
  const pushHistory = (text: string, speakerType: number) => {
    setTalkHistory((prevState: History[]) => {
      if (speakerType === 1) {
        return [...prevState, { '나 ': text }];
      }
      return [...prevState, { '상대방 ': text }];
    });
  };

  const headerContent = {
    left: '',
    title: modelInfomation?.modelName ?? '로딩중',
    right: '',
  };
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  const playerRef = useRef(null);

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: videoSrc,
        type: 'video/mp4',
      },
    ],
  };

  const handlePlayerReady = (player: any) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on('waiting', () => {
      videojs.log('player is waiting');
    });

    player.on('dispose', () => {
      videojs.log('player will dispose');
    });
  };

  const handleEndConversation = () => {
    navigate('/board');
  };
  const handleCloseTalkHistory = () => {
    setIsOpentalkHistoryModal(false);
  };

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      const message =
        'You have unsaved changes. Are you sure you want to leave?';
      event.returnValue = message; // Gecko and Trident
      return message; // Gecko and WebKit
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // cleanup 함수에서 이벤트 리스너를 제거합니다.
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <Wrapper>
      <TitleWrapper>
        <PageHeader content={headerContent} type={2} />
        <VideoWrapper>
          <Video options={videoJsOptions} onReady={handlePlayerReady} />
        </VideoWrapper>
      </TitleWrapper>
      <ContentWrpper>
        <AudioRecorder
          pushHistory={pushHistory}
          modelInformation={modelInfomation}
          setVideoSrc={setVideoSrc}
        />
        <SmallButton
          type={1}
          text="대화 내역"
          onClick={() => setIsOpentalkHistoryModal(true)}
        />
        <SmallButton
          type={2}
          onClick={handleEndConversation}
          text="대화 종료"
        />
      </ContentWrpper>
      {isOpenTalkHistoryModal && (
        <Modal onClose={handleCloseTalkHistory}>
          <TalkBubble
            conversation={talkHistory}
            imagePath={modelInfomation?.imagePath}
          />
        </Modal>
      )}
      {/* <BottomNavigation /> */}
    </Wrapper>
  );
};

export default TalkPage;
