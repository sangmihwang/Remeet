import { useState } from 'react';
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

const Label = styled.label`
  width: 26px;
  height: 26px;
  border: 2px solid var(--primary-color);
  border-radius: 100%;
  background-image: url('/icon/plus_icon.svg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 70%;
  position: absolute;
  right: 0;
`;

const Input = styled.input`
  display: none;
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

interface ImageUploadProps {
  currentImage: ImageFile | null;
  setCurrentImage: (imageFile: ImageFile | null) => void;
}

const ImageUpload = ({ currentImage, setCurrentImage }: ImageUploadProps) => {
  const [imageFile, setImageFile] = useState<ImageFile | null>(currentImage);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      const url = URL.createObjectURL(file);
      const newImageFile: ImageFile = {
        blob: file,
        url,
      };
      setImageFile(newImageFile);
    }
  };

  const handleSaveImageFile = () => {
    setCurrentImage(imageFile);
  };

  return (
    <>
      <TitleWrapper>
        <Title>이미지 업로드</Title>
        <Label htmlFor="AudioUploadInput">
          <Input
            id="AudioUploadInput"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </Label>
      </TitleWrapper>
      <ListWrapper>
        <ListItem>
          {/* <span>{file.blob?.name ? file.blob?.name : ''}</span> */}
          {imageFile && <img src={imageFile.url} />}
        </ListItem>
      </ListWrapper>
      <LargeButton onClick={handleSaveImageFile} content="저장" />
    </>
  );
};

export default ImageUpload;
