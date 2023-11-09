import styled from 'styled-components';
import { LargeButton } from '../common';
import { VoiceList } from '@/types/peopleList';

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

const ListItem = styled.li`
  list-style: none;
`;

interface AudioUploadProps {
  audioFiles: VoiceList[] | undefined;
  handleCloseModal: () => void;
}

const AudioSavedContent = ({
  audioFiles,
  handleCloseModal,
}: AudioUploadProps) => {
  return (
    <>
      <TitleWrapper>
        <Title>음성 목록</Title>
      </TitleWrapper>
      <ListWrapper>
        {audioFiles &&
          audioFiles.map((file) => (
            <ListItem key={file.voiceNo}>
              <audio controls src={file.voicePath} />
            </ListItem>
          ))}
      </ListWrapper>
      <LargeButton onClick={handleCloseModal} content="닫기" />
    </>
  );
};

export default AudioSavedContent;
