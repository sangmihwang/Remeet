import styled from 'styled-components';

const SmallBtn = styled.button<{ $type: number }>`
  box-sizing: border-box;
  /* width: 32vw; */
  height: fit-content;
  padding: 1rem 2rem;
  font-size: 1rem;
  margin: 1rem 0;
  font-weight: 600;
  background-color: var(--primary-color);
  color: #fff;
  border: 0;
  border-radius: 100px;
`;

interface SmallButtonProps {
  text: string;
  type?: 1 | 2;
  onClick?: () => void;
}

const SmallButton = ({ text, type, onClick }: SmallButtonProps) => {
  return (
    <SmallBtn $type={type} onClick={onClick}>
      {text}
    </SmallBtn>
  );
};

export default SmallButton;
