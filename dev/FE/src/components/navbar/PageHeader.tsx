import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const PageHeaderWrapper = styled.div`
  margin: 0 auto;
  width: 86vw;
  height: 2.25rem;
  position: relative;
  padding: 1.5rem 0 1rem 0;
`;

const Title = styled.span<{ $inputType: number }>`
  font-size: 1.5rem;
  font-weight: 700;
  position: absolute;
  left: 50%;
  color: ${(props) => {
    return props.$inputType === 1 ? '#000' : '#fff';
  }};
  transform: translateX(-50%);
`;

const SideBtn = styled.button<{ $inputType: number }>`
  padding: 0;
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
  background: transparent;
  border: 0;
  color: ${(props) => {
    return props.$inputType === 1 ? 'var(--primary-color)' : '#fff';
  }};
  position: absolute;
  top: 60%;
  transform: translateY(-50%);
`;

const LeftBtn = styled(SideBtn)`
  left: 0;
`;

const RightBtn = styled(SideBtn)`
  right: 0;
`;

interface PageHeaderProps {
  content: {
    left: string;
    title: string;
    right: string;
  };
  type: 1 | 2;
  rightButtonClick?: () => void;
}

const PageHeader = ({ content, type, rightButtonClick }: PageHeaderProps) => {
  const navigate = useNavigate();
  const handleReturnPage = () => {
    navigate(-1);
  };
  return (
    <PageHeaderWrapper>
      <LeftBtn $inputType={type} onClick={handleReturnPage}>
        {content.left}
      </LeftBtn>
      <Title $inputType={type}>{content.title}</Title>
      <RightBtn $inputType={type} onClick={rightButtonClick}>
        {content.right}
      </RightBtn>
    </PageHeaderWrapper>
  );
};

export default PageHeader;
