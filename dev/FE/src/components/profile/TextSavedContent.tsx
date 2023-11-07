import styled from 'styled-components';

import { LargeButton } from '../common';

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

interface TextUploadProps {
  textFile: string | undefined;
  handleCloseModal: () => void;
}

const TextSavedContent = ({ textFile, handleCloseModal }: TextUploadProps) => {
  return (
    <>
      <TitleWrapper>
        <Title>대화 목록</Title>
      </TitleWrapper>
      <ListWrapper>
        <ListItem>
          <pre>{textFile}</pre>
        </ListItem>
      </ListWrapper>
      <LargeButton onClick={handleCloseModal} content="닫기" />
    </>
  );
};

export default TextSavedContent;
