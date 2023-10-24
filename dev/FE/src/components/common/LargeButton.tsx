import styled from 'styled-components';

const LargeBtn = styled.button`
  margin: 0.3rem;
  width: 86vw;
  height: 3.2rem;
  border-radius: 100px;
  background-color: var(--primary-color);
  color: #fff;
  border: 0;
  font-weight: 600;
`;

interface LargeButtonProps {
  content: string;
}

const LargeButton = ({ content }: LargeButtonProps) => {
  return <LargeBtn>{content}</LargeBtn>;
};

export default LargeButton;
