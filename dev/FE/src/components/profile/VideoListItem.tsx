import styled from 'styled-components';
import { ModelConversation } from '@/types/board';
import { VideoInformation } from '@/types/upload';

const URL = import.meta.env.VITE_API_BASE_URL as string;

const Wrapper = styled.div`
  width: 86vw;
  height: 4.5rem;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
`;

const Imgbox = styled.div<{ $imagePath: string }>`
  margin: auto 0;
  width: 3.125rem;
  height: 3.125rem;
  border-radius: 8px;
  background-color: #f6f6f6;
  background-image: url(${(props) => URL + props.$imagePath.slice(1)});
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
`;

const ContentWrapper = styled.div`
  width: 69vw;
  height: 4.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e8e8e8;
`;

const NameBox = styled.div`
  height: 1.25rem;
  font-weight: 600;
`;

const ButtonWrapper = styled.div`
  box-sizing: border-box;
`;

const Button = styled.button`
  margin: 0 0.3rem;
  box-sizing: border-box;
  border: 0;
  font-family: 1rem;
  font-weight: 600;
  padding: 1rem;
  border-radius: 8px;
  background-color: var(--primary-color);
  color: #fff;
`;

interface VideoListItemProps extends ModelConversation {
  setVideoInformation: (videoInfo: VideoInformation) => void;
  setIsVideoPlayerModal: (check: boolean) => void;
  setIsModal: (status: boolean) => void;
}

const VideoListItem = ({
  proVideoName,
  videoPath,
  holoPath,
  imagePath,
  setVideoInformation,
  setIsVideoPlayerModal,
  setIsModal,
}: VideoListItemProps) => {
  const changeVideoSrc = (type: string) => {
    if (type === '2D') {
      setVideoInformation({
        videoName: proVideoName,
        videoSrc: videoPath,
      });
    } else {
      setVideoInformation({
        videoName: proVideoName,
        videoSrc: holoPath,
      });
    }
    setIsVideoPlayerModal(true);
    setIsModal(true);
  };
  return (
    <Wrapper>
      <Imgbox $imagePath={imagePath} />
      <ContentWrapper>
        <NameBox>{proVideoName}</NameBox>
        <ButtonWrapper>
          <Button onClick={() => changeVideoSrc('2D')}>2D</Button>
          <Button onClick={() => changeVideoSrc('3D')}>3D</Button>
        </ButtonWrapper>
      </ContentWrapper>
    </Wrapper>
  );
};

export default VideoListItem;
