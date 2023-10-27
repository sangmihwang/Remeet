import React, { useState } from 'react';
import styled from 'styled-components';
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

const Title = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  width: fit-content;
  margin: 24px auto;
`;

interface AudioFile {
  blob: Blob;
  url: string;
  checked: boolean;
}

const AudioUploadModal: React.FC<{
  onClose: () => void;
  onUpload?: (files: Blob[]) => void;
}> = ({ onClose, onUpload }) => {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const url = URL.createObjectURL(file);

      setAudioFiles([...audioFiles, { blob: file, url, checked: true }]);
    }
  };

  const handleCheckboxChange = (index: number) => {
    setAudioFiles((prev) =>
      prev.map((file, idx) =>
        idx === index ? { ...file, checked: !file.checked } : file,
      ),
    );
  };

  const handleSubmit = () => {
    const selectedBlobs = audioFiles
      .filter((file) => file.checked)
      .map((file) => file.blob);
    onUpload(selectedBlobs);
  };

  return (
    <BackGround>
      <Modal>
        <Handle onClick={onClose} />
        <Title>음성 업로드</Title>
        {/* <button onClick={onClose}>닫기</button> */}
        <input type="file" accept="audio/*" onChange={handleFileChange} />
        <ul>
          {audioFiles.map((file, index) => (
            <li key={index}>
              <audio controls src={file.url} />
              <input
                type="checkbox"
                checked={file.checked}
                onChange={() => handleCheckboxChange(index)}
              />
            </li>
          ))}
        </ul>
        <button onClick={handleSubmit}>API로 보내기</button>
        <LargeButton content="저장" />
      </Modal>
    </BackGround>
  );
};

export default AudioUploadModal;
