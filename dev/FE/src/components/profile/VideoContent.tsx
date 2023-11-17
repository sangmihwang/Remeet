import styled from 'styled-components';
import ReactPlayer from 'react-player';
import { LargeButton } from '../common';
import { VideoInformation } from '@/types/upload';

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
  videoInformation: VideoInformation;
  handleCloseModal: () => void;
}

const VideoContent = ({
  videoInformation,
  handleCloseModal,
}: VideoContentProps) => {
  return (
    <>
      <TitleWrapper>
        <Title>{videoInformation.videoName}</Title>
      </TitleWrapper>
      <ListWrapper>
        <ReactPlayer
          url={videoInformation.videoSrc}
          playing
          controls
          width="100%"
          height="100%"
        />
      </ListWrapper>
      <LargeButton onClick={handleCloseModal} content="닫기" />
    </>
  );
};

export default VideoContent;
