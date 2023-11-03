import { useRef } from 'react';
import styled from 'styled-components';
import videojs from 'video.js';
import { LargeButton } from '../common';
import Video from '@/components/talk/Video';

const TitleWrapper = styled.div`
  width: 88vw;
  height: fit-content;
  text-align: center;
  margin: 24px auto;
  position: relative;
`;

const Title = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  display: inline-block;
`;

const ListWrapper = styled.ul`
  width: 92vw;
  height: 50vh;
  overflow-y: auto;
  margin: 0 auto;
  padding: 0;
`;

interface VideoContentProps {
  videoSrc: string | null;
  handleCloseModal: () => void;
}

const VideoContent = ({ videoSrc, handleCloseModal }: VideoContentProps) => {
  // 비디오 관련

  const playerRef = useRef(null);

  const videoJsOptions = {
    autoplay: false,
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

  const handleCloseClick = () => {
    setIsVideoPlayerModal(false);
    setIsModal(false);
  };
  return (
    <>
      <TitleWrapper>
        <Title>영상 업로드</Title>
      </TitleWrapper>
      <ListWrapper>
        <Video options={videoJsOptions} onReady={handlePlayerReady} />
      </ListWrapper>
      <LargeButton onClick={handleCloseModal} content="닫기" />
    </>
  );
};

export default VideoContent;
