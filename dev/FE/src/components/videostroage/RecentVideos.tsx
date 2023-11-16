import styled from 'styled-components';
import { ModelConversation } from '@/types/board';
import { VideoInformation } from '@/types/upload';

const Wrapper = styled.div`
  width: 90vw;
  margin: 1.5rem auto;
`;

const Text = styled.div`
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: 600;
`;

const ItemWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const Item = styled.div<{ $imagePath: string }>`
  width: 29vw;
  height: 29vw;
  border-radius: 8px;
  background-color: #f6f6f6;
  background-image: url(${(props) => props.$imagePath});
`;

interface RecentVideosProps {
  videos: ModelConversation[] | undefined;
  setVideoInformation: (videoSrc: VideoInformation) => void;
}

const RecentVideos = ({ videos, setVideoInformation }: RecentVideosProps) => {
  return (
    <Wrapper>
      <Text>최근 대화한 영상</Text>
      <ItemWrapper>
        {videos &&
          videos.map((video) => {
            const videoInformation = {
              videoSrc: video.videoPath,
              videoName: video.proVideoName,
            };
            return (
              <Item
                key={video.proVideoNo}
                $imagePath={video.imagePath}
                onClick={() => setVideoInformation(videoInformation)}
              />
            );
          })}
      </ItemWrapper>
    </Wrapper>
  );
};

export default RecentVideos;
