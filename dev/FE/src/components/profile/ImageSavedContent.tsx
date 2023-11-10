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

const ListItem = styled.li<{ $imagePath: string }>`
  list-style: none;
  margin: 0 auto;
  width: 85vw;
  height: 30vh;
  background-image: url(${(props) => props.$imagePath});
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
`;

interface ImageUploadProps {
  imageUrl: string | undefined;
  handleCloseModal: () => void;
}

const ImageSavedContent = ({
  imageUrl,
  handleCloseModal,
}: ImageUploadProps) => {
  return (
    <>
      <TitleWrapper>
        <Title>이미지 목록</Title>
      </TitleWrapper>
      <ListWrapper>
        {imageUrl && <ListItem $imagePath={imageUrl} />}
      </ListWrapper>
      <LargeButton onClick={handleCloseModal} content="닫기" />
    </>
  );
};

export default ImageSavedContent;
