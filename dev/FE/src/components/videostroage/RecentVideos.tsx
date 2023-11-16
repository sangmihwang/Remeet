import styled from 'styled-components';
import { TalkInformation } from '@/types/board';
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
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
`;

interface RecentVideosProps {
  videos: TalkInformation[] | undefined;
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
              videoSrc: video.filePath,
              videoName: video.fileName,
            };
            return (
              <Item
                key={video.fileNo}
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
