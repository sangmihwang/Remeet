import styled from 'styled-components';

const SmallBtn = styled.button<{ $type: number }>`
  width: 32vw;
  height: 3.2rem;
  font-size: 1rem;
`;

interface SmallButtonProps {
  text: string;
  type: 1 | 2;
}

const SmallButton = ({ text, type }: SmallButtonProps) => {
  return <SmallBtn $type={type}>{text}</SmallBtn>;
};

export default SmallButton;
