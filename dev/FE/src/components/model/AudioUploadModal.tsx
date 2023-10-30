import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSpring, animated, config } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { LargeButton } from '../common';

const BackGround = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0);
  z-index: 1000;
`;

const Modal = styled.div`
  box-sizing: border-box;
  width: 100vw;
  left: 0;
  right: 0;
  height: calc(80vh + 120px);
  background-color: white;
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

interface AudioFile {
  blob: Blob;
  url: string;
  checked: boolean;
}

const AudioUploadModal: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const HEIGHT = window.innerHeight * 0.8;
  const [{ y }, api] = useSpring(() => ({ y: HEIGHT }));

  const open = () => {
    api.start({
      y: 0,
      immediate: false,
      config: config.stiff,
    });
  };

  useEffect(() => {
    open();
  });

  const close = (velocity = 0) => {
    api.start({
      y: HEIGHT,
      immediate: false,
      config: { ...config.stiff, velocity },
    });
    onClose();
  };

  const bind = useDrag(
    ({ last, velocity: [, vy], direction: [, dy], offset: [, oy], cancel }) => {
      // if the user drags up passed a threshold, then we cancel
      // the drag so that the sheet resets to its open position
      if (oy < -70) cancel();

      // when the user releases the sheet, we check whether it passed
      // the threshold for it to close, or if we reset it to its open positino
      if (last) {
        if (oy > HEIGHT * 0.5 || (vy > 0.5 && dy > 0)) {
          close();
        } else {
          open();
        }
      }
      // when the user keeps dragging, we just move the sheet according to
      // the cursor position
      else api.start({ y: oy, immediate: true });
    },
    {
      from: () => [0, y.get()],
      filterTaps: true,
      bounds: { top: 0 },
      rubberband: true,
    },
  );

  const display = y.to((py) => (py < HEIGHT ? 'block' : 'none'));

  const bgStyle = {
    backgroundColor: y.to(
      [0, HEIGHT],
      ['rgba(0, 0, 0, 0.7)', 'rgba(0, 0, 0, 0.3)'],
      'clamp',
    ),
  };

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

  const AnimatedBackground = animated(BackGround);
  const AnimatedModal = animated(Modal);

  return (
    <AnimatedBackground style={bgStyle}>
      <AnimatedModal
        {...bind()}
        style={{
          display,
          bottom: `calc(-100px)`,
          y,
          position: 'fixed',
          touchAction: 'none',
        }}
      >
        <Handle />
        <TitleWrapper>
          <Title>음성 업로드</Title>
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
      </AnimatedModal>
    </AnimatedBackground>
  );
};

export default AudioUploadModal;
