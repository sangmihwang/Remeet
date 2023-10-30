import React, { useState } from 'react';
import styled from 'styled-components';
import { useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { LargeButton } from '../common';

const BackGround = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1000;
`;

const Modal = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80vh;
  background-color: white;
  /* padding: 20px; */
  box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.1);
  border-radius: 16px 16px 0 0;
  z-index: 1500;
`;

const Handle = styled.div`
  width: 9vw;
  height: 1vh;
  border-radius: 100px;
  background-color: #e8e8e8;
  margin: 36px auto 0 auto;
`;
const TitleWrapper = styled.div`
  width: 92vw;
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
`;

const ListItem = styled.li`
  list-style: none;
`;

interface AudioFile {
  blob: Blob;
  url: string;
  checked: boolean;
}

const AudioUploadModal: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));
  const bind = useDrag(({ down, movement: [mx, my] }) => {
    api.start({ x: down ? mx : 0, y: down ? my : 0, immediate: down });
  });

  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const url = URL.createObjectURL(file);

      setAudioFiles([...audioFiles, { blob: file, url, checked: true }]);
      console.log(audioFiles);
    }
  };

  const handleCheckboxChange = (index: number) => {
    setAudioFiles((prev) =>
      prev.map((file, idx) =>
        idx === index ? { ...file, checked: !file.checked } : file,
      ),
    );
  };

  return (
    <BackGround>
      <Modal>
        <animated.div
          {...bind()}
          style={{
            x,
            y,
            width: '200px',
            height: '50px',
            backgroundColor: '#000',
          }}
        />
        <Handle onClick={onClose} />
        <TitleWrapper>
          <Title>음성 업로드</Title>
          {/* <button onClick={onClose}>닫기</button> */}
          <Label htmlFor="AudioUploadInput">
            <Input
              id="AudioUploadInput"
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
            />
          </Label>
        </TitleWrapper>
        <ListWrapper>
          {audioFiles.map((file, index) => (
            <ListItem key={index}>
              {/* <span>{file.blob?.name ? file.blob?.name : ''}</span> */}
              <audio controls src={file.url} />
              <input
                type="checkbox"
                checked={file.checked}
                onChange={() => handleCheckboxChange(index)}
              />
            </ListItem>
          ))}
        </ListWrapper>
        <LargeButton content="저장" />
      </Modal>
    </BackGround>
  );
};

export default AudioUploadModal;
