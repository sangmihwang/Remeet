import styled from 'styled-components';

const LargeBtn = styled.button`
  margin: 0.3rem auto;
  width: 86vw;
  height: 3.2rem;
  border-radius: 100px;
  padding: 0;
  background-color: var(--primary-color);
  color: #fff;
  border: 0;
  font-weight: 600;
  font-size: 1rem;
`;

const Wrapper = styled.div`
  width: 100%;
  text-align: center;
`;

interface LargeButtonProps {
  content: string;
}

const LargeButton = ({ content }: LargeButtonProps) => {
  return (
    <Wrapper>
      <LargeBtn>{content}</LargeBtn>
    </Wrapper>
  );
};

export default LargeButton;
