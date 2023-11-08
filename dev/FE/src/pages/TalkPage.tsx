import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/navbar/PageHeader';
// import BottomNavigation from '@/components/navbar/BottomNavigation';
import { SmallButton, TalkBubble } from '@/components/common';
import AudioRecorder from '@/components/talk/AudioRecorder';
import Video from '@/components/talk/Video';
import Modal from '@/components/common/Modal';

const Wrapper = styled.div`
  background-color: var(--primary-color);
  padding-top: 1vh;
  height: 100vh;
`;

const TitleWrapper = styled.div`
  width: 100%;
  height: 35vh;
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
  const [isTalkHistory, setIsTalkHistory] = useState<boolean>(false);

  const headerContent = {
    left: '',
    title: '할머니',
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
    setIsTalkHistory(false);
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
        <AudioRecorder setVideoSrc={setVideoSrc} />
        <SmallButton
          type={1}
          text="대화 내역"
          onClick={() => setIsTalkHistory(true)}
        />
        <SmallButton
          type={2}
          onClick={handleEndConversation}
          text="대화 종료"
        />
      </ContentWrpper>
      {isTalkHistory && (
        <Modal onClose={handleCloseTalkHistory}>
          <TalkBubble />
        </Modal>
      )}
      {/* <BottomNavigation /> */}
    </Wrapper>
  );
};

export default TalkPage;
