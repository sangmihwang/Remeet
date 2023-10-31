import React, { useState } from 'react';
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

interface TextUploadProps {
  currentTextFiles: TextFile[];
  setCurrentTextFiles: (textFiles: TextFile[]) => void;
}

const TextUpload = ({
  currentTextFiles,
  setCurrentTextFiles,
}: TextUploadProps) => {
  const [textFiles, setTextFiles] = useState<TextFile[]>(currentTextFiles);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const url = URL.createObjectURL(file);
      setTextFiles([...textFiles, { blob: file, url, checked: true }]);
      console.log(textFiles);
    }
  };

  const handleCheckboxChange = (index: number) => {
    console.log(textFiles);

    setTextFiles((prev) =>
      prev.map((file, idx) =>
        idx === index ? { ...file, checked: !file.checked } : file,
      ),
    );
  };

  const handleSaveTextFiles = () => {
    setTextFiles(textFiles.filter((file) => file.checked));
    setCurrentTextFiles(textFiles.filter((file) => file.checked));
  };

  return (
    <>
      <TitleWrapper>
        <Title>대화 업로드</Title>
        <Label htmlFor="AudioUploadInput">
          <Input
            id="AudioUploadInput"
            type="file"
            accept="text/*"
            onChange={handleFileChange}
          />
        </Label>
      </TitleWrapper>
      <ListWrapper>
        {textFiles.map((file, index) => (
          <ListItem key={index}>
            <span>{file.blob.name}</span>
            <input
              type="checkbox"
              checked={file.checked}
              onChange={() => handleCheckboxChange(index)}
            />
          </ListItem>
        ))}
      </ListWrapper>
      <LargeButton onClick={handleSaveTextFiles} content="저장" />
    </>
  );
};

export default TextUpload;
