import styled from 'styled-components';
import PageHeader from '@/components/navbar/PageHeader';
import { Image } from '@/components/common';

const HeaderBackGround = styled.div`
  top: 0;
  position: absolute;
  width: 100%;
  height: 12.5rem;
  background-color: var(--primary-color);
  z-index: -200;
`;

const TitleWrapper = styled.div`
  width: 100%;
  /* height: 14rem; */
  height: fit-content;
`;

const ImageWrapper = styled.div`
  margin: 2rem auto 0 auto;
  width: fit-content;
`;

const ModelCreate = () => {
  const headerContent = {
    left: 'Back',
    title: 'Create',
    right: 'Save',
  };
  return (
    <div>
      <HeaderBackGround />
      <TitleWrapper>
        <PageHeader content={headerContent} type={2} />
        <ImageWrapper>
          <Image src="/dummy/갱얼쥐.jpg" />
        </ImageWrapper>
      </TitleWrapper>
    </div>
  );
};

export default ModelCreate;
