import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useSpring, animated, config } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';

const BackGround = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0);
  z-index: 1000;
`;

const ModalWrapper = styled.div`
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

const Modal: React.FC<{
  onClose: () => void;
  children?: React.ReactNode;
}> = ({ onClose, children }) => {
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
      if (oy < -70) cancel();

      if (last) {
        if (oy > HEIGHT * 0.5 || (vy > 0.5 && dy > 0)) {
          close();
        } else {
          open();
        }
      } else api.start({ y: oy, immediate: true });
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

  const AnimatedBackground = animated(BackGround);
  const AnimatedModal = animated(ModalWrapper);

  return (
    <>
      <AnimatedBackground style={bgStyle} onClick={onClose} />
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
        {children}
      </AnimatedModal>
    </>
  );
};

export default Modal;
